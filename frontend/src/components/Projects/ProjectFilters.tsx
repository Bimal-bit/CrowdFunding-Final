import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';

const ProjectFilters = () => {
  const [fundingRange, setFundingRange] = useState([0, 500000]);
  const [projectStatus, setProjectStatus] = useState('all');
  const [location, setLocation] = useState('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Funding Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <DollarSign className="inline h-4 w-4 mr-1" />
          Funding Goal Range
        </label>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={fundingRange[0]}
              onChange={(e) => setFundingRange([Number(e.target.value), fundingRange[1]])}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <span className="flex items-center text-gray-500">to</span>
            <input
              type="number"
              placeholder="Max"
              value={fundingRange[1]}
              onChange={(e) => setFundingRange([fundingRange[0], Number(e.target.value)])}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Project Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <TrendingUp className="inline h-4 w-4 mr-1" />
          Project Status
        </label>
        <select
          value={projectStatus}
          onChange={(e) => setProjectStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Projects</option>
          <option value="active">Active</option>
          <option value="successful">Successfully Funded</option>
          <option value="ending">Ending Soon</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Clock className="inline h-4 w-4 mr-1" />
          Creator Location
        </label>
        <input
          type="text"
          placeholder="Enter city or country"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
        />
      </div>
    </div>
  );
};

export default ProjectFilters;