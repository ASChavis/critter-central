import React, { createContext, useContext, useState, ReactNode } from "react";
import mockData from "../data/mockData";

interface DataContextType {
  data: typeof mockData;
  setData: React.Dispatch<React.SetStateAction<typeof mockData>>;
  addPet: (newPet: Pet) => void;
  addMedicalRecord: (newRecord: MedicalRecord) => void;
}

// Type Definitions for Pet & MedicalRecord
interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  medicalRecords: string[];
}

interface MedicalRecord {
  id: string;
  petId: string;
  description: string;
  date: string;
  fileUri?: string;
  vet?: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(mockData);

  console.log("✅ DataProvider Loaded:", data);

  // ✅ Function to Add a New Pet
  const addPet = (newPet: Pet) => {
    setData((prevData) => ({
      ...prevData,
      pets: [...prevData.pets, newPet], // Add new pet to pets array
    }));
  };

  const addMedicalRecord = (newRecord: MedicalRecord) => {
    setData((prevData) => ({
      ...prevData,
      medicalRecords: [
        ...prevData.medicalRecords,
        {
          ...newRecord,
          fileUri: newRecord.fileUri ?? "", // ✅ Ensure it's always a string
          vet: newRecord.vet ?? "", // ✅ Ensure it's always a string
        },
      ],
      pets: prevData.pets.map((pet) =>
        pet.id === newRecord.petId
          ? { ...pet, medicalRecords: [...pet.medicalRecords, newRecord.id] }
          : pet
      ),
    }));
  };

  return (
    <DataContext.Provider value={{ data, setData, addPet, addMedicalRecord }}>
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
