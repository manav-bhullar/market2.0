import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemsAPI, reviewsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import { Edit2, Trash2, Star } from 'lucide-react';

/**
 * ProfilePage - User's profile and listings
 * Shows seller's items, ratings, and statistics
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [sellerStats, setSellerStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, statsResponse] = await Promise.all([
        itemsAPI.getUserItems(),
        reviewsAPI.getSellerStats(user._id),
      ]);

      setItems(itemsResponse.data.items);
      setSellerStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsAPI.deleteItem(itemId);
        setItems(items.filter((item) => item._id !== itemId));
        alert('Item deleted successfully');
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-8">
            {/* Profile Photo */}
            <img
              src={user?.photoURL}
              alt={user?.name}
              className="w-24 h-24 rounded-full"
            />

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Items Listed</p>
                  <p className="text-2xl font-bold text-blue-600">{items.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Items Sold</p>
                  <p className="text-2xl font-bold text-green-600">{sellerStats?.itemsSold || 0}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-yellow-600">
                      {(sellerStats?.averageRating || 0).toFixed(1)}
                    </p>
                    <Star size={20} className="fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b">
            <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
              My Listings
            </button>
          </div>
        </div>

        {/* My Listings */}
        <div>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item._id} className="relative">
                  <ItemCard item={item} />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-item/${item._id}`)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                      title="Edit item"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      title="Delete item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">You haven't posted any items yet</p>
              <button
                onClick={() => navigate('/post')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Post Your First Item
              </button>
            </div>
          )}
        </div>

        {/* Buyer Reviews */}
        {sellerStats && sellerStats.totalReviews > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews from Buyers</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(sellerStats.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-700">
                  {sellerStats.totalReviews} reviews • {(sellerStats.averageRating || 0).toFixed(1)} average rating
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
