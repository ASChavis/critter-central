import React, { createContext, useContext, useState, ReactNode } from "react";
import mockData from "../data/mockData";

interface DataContextType {
  data: typeof mockData;
  setData: React.Dispatch<React.SetStateAction<typeof mockData>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(mockData);

  console.log("✅ DataProvider Loaded:", data);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default DataProvider;
