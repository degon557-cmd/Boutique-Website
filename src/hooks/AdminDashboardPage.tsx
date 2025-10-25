import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductManager from '@/components/admin/ProductManager';
import CategoryManager from '@/components/admin/CategoryManager';
import PaymentManager from '@/components/admin/PaymentManager';
import TransactionManager from '@/components/admin/TransactionManager';

type AdminTab = 'dashboard' | 'products' | 'categories' | 'payments' | 'transactions';

const AdminDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardOverview />;
            case 'products': return <ProductManager />;
            case 'categories': return <CategoryManager />;
            case 'payments': return <PaymentManager />;
            case 'transactions': return <TransactionManager />;
            default: return <DashboardOverview />;
        }
    };
    
    const TabButton: React.FC<{tab: AdminTab, label: string}> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab 
                ? 'bg-soft-blue-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">Logout</button>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <TabButton tab="dashboard" label="Dashboard" />
                    <TabButton tab="products" label="Products" />
                    <TabButton tab="categories" label="Categories" />
                    <TabButton tab="payments" label="Payments" />
                    <TabButton tab="transactions" label="Transactions" />
                </div>
                <div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;