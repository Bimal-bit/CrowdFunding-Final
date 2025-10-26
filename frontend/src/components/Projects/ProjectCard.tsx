import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Calendar, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  creator: any;
  featured: boolean;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Recalculate progress percentage whenever project prop changes
  const progressPercentage = Math.min((project.raised / project.goal) * 100, 100);

  // 👇 State to track liked/unliked
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {project.featured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center space-x-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Star className="h-3 w-3" />
            <span>Featured</span>
          </div>
        </div>
      )}

      <div className="relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setLiked(!liked)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors group"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                liked ? 'text-red-500 fill-red-500' : 'text-gray-600 group-hover:text-red-500'
              }`}
            />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2">
          <p className="text-sm text-gray-500">
            {project.creator?.role === 'admin' ? 'by Admin' : `by ${project.creator?.name || 'Anonymous'}`}
          </p>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>₹{project.raised.toLocaleString('en-IN')} raised</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              key={`progress-${project._id}-${project.raised}`}
              className="progress-bar h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            of ₹{project.goal.toLocaleString('en-IN')} goal
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{project.backers} backers</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{project.daysLeft} days left</span>
          </div>
        </div>

        <Link
          to={`/project/${project._id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          <span>View Project</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
