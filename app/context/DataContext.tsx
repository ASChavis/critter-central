import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockData } from "../data/mockData";

const DataContext = createContext<{ data: typeof mockData } | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data] = useState(mockData); // ✅ Ensure this loads pets correctly

  console.log("✅ DataProvider Loaded:", data); // Debugging

  return <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

