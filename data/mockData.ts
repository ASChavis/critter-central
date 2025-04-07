export const mockData = {
  users: [
    {
      id: "user_1",
      name: "John Doe",
      email: "test@example.com",
      password: "test",
      households: ["household_1", "household_2"],
      token: "mock_token_123",
    },
  ],
  households: [
    {
      id: "household_1",
      name: "Doe Family Home",
      address: "123 Main St, City, State",
      pets: ["pet_1", "pet_2"],
    },
    {
      id: "household_2",
      name: "Vacation Home",
      address: "456 Beachside Dr, City, State",
      pets: ["pet_3"],
    },
  ],
  pets: [
    {
      id: "pet_1",
      name: "Buddy",
      species: "Dog",
      breed: "Golden Retriever",
      age: 5,
      medicalRecords: ["record_1"],
    },
    {
      id: "pet_2",
      name: "Whiskers",
      species: "Cat",
      breed: "Siamese",
      age: 3,
      medicalRecords: ["record_2", "record_3"],
    },
    {
      id: "pet_3",
      name: "Coco",
      species: "Parrot",
      breed: "African Grey",
      age: 7,
      medicalRecords: [],
    },
  ],
  medicalRecords: [
    {
      id: "record_1",
      petId: "pet_1",
      description: "Annual vaccination",
      date: "2024-01-15",
      fileUri: "",
      vet: "Dr. Smith, City Vet Clinic",
    },
    {
      id: "record_2",
      petId: "pet_2",
      description: "Vaccination Certificate",
      date: "2023-11-10",
      fileUri: "https://example.com/vaccine.pdf",
      vet: "",
    },
    {
      id: "record_3",
      petId: "pet_2",
      description: "Routine checkup",
      date: "2024-02-10",
      fileUri: "",
      vet: "Dr. Jones, Happy Paws Vet",
    },
  ],
};

export default mockData;
