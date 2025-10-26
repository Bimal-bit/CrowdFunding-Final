import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Loader2 } from 'lucide-react';
import { checkoutAPI } from '../../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  reward: any;
  onPaymentSuccess?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, project, reward, onPaymentSuccess }) => {
  const [amount, setAmount] = useState(reward?.amount && reward.amount > 0 ? reward.amount : 50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Reset modal state when it opens
  React.useEffect(() => {
    if (isOpen) {
      setError('');
      setAmount(reward?.amount && reward.amount > 0 ? reward.amount : 50);
      setLoading(false);
    }
  }, [isOpen, reward]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Creating checkout session for project:', project._id);

      // Create checkout session
      const response = await checkoutAPI.createSession({
        projectId: project._id,
        amount: amount,
        rewardId: reward?.id || null,
      });

      console.log('Checkout session created:', response);

      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to create checkout session');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Back This Project</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                    {reward._id && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-900">{reward.title}</h5>
                        <p className="text-sm text-blue-800 mt-1">{reward.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Amount Input - Show for no reward or allow custom amount */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pledge Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={reward?._id ? reward.amount : 50}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      disabled={reward?._id ? true : false}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter amount"
                    />
                    {reward?._id ? (
                      <p className="text-xs text-gray-500 mt-1">
                        Fixed amount for this reward
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum: ₹50
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-900">
                          <p className="font-medium mb-1">Secure Payment via Stripe</p>
                          <p className="text-blue-700">
                            You'll be redirected to Stripe's secure payment page. After successful payment, you'll be automatically returned to this project page.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Creating checkout...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5" />
                          <span>Continue to Secure Payment</span>
                        </>
                      )}
                    </button>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Secure & Encrypted</span>
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1 ml-6">
                        <li>• Powered by Stripe - Industry-leading security</li>
                        <li>• Your payment information is never stored on our servers</li>
                        <li>• Automatic redirect back after successful payment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              }
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;