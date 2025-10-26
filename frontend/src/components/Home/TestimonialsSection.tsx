import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Tech Entrepreneur',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: 'FundRise helped me raise $120K for my AI startup. The platform is intuitive and the community support is incredible.',
      rating: 5,
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Documentary Filmmaker',
      image: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: 'I funded my entire documentary through this platform. The transparent fee structure and excellent customer service made all the difference.',
      rating: 5,
    },
    {
      name: 'Emily Johnson',
      role: 'Product Designer',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: 'The tools provided helped me present my eco-friendly product beautifully. Exceeded my funding goal by 200%!',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success <span className="gradient-text">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from creators who turned their dreams into reality with our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg card-hover relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Quote className="h-8 w-8 text-blue-200 mb-4" />
              
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;