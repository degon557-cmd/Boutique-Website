
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../../types';
import { getProducts, deleteProduct } from '../../services/api';
import { formatCurrency, truncateText } from '../../utils/helpers';
import Modal from '../Modal';
import DynamicProductForm from './DynamicProductForm';

const ProductManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
            fetchProducts();
        }
    };
    
    const handleFormSuccess = () => {
        setIsModalOpen(false);
        fetchProducts();
    }

    if (isLoading) return <p>Loading products...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Products</h2>
                <button onClick={handleAdd} className="px-4 py-2 bg-soft-blue-600 text-white rounded-md hover:bg-soft-blue-700">Add Product</button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium">{product.name}</td>
                                <td className="px-6 py-4">{product.category_name}</td>
                                <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                                <td className="px-6 py-4">{truncateText(product.description, 50)}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => handleEdit(product)} className="font-medium text-soft-blue-600 dark:text-soft-blue-500 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <DynamicProductForm product={editingProduct} onSuccess={handleFormSuccess} />
            </Modal>
        </div>
    );
};

export default ProductManager;
