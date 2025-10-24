import React, { useState, useEffect } from 'react';
import { Product, Category, CategoryField } from '@/types';
import { getCategories, addProduct, updateProduct } from '@/services/api';

interface DynamicProductFormProps {
    product: Product | null;
    onSuccess: () => void;
}

const DynamicProductForm: React.FC<DynamicProductFormProps> = ({ product, onSuccess }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState<string>(product?.category_id.toString() || '');
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState<number | string>(product?.price || '');
    const [description, setDescription] = useState(product?.description || '');
    const [specificDetails, setSpecificDetails] = useState<{[key: string]: any}>(product?.specific_details || {});
    
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);
    
    const selectedCategory = categories.find(c => c.id.toString() === categoryId);

    const handleDetailChange = (fieldName: string, value: any) => {
        setSpecificDetails(prev => ({...prev, [fieldName]: value}));
    };
    
    const renderField = (field: CategoryField) => {
        const value = specificDetails[field.name] || (field.type === 'multi-select' ? [] : '');
        switch (field.type) {
            case 'text':
                return <input type="text" value={value} onChange={e => handleDetailChange(field.name, e.target.value)} required={field.required} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"/>;
            case 'number':
                return <input type="number" value={value} onChange={e => handleDetailChange(field.name, e.target.value)} required={field.required} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"/>;
            case 'dropdown':
                return (
                    <select value={value} onChange={e => handleDetailChange(field.name, e.target.value)} required={field.required} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                        <option value="">Select {field.name}</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                );
            case 'multi-select':
                return (
                    <select multiple value={value} onChange={e => handleDetailChange(field.name, Array.from(e.target.selectedOptions, option => option.value))} required={field.required} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 h-24">
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                );
            default:
                return null;
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const productData = {
            category_id: parseInt(categoryId),
            name,
            price: Number(price),
            description,
            specific_details: specificDetails,
            media_urls: ['https://picsum.photos/seed/newproduct/600/400'], // Placeholder
        };
        
        if (product) {
            await updateProduct({ ...product, ...productData });
        } else {
            await addProduct(productData);
        }
        setIsLoading(false);
        onSuccess();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Category</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium">Product Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"/>
            </div>
            <div>
                <label className="block text-sm font-medium">Price (IDR)</label>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"/>
            </div>
            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"/>
            </div>
            {/* TODO: Add Media Upload Input */}
            
            {selectedCategory?.fields.map(field => (
                <div key={field.name}>
                    <label className="block text-sm font-medium">{field.name} {field.required && '*'}</label>
                    {renderField(field)}
                </div>
            ))}
            
            <button type="submit" disabled={isLoading} className="w-full py-2 bg-soft-blue-600 text-white rounded-md hover:bg-soft-blue-700 disabled:bg-gray-400">
                {isLoading ? 'Saving...' : 'Save Product'}
            </button>
        </form>
    );
};

export default DynamicProductForm;
