import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface FilterProps {
  onFilterChange: (filters: {
    genre?: string;
    year?: number;
    language?: string;
    minRating?: number;
  }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [genre, setGenre] = useState<string>("");
  const [year, setYear] = useState<number | undefined>(undefined);
  const [language, setLanguage] = useState<string>("");
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  const handleApplyFilters = () => {
    onFilterChange({ genre, year, language, minRating });
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Filter Movies</h2>

      <Select onValueChange={setGenre} value={genre}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Action">Action</SelectItem>
          <SelectItem value="Drama">Drama</SelectItem>
          <SelectItem value="Comedy">Comedy</SelectItem>
          {/* Add more genres as needed */}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => setYear(parseInt(value))}
        value={year?.toString()}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
          <SelectItem value="2021">2021</SelectItem>
          {/* Add more years as needed */}
        </SelectContent>
      </Select>

      <Select onValueChange={setLanguage} value={language}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="English">English</SelectItem>
          <SelectItem value="Spanish">Spanish</SelectItem>
          <SelectItem value="French">French</SelectItem>
          {/* Add more languages as needed */}
        </SelectContent>
      </Select>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Minimum Rating
        </label>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={minRating || ""}
          onChange={(e) =>
            setMinRating(
              e.target.value ? parseFloat(e.target.value) : undefined
            )
          }
          placeholder="Enter minimum rating"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
        />
      </div>

      <Button
        onClick={handleApplyFilters}
        className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default Filter;
