import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Users2, DollarSign, Gift } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Lightbulb,
      title: 'Share Your Idea',
      description: 'Create your project page with compelling visuals, detailed descriptions, and funding goals.',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Users2,
      title: 'Build Community',
      description: 'Promote your campaign and engage with potential backers through social media and updates.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: DollarSign,
      title: 'Secure Funding',
      description: 'Collect pledges from supporters who believe in your vision and want to make it reality.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Gift,
      title: 'Deliver Rewards',
      description: 'Fulfill your promises by delivering products and experiences to your loyal backers.',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to turn your creative ideas into funded reality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-6">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-200">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">Join thousands of successful creators who made their dreams come true</p>
            <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200">
              Launch Your Project Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;