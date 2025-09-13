import { Star } from 'lucide-react';

const StarRating = ({ rating, interactive = false, onRatingChange, size = "w-5 h-5" }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating 
              ? 'text-amber-400 fill-current' 
              : 'text-gray-400'
          } ${interactive ? 'cursor-pointer hover:text-amber-400 transition-colors' : ''}`}
          onClick={interactive ? () => onRatingChange(star) : undefined}
        />
      ))}
    </div>
  );
};

export default StarRating;