import React, { useState, useEffect, useRef } from 'react';
import { Product, PaymentMethod, Transaction } from '@/types';
import { getPaymentMethods, createTransaction, getTransactionStatus, cancelTransaction } from '@/services/api';
import Modal from '@/components/Modal';
import { formatCurrency } from '@/utils/helpers';

interface PurchaseModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

type PurchaseStep = 'details' | 'upload' | 'status';

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, isOpen, onClose }) => {
  const [step, setStep] = useState<PurchaseStep>('details');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestAddress, setGuestAddress] =useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setStep('details');
      setGuestName('');
      setGuestAddress('');
      setSelectedPayment(null);
      setProofFile(null);
      setProofPreview('');
      setTransaction(null);
      setError('');
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      setIsLoading(true);
      getPaymentMethods()
        .then(setPaymentMethods)
        .catch(() => setError("Failed to load payment methods."))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (transaction?.status === 'approved' || transaction?.status === 'canceled') {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  }, [transaction?.status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
      setError('');
    } else {
      setError('Please upload a JPG/PNG file smaller than 5MB.');
    }
  };
  
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestAddress || !selectedPayment) {
      setError('Please fill all fields and select a payment method.');
      return;
    }
    setError('');
    setStep('upload');
  }

  const handleUploadSubmit = async () => {
    if (!product || !selectedPayment || !proofFile) {
        setError('Something went wrong. Please try again.');
        return;
    }
    setIsLoading(true);
    try {
        const newTransaction = await createTransaction({
            product_id: product.id,
            payment_method_id: selectedPayment,
            guest_name: guestName,
            guest_address: guestAddress,
            proof_file: proofFile
        });
        setTransaction(newTransaction);
        setStep('status');
    } catch {
        setError('Failed to create transaction. Please try again.');
    } finally {
        setIsLoading(false);
    }
  }

  const checkStatus = async () => {
    if (!transaction) return;
    setIsLoading(true);
    try {
        const { status } = await getTransactionStatus(transaction.id);
        setTransaction(prev => prev ? {...prev, status} : null);
    } catch {
        // silent fail
    } finally {
        setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!transaction) return;
    setIsLoading(true);
    await cancelTransaction(transaction.id);
    alert('Transaction canceled successfully.');
    onClose();
  }

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 'details' ? 'Complete Your Purchase' : step === 'upload' ? 'Upload Proof' : 'Transaction Status'}>
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 bg-red-100 p-2 rounded-md my-2">{error}</div>}
      
      {step === 'details' && (
        <form onSubmit={handleDetailsSubmit}>
            <div className="mb-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-soft-blue-600 dark:text-soft-blue-400">{formatCurrency(product.price)}</p>
            </div>
            <div className="space-y-4">
                <input type="text" placeholder="Your Name" value={guestName} onChange={e => setGuestName(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" required />
                <textarea placeholder="Shipping Address" value={guestAddress} onChange={e => setGuestAddress(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" rows={3} required />
            </div>
            <h4 className="font-semibold mt-6 mb-2">Select Payment Method</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {paymentMethods.map(pm => (
                    <div key={pm.id} onClick={() => setSelectedPayment(pm.id)} className={`p-4 border rounded-md cursor-pointer transition-all ${selectedPayment === pm.id ? 'bg-soft-blue-100 dark:bg-soft-blue-900 border-soft-blue-500 ring-2 ring-soft-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{pm.name}</p>
                                <p className="text-sm">{pm.account_number}</p>
                                <p className="text-xs text-gray-500 mt-1">{pm.instructions}</p>
                            </div>
                            {pm.qris_image_url && <img src={pm.qris_image_url} alt="QRIS" className="w-16 h-16 object-contain" />}
                        </div>
                    </div>
                ))}
            </div>
            <button type="submit" disabled={isLoading} className="mt-6 w-full bg-soft-blue-600 text-white py-2 rounded-md hover:bg-soft-blue-700 disabled:bg-gray-400">
                Continue
            </button>
        </form>
      )}

      {step === 'upload' && (
         <div>
            <p className="mb-4">Please upload your proof of transfer for payment method: <strong>{paymentMethods.find(p=>p.id === selectedPayment)?.name}</strong>.</p>
            <input type="file" onChange={handleFileChange} accept="image/jpeg,image/png" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-soft-blue-50 file:text-soft-blue-700 hover:file:bg-soft-blue-100"/>
            {proofPreview && <img src={proofPreview} alt="Proof preview" className="mt-4 w-48 h-48 object-contain mx-auto border" />}
            <button onClick={handleUploadSubmit} disabled={isLoading || !proofFile} className="mt-6 w-full bg-soft-blue-600 text-white py-2 rounded-md hover:bg-soft-blue-700 disabled:bg-gray-400">
                Submit Proof
            </button>
         </div>
      )}

      {step === 'status' && transaction && (
        <div className="text-center">
            <p className="mb-2">Your Transaction ID: <strong className="text-lg text-soft-blue-600">{transaction.id}</strong></p>
            <p className="mb-4">Payment Method: <strong>{transaction.payment_method?.name}</strong></p>
            
            <div className={`p-4 rounded-md mb-4 ${
                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                transaction.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
            }`}>
                <p className="font-semibold capitalize text-lg">{transaction.status}</p>
                {transaction.status === 'pending' && <p>Transaction is still pending. We will verify your payment soon.</p>}
                {transaction.status === 'approved' && <p>Transaction approved! Your order is being processed.</p>}
                {transaction.status === 'canceled' && <p>Transaction was canceled.</p>}
            </div>

            <div className="flex space-x-4">
                {transaction.status === 'pending' && (
                    <>
                        <button onClick={checkStatus} disabled={isLoading} className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-400">
                            Check Process
                        </button>
                        <button onClick={handleCancel} disabled={isLoading} className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400">
                            Cancel
                        </button>
                    </>
                )}
                 {(transaction.status === 'approved' || transaction.status === 'canceled') && (
                     <button onClick={onClose} className="w-full bg-soft-blue-600 text-white py-2 rounded-md hover:bg-soft-blue-700">
                         Close
                     </button>
                 )}
            </div>
        </div>
      )}
    </Modal>
  );
};

export default PurchaseModal;
