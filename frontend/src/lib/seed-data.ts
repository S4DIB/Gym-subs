// Sample data for initial database population
export const sampleTrainers = [
  {
    name: "Sarah Johnson",
    email: "sarah@fitlife.com",
    phone: "+1 (555) 123-4567",
    specialties: ["Yoga", "Pilates", "Meditation"],
    bio: "Certified yoga instructor with 8+ years of experience in mindfulness and flexibility training.",
    rating: 4.9,
    sessionsCompleted: 1240,
    status: "active" as const,
    joinDate: "2022-01-15",
    certifications: ["RYT-500", "Pilates Instructor"],
    hourlyRate: 75
  },
  {
    name: "Mike Davis",
    email: "mike@fitlife.com",
    phone: "+1 (555) 234-5678",
    specialties: ["Strength Training", "CrossFit", "HIIT"],
    bio: "Former competitive athlete specializing in strength and conditioning programs.",
    rating: 4.8,
    sessionsCompleted: 980,
    status: "active" as const,
    joinDate: "2021-08-20",
    certifications: ["NASM-CPT", "CrossFit Level 2"],
    hourlyRate: 80
  },
  {
    name: "Emma Wilson",
    email: "emma@fitlife.com",
    phone: "+1 (555) 345-6789",
    specialties: ["Swimming", "Aqua Fitness", "Rehabilitation"],
    bio: "Aquatic fitness specialist with background in physical therapy and injury recovery.",
    rating: 4.7,
    sessionsCompleted: 756,
    status: "on_leave" as const,
    joinDate: "2022-06-10",
    certifications: ["Water Safety Instructor", "Aquatic Therapy"],
    hourlyRate: 70
  }
];

export const sampleEquipment = [
  {
    name: "Treadmill Pro X1",
    category: "Cardio",
    status: "available" as const,
    location: "Main Floor - Cardio Zone",
    purchaseDate: "2023-01-15",
    lastMaintenance: "2024-06-01",
    nextMaintenance: "2024-12-01",
    condition: "excellent" as const,
    manufacturer: "LifeFitness",
    model: "Pro X1",
    serialNumber: "TF-2023-001"
  },
  {
    name: "Smith Machine",
    category: "Strength",
    status: "available" as const,
    location: "Weight Room - Strength Zone",
    purchaseDate: "2022-08-20",
    lastMaintenance: "2024-05-15",
    nextMaintenance: "2024-11-15",
    condition: "good" as const,
    manufacturer: "Hammer Strength",
    model: "Smith Pro",
    serialNumber: "SM-2022-001"
  },
  {
    name: "Yoga Mats (Set of 20)",
    category: "Accessories",
    status: "available" as const,
    location: "Yoga Studio",
    purchaseDate: "2023-03-10",
    condition: "good" as const,
    notes: "High-quality non-slip yoga mats"
  }
];

export const sampleMembers = [
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 111-2222",
    membershipType: "premium" as const,
    status: "active" as const,
    joinDate: "2023-01-15",
    address: "123 Main St",
    city: "Fitness City",
    zipCode: "12345"
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 222-3333",
    membershipType: "vip" as const,
    status: "active" as const,
    joinDate: "2022-08-20",
    address: "456 Oak Ave",
    city: "Fitness City",
    zipCode: "12345"
  },
  {
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.d@email.com",
    phone: "+1 (555) 333-4444",
    membershipType: "basic" as const,
    status: "active" as const,
    joinDate: "2023-06-10",
    address: "789 Pine Rd",
    city: "Fitness City",
    zipCode: "12345"
  }
];
