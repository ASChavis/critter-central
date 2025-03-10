export type MedicalRecord = {
  id: string;
  petId: string; // ✅ Ensure petId is always a string
  description: string;
  date: string;
  fileUri?: string; // ✅ Optional field for file uploads
  vet?: string; // ✅ Optional field for manually added records
};

// ✅ Add a default export to satisfy Expo Router
const medicalRecordTypes = {};
export default medicalRecordTypes;
