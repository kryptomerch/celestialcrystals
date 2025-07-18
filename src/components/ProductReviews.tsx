'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Star, User, CheckCircle, Edit2, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
  user: {
    name: string;
    image?: string;
  };
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
  }>;
}

interface ProductReviewsProps {
  crystalId: string;
  crystalName: string;
}

export default function ProductReviews({ crystalId, crystalName }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [crystalId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/crystals/${crystalId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setSummary(data.summary);
      } else {
        setError('Failed to load reviews');
      }
    } catch (error) {
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('Please sign in to write a review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/crystals/${crystalId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (response.ok) {
        setReviews(prev => [data.review, ...prev]);
        setSummary(prev => prev ? {
          ...prev,
          totalReviews: prev.totalReviews + 1,
          averageRating: ((prev.averageRating * prev.totalReviews) + reviewForm.rating) / (prev.totalReviews + 1)
        } : null);
        setShowReviewForm(false);
        setReviewForm({ rating: 5, title: '', comment: '' });
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setError('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      {summary && (
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium text-gray-900">Customer Reviews</h3>
            {session && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="celestial-button-outline"
              >
                Write a Review
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">
                {summary.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(summary.averageRating))}
              <p className="text-sm text-gray-600 mt-2">
                Based on {summary.totalReviews} review{summary.totalReviews === 1 ? '' : 's'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const distribution = summary.ratingDistribution.find(d => d.rating === rating);
                const count = distribution?.count || 0;
                const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center space-x-2 text-sm">
                    <span className="w-8">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Write a Review for {crystalName}</h4>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              {renderStars(reviewForm.rating, true, (rating) => 
                setReviewForm(prev => ({ ...prev, rating }))
              )}
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Review Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Summarize your experience"
              />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review *
              </label>
              <textarea
                id="comment"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Share your experience with this crystal..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters ({reviewForm.comment.length}/10)
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting || reviewForm.comment.length < 10}
                className="celestial-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="celestial-button-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
            <p className="text-gray-600">Be the first to review this crystal!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {review.user.image ? (
                      <img
                        src={review.user.image}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                      {review.isVerified && (
                        <CheckCircle className="w-4 h-4 text-green-500" title="Verified Purchase" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                        {review.updatedAt && review.updatedAt !== review.createdAt && ' (edited)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {review.title && (
                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              )}

              <p className="text-gray-700 leading-relaxed">{review.comment}</p>

              {review.isVerified && (
                <div className="mt-3 flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified Purchase
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {!session && reviews.length > 0 && (
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Have experience with this crystal?</p>
          <button
            onClick={() => window.location.href = '/auth/signin'}
            className="celestial-button"
          >
            Sign In to Write a Review
          </button>
        </div>
      )}
    </div>
  );
}
