import React from 'react';
import { Product } from '@/types';
import { formatCurrency, truncateText } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
  onBuyClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyClick }) => {
  const mediaUrl = product.media_urls[0];
  const isVideo = mediaUrl && mediaUrl.endsWith('.mp4');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700">
        {isVideo ? (
          <video className="w-full h-full object-cover" src={mediaUrl} controls muted loop>
            Your browser does not support the video tag.
          </video>
        ) : (
          <img className="w-full h-full object-cover" src={mediaUrl} alt={product.name} />
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{product.category_name}</p>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 h-10">{truncateText(product.description, 60)}</p>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 h-8 overflow-hidden">
          {Object.entries(product.specific_details).map(([key, value]) => (
            <span key={key} className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 mr-1 mb-1">
              {key}: {Array.isArray(value) ? value.join(', ') : value}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold text-soft-blue-600 dark:text-soft-blue-400">{formatCurrency(product.price)}</p>
          <button
            onClick={() => onBuyClick(product)}
            className="px-4 py-2 bg-soft-blue-600 text-white text-sm font-medium rounded-md hover:bg-soft-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soft-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
