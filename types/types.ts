export type MedicalRecord = {
  id: string;
  petId: string;
  description: string;
  date: string;
  fileUri?: string;
  vet?: string;
  updatedAt?: string;
  origin?: "manual" | "vet-upload";
};

export default MedicalRecord;
