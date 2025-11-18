import { Heart, MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ItemCard Component - Displays item listing in grid
 * Shows item image, title, price, seller info, and rating
 */
export default function ItemCard({ item }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
      {/* Item Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {item.imageURL ? (
          <img
            src={item.imageURL}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
            No Image
          </div>
        )}
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100">
          <Heart size={20} className="text-red-500" />
        </button>
      </div>

      {/* Item Info */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
          {item.category}
        </span>

        {/* Title */}
        <Link to={`/item/${item._id}`}>
          <h3 className="text-lg font-bold text-gray-800 mt-2 hover:text-blue-600 truncate">
            {item.title}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-2xl font-bold text-green-600 mt-2">₹{item.price}</p>

        {/* Description Preview */}
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>

        {/* Seller Info */}
        <div className="mt-3 flex items-center gap-2 border-t pt-3">
          <img
            src={item.sellerId?.photoURL}
            alt={item.sellerId?.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{item.sellerId?.name}</p>
            <p className="text-xs text-yellow-500">★ {item.averageRating || 0}</p>
          </div>
        </div>

        {/* View Details Link */}
        <Link
          to={`/item/${item._id}`}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
