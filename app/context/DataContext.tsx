import React, { createContext, useContext, useState, ReactNode } from "react";
import mockData from "../data/mockData";

// Define the DataContext type
interface DataContextType {
  data: typeof mockData;
  setData: React.Dispatch<React.SetStateAction<typeof mockData>>; // ✅ Allow state updates
}

// Create context with default values
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(mockData); // ✅ Store mock data in state

  console.log("✅ DataProvider Loaded:", data); // Debugging

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// ✅ Named export for `useData`
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// ✅ Default export for Expo Router compatibility
export default DataProvider;
