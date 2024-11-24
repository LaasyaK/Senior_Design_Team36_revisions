// * Imports *
import React, { createContext, useContext, useState } from "react";

// Define the shape of your shared state
type SharedState = {
  weftSpacing: number;
  weftThickness: number;
  warpSpacing: number;
  warpThickness: number;
  showGrid: boolean;
  showNavigationCube: boolean;
  setWeftSpacing: (value: number) => void;
  setWeftThickness: (value: number) => void;
  setWarpSpacing: (value: number) => void;
  setWarpThickness: (value: number) => void;
  setShowGrid: (value: boolean) => void;
  setShowNavigationCube: (value: boolean) => void;
};

// Create a Context
const SharedStateContext = createContext<SharedState | undefined>(undefined);

// Provider Component
type SharedStateProviderProps = {
  children: React.ReactNode;
};
export const SharedStateProvider: React.FC<SharedStateProviderProps> = ({
  children,
}) => {
  const [weftSpacing, setWeftSpacing] = useState(0.2);
  const [weftThickness, setWeftThickness] = useState(0.1);
  const [warpSpacing, setWarpSpacing] = useState(0.2);
  const [warpThickness, setWarpThickness] = useState(0.1);
  const [showGrid, setShowGrid] = useState(true);
  const [showNavigationCube, setShowNavigationCube] = useState(true);

  return (
    <SharedStateContext.Provider
      value={{
        weftSpacing,
        weftThickness,
        warpSpacing,
        warpThickness,
        showGrid,
        showNavigationCube,
        setWeftSpacing,
        setWeftThickness,
        setWarpSpacing,
        setWarpThickness,
        setShowGrid,
        setShowNavigationCube,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};

// Hook to use the shared state
export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }
  return context;
};
