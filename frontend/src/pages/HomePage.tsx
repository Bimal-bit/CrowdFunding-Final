import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import FeaturedProjects from '../components/Home/FeaturedProjects';
import StatsSection from '../components/Home/StatsSection';
import HowItWorks from '../components/Home/HowItWorks';
import TestimonialsSection from '../components/Home/TestimonialsSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <FeaturedProjects />
      <HowItWorks />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;