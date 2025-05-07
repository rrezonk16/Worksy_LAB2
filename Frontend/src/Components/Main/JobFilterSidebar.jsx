import React from "react";

const JobFilterSidebar = ({
  searchTerm,
  setSearchTerm,
  selectedCity,
  setSelectedCity,
  cities,
  wageRange,
  setWageRange,
  minWageRange,
  setMinWageRange,
  employmentType,
  setEmploymentType,
  experienceLevel,
  setExperienceLevel,
  selectedTag,
  setSelectedTag,
  selectedBenefits,
  setSelectedBenefits,
  selectedHashtags,
  setSelectedHashtags,
  deadline,
  setDeadline,
}) => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Search by Title</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g. Developer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All</option>
          {cities.map((city, idx) => (
            <option key={idx} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Max Wage: €{wageRange}</label>
        <input
          type="range"
          min="0"
          max="5000"
          value={wageRange}
          onChange={(e) => setWageRange(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Min Wage: €{minWageRange}</label>
        <input
          type="range"
          min="0"
          max="5000"
          value={minWageRange}
          onChange={(e) => setMinWageRange(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Employment Type</label>
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Experience Level</label>
        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <input
          type="text"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g. JavaScript, React"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Benefits</label>
        <input
          type="text"
          value={selectedBenefits}
          onChange={(e) => setSelectedBenefits(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g. Health insurance, Remote work"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Hashtags</label>
        <input
          type="text"
          value={selectedHashtags}
          onChange={(e) => setSelectedHashtags(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g. #React, #WebDev"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
    </div>
  );
};

export default JobFilterSidebar;
