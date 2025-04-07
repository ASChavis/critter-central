import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase/supabase";

interface Household {
  id: string;
  name: string;
  address: string;
  owner_id: string;
  pets: string[];
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthdate?: string;
  household_id: string;
}

interface MedicalRecord {
  id: string;
  pet_id: string;
  description: string;
  date: string;
  file_url?: string;
  vet?: string;
}

interface DataContextType {
  households: Household[];
  pets: Pet[];
  medicalRecords: MedicalRecord[];
  refreshData: () => Promise<void>;
  addPet: (newPet: Omit<Pet, "id">) => Promise<void>;
  addMedicalRecord: (newRecord: Omit<MedicalRecord, "id">) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  const refreshData = async () => {
    try {
      const { data: householdsData, error: householdsError } = await supabase
        .from("households")
        .select("*");

      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*");

      const { data: medicalRecordsData, error: medicalRecordsError } =
        await supabase.from("medical_records").select("*");

      if (householdsError || petsError || medicalRecordsError) {
        console.error(
          "❌ Error fetching data:",
          householdsError || petsError || medicalRecordsError
        );
        return;
      }

      setHouseholds(householdsData);
      setPets(petsData);
      setMedicalRecords(medicalRecordsData);
    } catch (error) {
      console.error("❌ Unexpected error fetching data:", error);
    }
  };

  const addPet = async (newPet: Omit<Pet, "id">) => {
    try {
      const { error } = await supabase.from("pets").insert([newPet]);
      if (error) {
        console.error("❌ Error adding pet:", error);
      } else {
        refreshData();
      }
    } catch (error) {
      console.error("❌ Unexpected error adding pet:", error);
    }
  };

  const addMedicalRecord = async (newRecord: Omit<MedicalRecord, "id">) => {
    try {
      const { error } = await supabase
        .from("medical_records")
        .insert([newRecord]);
      if (error) {
        console.error("❌ Error adding medical record:", error);
      } else {
        refreshData();
      }
    } catch (error) {
      console.error("❌ Unexpected error adding medical record:", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        households,
        pets,
        medicalRecords,
        refreshData,
        addPet,
        addMedicalRecord,
      }}
    >
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
