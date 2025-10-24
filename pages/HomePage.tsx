
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category } from '../types';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import PurchaseModal from '../components/PurchaseModal';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
        const matchesCategory = selectedCategory ? product.category_id === parseInt(selectedCategory) : true;
        const matchesSearch = searchTerm ? 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div>
      {/* Hero Section */}
      <section className="h-96 bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: `url('https://picsum.photos/seed/fashion-hero/1600/600')` }}>
        <div className="text-center bg-black bg-opacity-50 p-8 rounded-md">
          <h1 className="text-4xl md:text-5xl font-bold">Discover Premium Fashion</h1>
          <p className="mt-4 text-lg">at Boutique-Ku</p>
          <a href="#products" className="mt-6 inline-block bg-soft-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-soft-blue-700 transition-colors">
            Shop Now
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Our Collection</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input 
                type="text" 
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-soft-blue-500 focus:outline-none"
            />
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-soft-blue-500 focus:outline-none"
            >
                <option value="">All Categories</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
        
        {isLoading ? (
          <div className="text-center">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onBuyClick={handleBuyClick} />
            ))}
          </div>
        ) : (
            <div className="text-center py-16 text-gray-500">
                <p className="text-xl">No products found.</p>
                <p>Try adjusting your search or filter.</p>
            </div>
        )}
      </section>
      
      <PurchaseModal 
        product={selectedProduct} 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
