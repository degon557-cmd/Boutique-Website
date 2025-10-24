import React, { useState, useEffect, useCallback } from 'react';
import { PaymentMethod } from '@/types';
import { getPaymentMethods, deletePaymentMethod } from '@/services/api';

const PaymentManager: React.FC = () => {
    const [payments, setPayments] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        const data = await getPaymentMethods();
        setPayments(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleDelete = async (paymentId: number) => {
        if (window.confirm('Are you sure you want to delete this payment method?')) {
            await deletePaymentMethod(paymentId);
            fetchPayments();
        }
    };
    
    if (isLoading) return <p>Loading payment methods...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Payment Methods</h2>
                {/* <button className="px-4 py-2 bg-soft-blue-600 text-white rounded-md hover:bg-soft-blue-700">Add Method</button> */}
                <p className="text-sm text-gray-500">Note: Add/Edit functionality to be implemented.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Account Number</th>
                            <th className="px-6 py-3">QRIS</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium">{p.name}</td>
                                <td className="px-6 py-4">{p.account_number}</td>
                                <td className="px-6 py-4">
                                    {p.qris_image_url && <img src={p.qris_image_url} alt="QRIS" className="w-12 h-12 object-contain" />}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button className="font-medium text-soft-blue-600 dark:text-soft-blue-500 hover:underline disabled:text-gray-400" disabled>Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentManager;
