import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import countries from "i18n-iso-countries";
import ISO6391 from "iso-639-1";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
interface FilterProps {
  onFilterChange: (filters: {
    genre?: string;
    year?: number;
    language?: string;
    minRating?: number;
  }) => void;
}

countries.registerLocale(require("i18n-iso-countries/langs/en.json")); // Load English locale
const languageOptions = Object.entries(countries.getSupportedLanguages()).map(
  ([code, name]) => ({
    value: code,
    label: name,
  })
);

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [genre, setGenre] = useState<string>("");
  const [year, setYear] = useState<number | undefined>(undefined);
  const [language, setLanguage] = useState<string>("");
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  console.log({ languageOptions });
  console.log(countries.getNames("en", { select: "official" }));

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
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => setYear(value ? parseInt(value) : undefined)}
        value={year?.toString()}
      >
        <SelectTrigger className="w-full">
          {/* {!year ? (
            <SelectValue placeholder="Select Year" />
          ) : (
            <SelectValue>{year}</SelectValue>
          )} */}
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          <Command>
            <CommandInput placeholder="Search Year..." />
            <CommandList>
              {Array.from({ length: 66 }, (_, i) => 2025 - i).map((year) => (
                <CommandItem key={year} onSelect={() => setYear(year)}>
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </SelectContent>
      </Select>

      <Select onValueChange={setLanguage} value={language}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {languageOptions?.map((lang, index) => {
            return (
              <SelectItem key={index} value={lang.label}>
                {ISO6391.getName(lang.label)} - {lang.label.toUpperCase()}
              </SelectItem>
            );
          })}
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
