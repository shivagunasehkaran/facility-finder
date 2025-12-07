import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";
import { Facility } from "../types/facility.types";
import { filterFacilities } from "../utils/facilityHelpers";
import { loadFacilities } from "../data/facilitiesService";

interface FacilitiesState {
  allFacilities: Facility[];
  filteredFacilities: Facility[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

type FacilitiesAction =
  | { type: "SET_FACILITIES"; payload: Facility[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

interface FacilitiesContextType {
  state: FacilitiesState;
  dispatch: Dispatch<FacilitiesAction>;
}

const initialState: FacilitiesState = {
  allFacilities: [],
  filteredFacilities: [],
  searchQuery: "",
  isLoading: true,
  error: null,
};

function facilitiesReducer(
  state: FacilitiesState,
  action: FacilitiesAction
): FacilitiesState {
  switch (action.type) {
    case "SET_FACILITIES":
      return {
        ...state,
        allFacilities: action.payload,
        filteredFacilities: filterFacilities(action.payload, state.searchQuery),
        isLoading: false,
        error: null,
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        filteredFacilities: filterFacilities(
          state.allFacilities,
          action.payload
        ),
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

const FacilitiesContext = createContext<FacilitiesContextType | undefined>(
  undefined
);

interface FacilitiesProviderProps {
  children: ReactNode;
}

export function FacilitiesProvider({ children }: FacilitiesProviderProps) {
  const [state, dispatch] = useReducer(facilitiesReducer, initialState);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const facilities = await loadFacilities();
        console.log("facilities -->>>", JSON.stringify(facilities));
        dispatch({ type: "SET_FACILITIES", payload: facilities });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load facilities";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      }
    }

    fetchFacilities();
  }, []);

  return (
    <FacilitiesContext.Provider value={{ state, dispatch }}>
      {children}
    </FacilitiesContext.Provider>
  );
}

export function useFacilities() {
  const context = useContext(FacilitiesContext);
  if (context === undefined) {
    throw new Error("useFacilities must be used within a FacilitiesProvider");
  }
  return context;
}
