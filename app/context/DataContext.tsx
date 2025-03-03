import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockData } from "../data/mockData";

// Define the shape of the data context
interface DataContextType {
  data: typeof mockData;
}

// Create the Context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider Component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data] = useState(mockData); // Store the mock data

  return <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>;
};

// Custom Hook to use the Context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
