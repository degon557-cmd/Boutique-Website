import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionStatus } from '@/types';
import { getAdminTransactions, updateTransactionStatus } from '@/services/api';

const TransactionManager: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        const data = await getAdminTransactions();
        setTransactions(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleStatusChange = async (id: string, status: TransactionStatus) => {
        await updateTransactionStatus(id, status);
        fetchTransactions();
        alert(`Transaction ${status} successfully.`);
    };
    
    const StatusBadge: React.FC<{status: TransactionStatus}> = ({status}) => {
        const baseClass = "px-2 py-1 text-xs font-medium rounded-full";
        const statusClasses = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            canceled: "bg-red-100 text-red-800"
        }
        return <span className={`${baseClass} ${statusClasses[status]}`}>{status}</span>
    }

    if (isLoading) return <p>Loading transactions...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Manage Transactions</h2>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Guest</th>
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3">Proof</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-mono text-xs">{t.id}</td>
                                <td className="px-6 py-4">
                                    <div>{t.guest_name}</div>
                                    <div className="text-xs text-gray-500">{t.guest_address}</div>
                                </td>
                                <td className="px-6 py-4">{t.product?.name}</td>
                                <td className="px-6 py-4">
                                    <a href={t.proof_url} target="_blank" rel="noopener noreferrer">
                                        <img src={t.proof_url} alt="Proof" className="w-16 h-16 object-contain"/>
                                    </a>
                                </td>
                                <td className="px-6 py-4 capitalize"><StatusBadge status={t.status}/></td>
                                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    {t.status === 'pending' && (
                                        <div className="space-x-2">
                                            <button onClick={() => handleStatusChange(t.id, 'approved')} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                                            <button onClick={() => handleStatusChange(t.id, 'canceled')} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionManager;
