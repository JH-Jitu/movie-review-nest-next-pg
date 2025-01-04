import React from "react";

interface FilterProps {
  onFilterChange: (filters: { genre?: string; year?: number }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ genre: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ year: parseInt(e.target.value) });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label
          htmlFor="genre"
          className="block text-sm font-medium text-gray-700"
        >
          Genre
        </label>
        <select
          id="genre"
          onChange={handleGenreChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Genre</option>
          <option value="Action">Action</option>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
          {/* Add more genres as needed */}
        </select>
      </div>
      <div>
        <label
          htmlFor="year"
          className="block text-sm font-medium text-gray-700"
        >
          Year
        </label>
        <select
          id="year"
          onChange={handleYearChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          {/* Add more years as needed */}
        </select>
      </div>
    </div>
  );
};

export default Filter;
