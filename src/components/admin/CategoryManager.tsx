import React, { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types';
import { getCategories, deleteCategory } from '@/services/api';
// A proper form for adding/editing categories would be complex. This is a simplified view.

const CategoryManager: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDelete = async (categoryId: number) => {
        if (window.confirm('Are you sure you want to delete this category? This can only be done if no products are using it.')) {
            const success = await deleteCategory(categoryId);
            if(success) fetchCategories();
        }
    };

    if (isLoading) return <p>Loading categories...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Categories</h2>
                {/* <button className="px-4 py-2 bg-soft-blue-600 text-white rounded-md hover:bg-soft-blue-700">Add Category</button> */}
                 <p className="text-sm text-gray-500">Note: Add/Edit functionality to be implemented.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Fields</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium">{cat.name}</td>
                                <td className="px-6 py-4">{cat.fields.map(f => f.name).join(', ')}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button className="font-medium text-soft-blue-600 dark:text-soft-blue-500 hover:underline disabled:text-gray-400" disabled>Edit</button>
                                    <button onClick={() => handleDelete(cat.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManager;
