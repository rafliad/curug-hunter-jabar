"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInitialCurug, searchCurug } from "@/lib/redux/slices/curugSlice";
import { RootState, AppDispatch } from "@/lib/redux/store";
import type { Curug } from "@prisma/client";
import Link from "next/link";
import SafeImage from "./SafeImage";
import { Input } from "@heroui/react";
import FilterPanel from "./FilterPanel";

type CurugBrowserProps = {
  initialCurug: Curug[];
};

export default function CurugBrowser({ initialCurug }: CurugBrowserProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredCurug, searchTerm } = useSelector(
    (state: RootState) => state.curug
  );

  useEffect(() => {
    dispatch(setInitialCurug(initialCurug));
  }, [dispatch, initialCurug]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <FilterPanel />
      </aside>

      <main className="flex-1">
        <div className="mb-8">
          <Input
            placeholder="Cari nama curug..."
            value={searchTerm}
            onChange={(e) => dispatch(searchCurug(e.target.value))}
          />
        </div>
        {filteredCurug.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCurug.map((curug) => (
              <Link
                href={`/curug/${curug.id}`}
                key={curug.id}
                className="group block bg-blue-50 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative w-full h-48">
                  <SafeImage
                    src={curug.imageUrl || ""}
                    alt={`Foto ${curug.name}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1 truncate">
                    {curug.name}
                  </h3>
                  <p className="text-gray-500">{curug.location}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700">
              Tidak Ditemukan
            </h3>
            <p className="text-gray-500 mt-2">
              Tidak ada curug yang cocok dengan pencarian atau filter Anda.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
