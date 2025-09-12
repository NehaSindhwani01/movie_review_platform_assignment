import { Star } from 'lucide-react';

const StarRating = ({ rating, interactive = false, onRatingChange, size = "w-5 h-5" }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive ? () => onRatingChange(star) : undefined}
        />
      ))}
    </div>
  );
};

export default StarRating;