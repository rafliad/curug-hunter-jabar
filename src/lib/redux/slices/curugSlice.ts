import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Curug } from "@prisma/client";

// Definisikan tipe untuk state kita
interface CurugState {
  allCurug: Curug[];
  filteredCurug: Curug[];
  searchTerm: string;
}

const initialState: CurugState = {
  allCurug: [],
  filteredCurug: [],
  searchTerm: "",
};

export const curugSlice = createSlice({
  name: "curug",
  initialState,
  reducers: {
    // Action untuk mengisi state dengan data awal dari server
    setInitialCurug: (state, action: PayloadAction<Curug[]>) => {
      state.allCurug = action.payload;
      state.filteredCurug = action.payload;
    },
    // Action untuk mencari curug berdasarkan nama
    searchCurug: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      state.searchTerm = action.payload;
      if (searchTerm === "") {
        state.filteredCurug = state.allCurug;
      } else {
        state.filteredCurug = state.allCurug.filter((curug) =>
          curug.name.toLowerCase().includes(searchTerm)
        );
      }
    },
  },
});

export const { setInitialCurug, searchCurug } = curugSlice.actions;
export default curugSlice.reducer;
