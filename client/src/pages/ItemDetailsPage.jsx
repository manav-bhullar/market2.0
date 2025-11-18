import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI, reviewsAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';
import { Star, Mail, Phone, Calendar, User } from 'lucide-react';

/**
 * ItemDetailsPage - Display full item details
 * Shows seller info, reviews, and contact options
 */
export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getItemById(id);
      setItem(response.data.item);
      setReviews(response.data.reviews);

      // Check if current user has already reviewed
      const userReviewData = response.data.reviews.find((r) => r.userId._id === user?._id);
      if (userReviewData) {
        setUserReview(userReviewData);
        setRating(userReviewData.rating);
        setComment(userReviewData.comment);
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewsAPI.addReview(id, { rating, comment });
      // Refresh item details and reviews
      await fetchItemDetails();
      setComment('');
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleContactSeller = () => {
    if (item?.sellerId?.email) {
      window.location.href = `mailto:${item.sellerId.email}?subject=Interested in: ${item.title}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Item not found</h1>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-4 font-medium"
        >
          ← Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item Image and Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Image */}
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                {item.imageURL ? (
                  <img
                    src={item.imageURL}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500 text-lg">No Image Available</div>
                )}
              </div>

              {/* Item Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded">
                      {item.category}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-800 mt-3">{item.title}</h1>
                  </div>
                  <p className="text-3xl font-bold text-green-600">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
                  <Calendar size={16} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>

                <div className="prose prose-sm max-w-none">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Card and Contact */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Seller Information</h2>

              {/* Seller Profile */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <img
                  src={item.sellerId?.photoURL}
                  alt={item.sellerId?.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">{item.sellerId?.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.round(item.sellerId?.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.sellerId?.averageRating?.toFixed(1)} ({reviews.length} reviews)
                  </p>
                </div>
              </div>

              {/* Member Since */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={18} />
                  <span>Member since {new Date(item.sellerId?.createdAt).getFullYear()}</span>
                </div>
              </div>

              {/* Contact Button */}
              <button
                onClick={handleContactSeller}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Contact Seller
              </button>

              {item.sellerId?._id === user?._id && (
                <button
                  onClick={() => navigate(`/edit-item/${id}`)}
                  className="w-full mt-3 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Edit Listing
                </button>
              )}
            </div>

            {/* Review Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Leave a Review</h2>

              {isAuthenticated && item.sellerId?._id !== user?._id ? (
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-3xl transition"
                        >
                          <Star
                            size={28}
                            className={
                              star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this item..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-gray-600">
                  {!isAuthenticated
                    ? 'Please log in to leave a review'
                    : 'You cannot review your own items'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewSection itemId={id} />
        </div>
      </div>
    </div>
  );
}
