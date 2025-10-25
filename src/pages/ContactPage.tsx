import React, { useState } from 'react';
import { submitContactForm } from '@/services/api';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await submitContactForm({ name, email, message });
            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-10">Get In Touch</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-soft-blue-500 focus:border-soft-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-soft-blue-500 focus:border-soft-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                            <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={5} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-soft-blue-500 focus:border-soft-blue-500"></textarea>
                        </div>
                        <button type="submit" disabled={status === 'loading'} className="w-full py-3 px-4 bg-soft-blue-600 text-white font-semibold rounded-md hover:bg-soft-blue-700 disabled:bg-gray-400">
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>
                        {status === 'success' && <p className="text-green-600">Message sent successfully!</p>}
                        {status === 'error' && <p className="text-red-600">Failed to send message. Please try again.</p>}
                    </form>
                </div>
                <div className="space-y-6">
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Contact Information</h3>
                        <p className="text-gray-600 dark:text-gray-300">Feel free to reach out to us through any of the following methods.</p>
                    </div>
                     <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4">
                        <p><strong>Email:</strong> <a href="mailto:info@boutique.com" className="text-soft-blue-600 hover:underline">info@boutique.com</a></p>
                        <p><strong>Phone:</strong> <a href="tel:+6281234567890" className="text-soft-blue-600 hover:underline">+62 812-3456-7890</a></p>
                        <p><strong>WhatsApp:</strong> <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-soft-blue-600 hover:underline">Chat with us</a></p>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;