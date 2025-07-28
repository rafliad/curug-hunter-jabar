"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInitialCurug, searchCurug } from "@/lib/redux/slices/curugSlice";
import { RootState, AppDispatch } from "@/lib/redux/store";
import type { Curug } from "@prisma/client";
import Link from "next/link";
import SafeImage from "./SafeImage";
import { Input } from "@heroui/react";

type CurugBrowserProps = {
  initialCurug: Curug[];
};

export default function CurugBrowser({ initialCurug }: CurugBrowserProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredCurug, searchTerm } = useSelector(
    (state: RootState) => state.curug
  );

  // Simpan data awal ke Redux store saat komponen pertama kali dimuat
  useEffect(() => {
    dispatch(setInitialCurug(initialCurug));
  }, [dispatch, initialCurug]);

  return (
    <div>
      <div className="mb-8 max-w-md mx-auto">
        <Input
          placeholder="Cari nama curug..."
          variant="flat"
          value={searchTerm}
          onChange={(e) => dispatch(searchCurug(e.target.value))}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCurug.map((curug) => (
          <Link href={`/curug/${curug.id}`} key={curug.id} className="group">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
              <div className="relative w-full h-48">
                <SafeImage
                  src={curug.imageUrl || ""}
                  alt={`Foto ${curug.name}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{curug.name}</h3>
                <p className="text-gray-500">{curug.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
