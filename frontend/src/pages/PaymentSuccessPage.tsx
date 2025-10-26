import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [countdown, setCountdown] = useState(5);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchSessionAndRedirect = async () => {
      const sessionId = searchParams.get('session_id');

      console.log('Payment success page loaded. Session ID:', sessionId);

      if (!sessionId) {
        console.error('No session ID found');
        setErrorMessage('No session ID found in URL');
        setStatus('error');
        return;
      }

      try {
        // Confirm payment and update project data
        console.log('Confirming payment with session ID:', sessionId);
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const endpoint = `${apiUrl}/payment-confirm/confirm-payment`;
        
        console.log('Calling endpoint:', endpoint);
        console.log('Request body:', { sessionId });
        
        const confirmResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        console.log('Response status:', confirmResponse.status);
        console.log('Response ok:', confirmResponse.ok);

        const confirmData = await confirmResponse.json();
        console.log('Payment confirmation response:', confirmData);

        if (!confirmResponse.ok) {
          const errorMsg = confirmData.message || 'Failed to confirm payment';
          console.error('API Error:', errorMsg);
          throw new Error(errorMsg);
        }

        const fetchedProjectId = confirmData.data?.projectId;

        if (fetchedProjectId) {
          // Payment was successful and data updated
          setProjectId(fetchedProjectId);
          setStatus('success');
          
          console.log('✅ Payment confirmed and project updated!');
          console.log('New raised amount:', confirmData.data?.newRaisedAmount);
          console.log('New backers count:', confirmData.data?.newBackersCount);

          // Start countdown
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                // Redirect to project page with refresh
                navigate(`/project/${fetchedProjectId}`, { replace: true, state: { refresh: true } });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          setStatus('error');
        }
      } catch (error: any) {
        console.error('❌ Error confirming payment:', error);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        
        const errorMsg = error.message || 'Unknown error occurred';
        setErrorMessage(errorMsg);
        setStatus('error');
      }
    };

    fetchSessionAndRedirect();
  }, [searchParams, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-gray-600 mb-4">
            We couldn't process your payment information.
          </p>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800 font-mono">
                Error: {errorMessage}
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-6">
            Your payment may have been successful. Please check your email or contact support.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your generous contribution!
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            Your payment has been processed successfully. The project will be updated shortly.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Redirecting to project page in</p>
          <div className="text-4xl font-bold text-blue-600">{countdown}</div>
          <p className="text-sm text-gray-500 mt-2">seconds</p>
        </div>

        <button
          onClick={() => projectId && navigate(`/project/${projectId}`, { replace: true })}
          disabled={!projectId}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Go to Project Now
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-3 text-gray-600 hover:text-gray-900 transition-colors"
        >
          Return to Home
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
