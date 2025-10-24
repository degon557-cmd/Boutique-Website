
import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="text-3xl font-semibold mt-2">{value}</p>
  </div>
);

// Mock data for the chart
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const DashboardOverview: React.FC = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAdminStats().then(data => {
            setStats(data);
            setIsLoading(false);
        });
    }, []);

    if(isLoading) return <p>Loading dashboard...</p>;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Sales" value={stats.totalSales} />
                <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Sales Trends</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31, 41, 55, 0.8)', // gray-800 with opacity
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                }}
                                itemStyle={{ color: '#e5e7eb' }} // gray-200
                                labelStyle={{ color: '#f9fafb' }} // gray-50
                            />
                            <Legend />
                            <Bar dataKey="sales" fill="#1e83ff" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
