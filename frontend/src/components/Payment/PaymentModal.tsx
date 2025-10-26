import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, Award, Download, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentAPI } from '../../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  reward: any;
  onPaymentSuccess?: () => void;
}

const PaymentForm: React.FC<{ amount: number; projectId: string; rewardId?: string; onSuccess: (data: any) => void; onError: (error: string) => void }> = ({ amount, projectId, rewardId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await paymentAPI.createIntent({
        amount,
        projectId,
        rewardId
      });

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const response = await paymentAPI.confirmPayment({
          paymentIntentId: paymentIntent.id,
          projectId,
          rewardId,
          amount
        });

        onSuccess(response);
      }
    } catch (error: any) {
      onError(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {processing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Pay ₹{amount}</span>
          </>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
        <Shield className="h-4 w-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, project, reward, onPaymentSuccess }) => {
  const [amount, setAmount] = useState(reward?.amount || 25);
  const [step, setStep] = useState(1); // 1: Payment, 2: Success
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);

  // Reset modal state when it opens
  React.useEffect(() => {
    if (isOpen) {
      console.log('🚀 Modal opened - resetting to step 1');
      setStep(1);
      setError('');
      setPaymentData(null);
      setAmount(reward?.amount || 25);
    } else {
      console.log('❌ Modal closed');
    }
  }, [isOpen, reward]);

  // Track step changes
  React.useEffect(() => {
    console.log('📍 Current step:', step, step === 1 ? '(Payment Form)' : '(Success Screen)');
  }, [step]);

  const handleSuccess = (data: any) => {
    console.log('🎉 Payment success data:', data);
    console.log('📥 Receipt download URL:', data?.receiptDownloadUrl);
    console.log('📊 Data structure:', JSON.stringify(data, null, 2));
    console.log('🔄 Setting step to 2 (success screen)');
    setPaymentData(data);
    setStep(2);
    setError('');
    console.log('✅ Success screen should now be visible');
    // Don't call onPaymentSuccess here - it will be called when modal closes
    // This prevents the page from refreshing and closing the modal before user sees success screen
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleClose = () => {
    // If payment was successful (step 2), refresh project data before closing
    if (step === 2 && onPaymentSuccess) {
      console.log('Payment successful - refreshing project data before closing modal');
      onPaymentSuccess();
    }
    onClose();
  };

  const handleDownloadReceipt = () => {
    console.log('Download receipt clicked. Payment data:', paymentData);
    console.log('Looking for receiptDownloadUrl in:', paymentData);
    
    // The backend returns receiptDownloadUrl in the response
    const downloadUrl = paymentData?.receiptDownloadUrl;
    
    if (!downloadUrl) {
      console.error('No receipt download URL found in payment data');
      console.error('Available keys:', Object.keys(paymentData || {}));
      alert('Receipt is still being generated. Please try again in a moment or contact support.');
      return;
    }
    
    console.log('Opening receipt URL:', downloadUrl);
    
    // Open in new tab to trigger download
    const newWindow = window.open(downloadUrl, '_blank');
    if (!newWindow) {
      alert('Please allow pop-ups to download your receipt.');
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
              onClick={handleClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {step === 1 ? (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Back This Project</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                    {reward.id > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-900">{reward.title}</h5>
                        <p className="text-sm text-blue-800 mt-1">{reward.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pledge Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={reward.amount || 1}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span>Pledge Amount:</span>
                        <span className="font-semibold">₹{amount}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Processing Fee:</span>
                        <span className="font-semibold">₹{Math.round(amount * 0.029 + 0.30)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span>₹{amount + Math.round(amount * 0.029 + 0.30)}</span>
                      </div>
                    </div>
                  </div>

                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      amount={amount}
                      projectId={project._id}
                      rewardId={reward?.id}
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  </Elements>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <Award className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600">Thank you for your contribution</p>
                  </div>

                  {/* Download Button - Always show after successful payment */}
                  <div className="mb-6">
                    <button
                      onClick={handleDownloadReceipt}
                      disabled={!paymentData?.receiptDownloadUrl}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-5 w-5" />
                      <span>Download Receipt</span>
                    </button>
                    {!paymentData?.receiptDownloadUrl && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Generating receipt...
                      </p>
                    )}
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-green-900 mb-2">What's included:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Payment receipt (PDF)</li>
                      <li>✅ Project updates</li>
                      {reward?.id > 0 && <li>✅ Reward: {reward.delivery}</li>}
                    </ul>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;