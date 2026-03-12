#!/bin/bash
# ============================================================
# LogicKart — AWS Full Setup Script
# Run this ONCE after refreshing your AWS credentials
# Usage: bash setup.sh
# ============================================================

set -e  # Exit on any error

# ── Colors for output ───────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()    { echo -e "${GREEN}[✓]${NC} $1"; }
warn()   { echo -e "${YELLOW}[!]${NC} $1"; }
error()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }
section(){ echo -e "\n${BLUE}══════════════════════════════════════${NC}"; echo -e "${BLUE}  $1${NC}"; echo -e "${BLUE}══════════════════════════════════════${NC}"; }

# ── Config ───────────────────────────────────────────────────
REGION=$(aws configure get region 2>/dev/null || echo "us-east-1")
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
CLUSTER_NAME="logickart-cluster"
SERVICE_NAME="logickart-service"
TASK_FAMILY="logickart-task"
BACKEND_REPO="logickart-backend"
FRONTEND_REPO="logickart-frontend"
ECR_BASE="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

log "AWS Account ID: $ACCOUNT_ID"
log "Region: $REGION"
log "ECR Base: $ECR_BASE"

# ============================================================
# SECTION 1 — ECR
# ============================================================
section "SECTION 1 — Creating ECR Repositories"

# Create backend repo (ignore error if already exists)
aws ecr describe-repositories --repository-names $BACKEND_REPO --region $REGION > /dev/null 2>&1 || \
  aws ecr create-repository \
    --repository-name $BACKEND_REPO \
    --region $REGION \
    --image-scanning-configuration scanOnPush=true \
    --image-tag-mutability MUTABLE \
    --output json > /dev/null
log "ECR repo created: $BACKEND_REPO"

# Create frontend repo
aws ecr describe-repositories --repository-names $FRONTEND_REPO --region $REGION > /dev/null 2>&1 || \
  aws ecr create-repository \
    --repository-name $FRONTEND_REPO \
    --region $REGION \
    --image-scanning-configuration scanOnPush=true \
    --image-tag-mutability MUTABLE \
    --output json > /dev/null
log "ECR repo created: $FRONTEND_REPO"

# ── Build and push Docker images ─────────────────────────────
section "SECTION 1 — Building & Pushing Docker Images to ECR"

# Login to ECR
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ECR_BASE
log "Logged in to ECR"

COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "manual")

# Build and push backend
log "Building backend image..."
docker build -t $BACKEND_REPO:latest ./backend
docker tag $BACKEND_REPO:latest $ECR_BASE/$BACKEND_REPO:latest
docker tag $BACKEND_REPO:latest $ECR_BASE/$BACKEND_REPO:$COMMIT_SHA
docker push $ECR_BASE/$BACKEND_REPO:latest
docker push $ECR_BASE/$BACKEND_REPO:$COMMIT_SHA
log "Backend image pushed: $ECR_BASE/$BACKEND_REPO:latest"
log "Backend image pushed: $ECR_BASE/$BACKEND_REPO:$COMMIT_SHA"

# Build and push frontend
log "Building frontend image..."
docker build \
  --build-arg VITE_API_URL=http://localhost:3002/api \
  -t $FRONTEND_REPO:latest ./frontend
docker tag $FRONTEND_REPO:latest $ECR_BASE/$FRONTEND_REPO:latest
docker tag $FRONTEND_REPO:latest $ECR_BASE/$FRONTEND_REPO:$COMMIT_SHA
docker push $ECR_BASE/$FRONTEND_REPO:latest
docker push $ECR_BASE/$FRONTEND_REPO:$COMMIT_SHA
log "Frontend image pushed: $ECR_BASE/$FRONTEND_REPO:latest"
log "Frontend image pushed: $ECR_BASE/$FRONTEND_REPO:$COMMIT_SHA"

# ============================================================
# SECTION 2 — ECS
# ============================================================
section "SECTION 2 — Creating ECS Cluster"

aws ecs describe-clusters --clusters $CLUSTER_NAME --region $REGION \
  --query 'clusters[0].status' --output text 2>/dev/null | grep -q "ACTIVE" || \
  aws ecs create-cluster \
    --cluster-name $CLUSTER_NAME \
    --capacity-providers FARGATE \
    --region $REGION \
    --output json > /dev/null
log "ECS Cluster ready: $CLUSTER_NAME"

# ── Create CloudWatch Log Groups ─────────────────────────────
aws logs create-log-group --log-group-name /ecs/logickart-backend --region $REGION 2>/dev/null || true
aws logs create-log-group --log-group-name /ecs/logickart-frontend --region $REGION 2>/dev/null || true
log "CloudWatch log groups created"

# ── Create ECS Task Execution Role ───────────────────────────
section "SECTION 2 — Setting up IAM Role for ECS"

ROLE_NAME="ecsTaskExecutionRole"

# Check if role exists
aws iam get-role --role-name $ROLE_NAME > /dev/null 2>&1 || {
  aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document '{
      "Version":"2012-10-17",
      "Statement":[{
        "Effect":"Allow",
        "Principal":{"Service":"ecs-tasks.amazonaws.com"},
        "Action":"sts:AssumeRole"
      }]
    }' > /dev/null
  aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
  log "IAM role created: $ROLE_NAME"
}
log "IAM role ready: $ROLE_NAME"

EXECUTION_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"

# ── Register Task Definition ─────────────────────────────────
section "SECTION 2 — Registering ECS Task Definition"

cat > /tmp/logickart-task-def.json << EOF
{
  "family": "${TASK_FAMILY}",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "${EXECUTION_ROLE_ARN}",
  "containerDefinitions": [
    {
      "name": "logickart-backend",
      "image": "${ECR_BASE}/${BACKEND_REPO}:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3002,
          "hostPort": 3002,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "PORT", "value": "3002"},
        {"name": "NODE_ENV", "value": "production"},
        {"name": "MONGO_URI", "value": "$(grep MONGO_URI backend/.env | cut -d'=' -f2- | tr -d ' ')"},
        {"name": "JWT_SECRET", "value": "$(grep JWT_SECRET backend/.env | cut -d'=' -f2- | tr -d ' ')"},
        {"name": "CLIENT_URL", "value": "*"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/logickart-backend",
          "awslogs-region": "${REGION}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -qO- http://localhost:3002/ || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 15
      }
    },
    {
      "name": "logickart-frontend",
      "image": "${ECR_BASE}/${FRONTEND_REPO}:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/logickart-frontend",
          "awslogs-region": "${REGION}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -qO- http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 10
      }
    }
  ]
}
EOF

aws ecs register-task-definition \
  --cli-input-json file:///tmp/logickart-task-def.json \
  --region $REGION \
  --output json > /dev/null
log "Task definition registered: $TASK_FAMILY"

# ── Get default VPC and Subnets ──────────────────────────────
section "SECTION 2 — Getting Network Configuration"

VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=isDefault,Values=true" \
  --query "Vpcs[0].VpcId" \
  --output text \
  --region $REGION)
log "VPC: $VPC_ID"

SUBNET_IDS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query "Subnets[*].SubnetId" \
  --output text \
  --region $REGION | tr '\t' ',')
log "Subnets: $SUBNET_IDS"

# ── Create Security Group ────────────────────────────────────
SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=logickart-sg" "Name=vpc-id,Values=$VPC_ID" \
  --query "SecurityGroups[0].GroupId" \
  --output text \
  --region $REGION 2>/dev/null)

if [ "$SG_ID" = "None" ] || [ -z "$SG_ID" ]; then
  SG_ID=$(aws ec2 create-security-group \
    --group-name logickart-sg \
    --description "LogicKart ECS Security Group" \
    --vpc-id $VPC_ID \
    --region $REGION \
    --query "GroupId" \
    --output text)
  # Allow inbound on port 80 and 3002
  aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp --port 80 --cidr 0.0.0.0/0 \
    --region $REGION > /dev/null
  aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp --port 3002 --cidr 0.0.0.0/0 \
    --region $REGION > /dev/null
  log "Security group created: $SG_ID"
else
  log "Security group exists: $SG_ID"
fi

# ── Create ECS Service ───────────────────────────────────────
section "SECTION 2 — Creating ECS Service"

SERVICE_EXISTS=$(aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME \
  --region $REGION \
  --query "services[0].status" \
  --output text 2>/dev/null)

if [ "$SERVICE_EXISTS" = "ACTIVE" ]; then
  warn "Service already exists, updating..."
  aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --task-definition $TASK_FAMILY \
    --force-new-deployment \
    --region $REGION \
    --output json > /dev/null
else
  FIRST_SUBNET=$(echo $SUBNET_IDS | cut -d',' -f1)
  aws ecs create-service \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --task-definition $TASK_FAMILY \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$FIRST_SUBNET],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
    --region $REGION \
    --output json > /dev/null
fi
log "ECS Service running: $SERVICE_NAME"

# ── Update ecs-task-definition.json with real values ─────────
section "Updating project files with real values"

sed -i.bak \
  -e "s/ACCOUNT_ID/$ACCOUNT_ID/g" \
  -e "s/REGION/$REGION/g" \
  ecs-task-definition.json
rm -f ecs-task-definition.json.bak
log "ecs-task-definition.json updated"

# ── Write GitHub Secrets helper ──────────────────────────────
cat > github-secrets.txt << EOF
Add these to GitHub → Settings → Secrets → Actions:

AWS_ACCESS_KEY_ID     = $(aws configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY = $(aws configure get aws_secret_access_key)
AWS_REGION            = ${REGION}
VITE_API_URL          = http://$(aws ecs describe-tasks \
  --cluster $CLUSTER_NAME \
  --tasks $(aws ecs list-tasks --cluster $CLUSTER_NAME --query "taskArns[0]" --output text --region $REGION 2>/dev/null) \
  --query "tasks[0].containers[0].networkInterfaces[0].privateIpv4Address" \
  --output text --region $REGION 2>/dev/null || echo "PENDING"):3002/api
EOF
log "GitHub secrets saved to: github-secrets.txt"

# ── Final Summary ─────────────────────────────────────────────
section "SETUP COMPLETE"
echo ""
echo -e "${GREEN}ECR Backend:${NC}  $ECR_BASE/$BACKEND_REPO:latest"
echo -e "${GREEN}ECR Frontend:${NC} $ECR_BASE/$FRONTEND_REPO:latest"
echo -e "${GREEN}ECS Cluster:${NC}  $CLUSTER_NAME"
echo -e "${GREEN}ECS Service:${NC}  $SERVICE_NAME"
echo -e "${GREEN}Task Family:${NC}  $TASK_FAMILY"
echo ""
echo -e "${YELLOW}Next step:${NC} Open github-secrets.txt and add those 4 secrets to GitHub"
echo -e "${YELLOW}Then run:${NC}  git add . && git commit -m 'ci: add AWS deployment' && git push origin main"
echo ""
