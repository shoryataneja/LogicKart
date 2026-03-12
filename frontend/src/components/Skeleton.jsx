const Skeleton = ({ className = "" }) => (
  <div className={`skeleton ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="card p-4 flex flex-col gap-3">
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton className="h-3 w-1/3" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-9 w-full rounded-lg mt-1" />
  </div>
);

export default Skeleton;
