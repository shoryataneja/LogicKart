import { Star } from "lucide-react";

const StarRating = ({ rating = 4.2, count, size = 14 }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[...Array(full)].map((_, i) => (
          <Star key={`f${i}`} size={size} className="fill-amber-400 text-amber-400" />
        ))}
        {half && (
          <span className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-gray-200 fill-gray-200 absolute" />
            <span className="absolute overflow-hidden" style={{ width: "50%" }}>
              <Star size={size} className="fill-amber-400 text-amber-400" />
            </span>
          </span>
        )}
        {[...Array(empty)].map((_, i) => (
          <Star key={`e${i}`} size={size} className="text-gray-200 fill-gray-200" />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
};

export default StarRating;
