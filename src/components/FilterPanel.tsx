"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { toggleFilter } from "@/lib/redux/slices/curugSlice";
import { Checkbox } from "@heroui/react";

export default function FilterPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { allCurug, activeFilters } = useSelector(
    (state: RootState) => state.curug
  );

  // Ambil daftar lokasi unik dari data curug
  const locations = [
    ...new Set(allCurug.map((curug) => curug.location)),
  ].sort();

  return (
    <div className="p-4 bg-blue-50 rounded-lg shadow-lg sticky top-8">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">
        Filter Berdasarkan Lokasi
      </h3>
      <div className="space-y-2">
        {locations.map((location) => (
          <Checkbox
            key={location}
            isSelected={activeFilters.includes(location)}
            onValueChange={() => dispatch(toggleFilter(location))}
          >
            {location}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}
