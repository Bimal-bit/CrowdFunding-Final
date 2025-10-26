import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ProjectCard from '../components/Projects/ProjectCard';
import ProjectFilters from '../components/Projects/ProjectFilters';
import { projectsAPI } from '../services/api';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'All' && { category: selectedCategory }),
        ...(sortBy && { sortBy })
      };
      const response = await projectsAPI.getAll(params);
      setProjects(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sortedProjects = projects;

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-xl text-gray-600">
            Support innovative ideas from creators around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Environment">Environment</option>
              <option value="Arts & Culture">Arts & Culture</option>
              <option value="Community">Community</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Fashion & Design">Fashion & Design</option>
              <option value="Film & Video">Film & Video</option>
              <option value="Music">Music</option>
              <option value="Gaming">Gaming</option>
              <option value="Publishing">Publishing</option>
              <option value="Photography">Photography</option>
              <option value="Crafts">Crafts</option>
              <option value="Theater">Theater</option>
              <option value="Dance">Dance</option>
              <option value="Comics">Comics</option>
              <option value="Journalism">Journalism</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Animals & Pets">Animals & Pets</option>
              <option value="Travel & Adventure">Travel & Adventure</option>
              <option value="Social Impact">Social Impact</option>
              <option value="Business & Entrepreneurship">Business & Entrepreneurship</option>
              <option value="Science & Research">Science & Research</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="trending">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="ending">Ending Soon</option>
              <option value="funded">Most Funded</option>
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ProjectFilters />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedProjects.length} projects
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchProjects}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            {sortedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {sortedProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No projects found</p>
              </div>
            )}
          </>
        )}

        {/* Load More */}
        {sortedProjects.length > 0 && (
          <div className="text-center mb-12">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg border-2 border-blue-600 font-medium hover:bg-blue-50 transition-colors">
              Load More Projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;