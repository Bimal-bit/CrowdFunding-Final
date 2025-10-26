import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VideoPlayer from './VideoPlayer';

const HeroSection = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleStartProject = () => {
    if (!user) {
      // Not logged in - redirect to login
      navigate('/login', { state: { from: '/' } });
      return;
    }
    
    if (isAdmin()) {
      // Admin - go to create project page
      navigate('/admin/create-project');
    } else {
      // Regular user - show message
      alert('Only admins can create projects. Please contact support if you want to start a project.');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="absolute top-20 left-20 animate-float">
          <TrendingUp className="h-12 w-12 text-blue-300 opacity-60" />
        </div>
        <div className="absolute top-40 right-32 animate-float" style={{ animationDelay: '2s' }}>
          <Users className="h-16 w-16 text-green-300 opacity-60" />
        </div>
        <div className="absolute bottom-32 left-32 animate-float" style={{ animationDelay: '4s' }}>
          <Zap className="h-10 w-10 text-orange-300 opacity-60" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Fund Your</span>
            <br />
            <span className="text-gray-900">Dreams Today</span>
          </h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of creators bringing innovative projects to life through community-powered crowdfunding
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={handleStartProject}
              className="group bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
            >
              <span>Start Your Project</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* 👇 Replace button with VideoPlayer */}
            <VideoPlayer />
          </motion.div>

          {/* Features grid remains unchanged */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg card-hover">
              <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy to Start</h3>
              <p className="text-gray-600">Launch your campaign in minutes with our intuitive project builder</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg card-hover">
              <div className="bg-green-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-gray-600">Connect with supporters worldwide who believe in your vision</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg card-hover">
              <div className="bg-orange-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Impact</h3>
              <p className="text-gray-600">Secure payments and immediate access to funds when goals are met</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
