export const mockData = {
    users: [
      {
        id: "user_1",
        name: "John Doe",
        email: "john.doe@email.com",
        households: ["household_1", "household_2"],
        token: "mock_token_123", // ✅ Add a mock token
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
  };
  