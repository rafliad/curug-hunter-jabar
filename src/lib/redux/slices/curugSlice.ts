import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Curug } from "@prisma/client";

interface CurugState {
  allCurug: Curug[];
  filteredCurug: Curug[];
  searchTerm: string;
  activeFilters: string[];
}

const initialState: CurugState = {
  allCurug: [],
  filteredCurug: [],
  searchTerm: "",
  activeFilters: [],
};

const applyFiltersAndSearch = (state: CurugState) => {
  let result = state.allCurug;

  if (state.activeFilters.length > 0) {
    result = result.filter((curug) =>
      state.activeFilters.includes(curug.location)
    );
  }

  if (state.searchTerm) {
    result = result.filter((curug) =>
      curug.name.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }

  state.filteredCurug = result;
};

export const curugSlice = createSlice({
  name: "curug",
  initialState,
  reducers: {
    setInitialCurug: (state, action: PayloadAction<Curug[]>) => {
      state.allCurug = action.payload;
      applyFiltersAndSearch(state);
    },
    searchCurug: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      applyFiltersAndSearch(state);
    },
    toggleFilter: (state, action: PayloadAction<string>) => {
      const filter = action.payload;
      if (state.activeFilters.includes(filter)) {
        state.activeFilters = state.activeFilters.filter((f) => f !== filter);
      } else {
        state.activeFilters.push(filter);
      }
      applyFiltersAndSearch(state);
    },
  },
});

export const { setInitialCurug, searchCurug, toggleFilter } =
  curugSlice.actions;
export default curugSlice.reducer;
