import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PropertiesService } from './properties/properties.service';
import { TestimonialsService } from './testimonials/testimonials.service';
import { UsersService } from './users/users.service';
import { UserRole } from './users/schemas/user.schema';
import { PropertyType } from './properties/schemas/property.schema';

const mockProperties = [
  {
    name: "JStorm Luxury Suite",
    type: PropertyType.AIRBNB,
    location: "Preston City Centre",
    price: 120,
    priceLabel: "per night",
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    rating: 4.9,
    reviews: 47,
    description: "Experience luxury living in the heart of Preston. This beautifully designed 2-bedroom suite features modern furnishings, a fully equipped kitchen, and stunning city views. Perfect for families and business travellers seeking a premium short-stay experience.",
    shortDescription: "Stunning 2-bed luxury suite with city views",
    amenities: ["Wi-Fi", "Smart TV", "Kitchen", "Washer", "Parking", "Air Con"],
    features: ["Wi-Fi", "Smart TV", "Kitchen", "Washer", "Parking", "Air Con"],
    sqft: 850,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000"],
    available: true,
  },
  {
    name: "Preston City Penthouse",
    type: PropertyType.AIRBNB,
    location: "Preston Marina",
    price: 180,
    priceLabel: "per night",
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    rating: 4.8,
    reviews: 32,
    description: "A breathtaking penthouse apartment overlooking Preston Marina. Three spacious bedrooms, two luxury bathrooms, and a wraparound terrace with panoramic views. The ultimate in luxury short-stay accommodation.",
    shortDescription: "Premium 3-bed penthouse with marina views",
    amenities: ["Wi-Fi", "Smart TV", "Kitchen", "Washer", "Parking", "Terrace", "Air Con", "Gym Access"],
    features: ["Wi-Fi", "Smart TV", "Kitchen", "Washer", "Parking", "Terrace", "Air Con", "Gym Access"],
    sqft: 1500,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000"],
    available: true,
  },
  {
    name: "Executive Studio Apartment",
    type: PropertyType.SERVICED,
    location: "Preston Business District",
    price: 85,
    priceLabel: "per night",
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    rating: 4.7,
    reviews: 65,
    description: "Ideal for business travellers, this executive studio features a king-size bed, dedicated workspace, and premium amenities. Located in the business district with excellent transport links.",
    shortDescription: "Executive studio ideal for business stays",
    amenities: ["Wi-Fi", "Smart TV", "Kitchen", "Workspace", "Parking", "Air Con"],
    features: ["Wi-Fi", "Smart TV", "Kitchen", "Workspace", "Parking", "Air Con"],
    sqft: 500,
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000"],
    available: true,
  },
  {
    name: "Riverside Family Apartment",
    type: PropertyType.SERVICED,
    location: "Preston Riverside",
    price: 140,
    priceLabel: "per night",
    bedrooms: 2,
    bathrooms: 2,
    guests: 5,
    rating: 4.9,
    reviews: 28,
    description: "A spacious family-friendly apartment by the river. Two bedrooms, two bathrooms, open-plan living, and a private balcony. Walking distance to parks, restaurants, and attractions.",
    shortDescription: "Family-friendly 2-bed with river views",
    amenities: ["Wi-Fi", "Smart TV", "Kitchen", "Washer", "Balcony", "Parking", "Cot Available"],
    features: ["Wi-Fi", "Smart TV", "Kitchen", "Washer", "Balcony", "Parking", "Cot Available"],
    sqft: 1000,
    images: ["https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1000"],
    available: true,
  },
  {
    name: "Modern Preston Townhouse",
    type: PropertyType.SALE,
    location: "Preston Suburbs",
    price: 275000,
    priceLabel: "",
    bedrooms: 3,
    bathrooms: 2,
    guests: 0,
    rating: 0,
    reviews: 0,
    description: "A stunning modern townhouse available for purchase. Three bedrooms, two bathrooms, landscaped garden, and double garage. Perfect as a family home or investment property.",
    shortDescription: "3-bed modern townhouse with garden",
    amenities: ["Garden", "Garage", "Central Heating", "Double Glazing", "Modern Kitchen", "En-Suite"],
    features: ["Garden", "Garage", "Central Heating", "Double Glazing", "Modern Kitchen", "En-Suite"],
    sqft: 1250,
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000"],
    available: true,
  },
  {
    name: "Victorian Detached Home",
    type: PropertyType.SALE,
    location: "Preston Park",
    price: 425000,
    priceLabel: "",
    bedrooms: 4,
    bathrooms: 3,
    guests: 0,
    rating: 0,
    reviews: 0,
    description: "A character-filled Victorian detached property with four bedrooms, three bathrooms, and a mature garden. Beautifully renovated with period features and modern amenities.",
    shortDescription: "4-bed Victorian detached with character",
    amenities: ["Garden", "Driveway", "Period Features", "Modern Kitchen", "Conservatory", "Cellar"],
    features: ["Garden", "Driveway", "Period Features", "Modern Kitchen", "Conservatory", "Cellar"],
    sqft: 2000,
    images: ["https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1000"],
    available: true,
  },
];

const mockTestimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Absolutely stunning apartment! Everything was spotless and the location was perfect. JStorm Homes made our Preston visit unforgettable.",
  },
  {
    name: "James K.",
    rating: 5,
    text: "The WhatsApp booking was so easy. Quick responses and the apartment exceeded our expectations. Will definitely book again!",
  },
  {
    name: "Amina R.",
    rating: 5,
    text: "Best serviced apartment we've stayed in. Felt like a luxury hotel but with all the comforts of home. Highly recommend!",
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const propertiesService = app.get(PropertiesService);
  const testimonialsService = app.get(TestimonialsService);
  const usersService = app.get(UsersService);

  console.log('Seeding properties...');
  for (const property of mockProperties) {
    await propertiesService.create(property as any);
  }
  console.log('Properties seeded!');

  console.log('Seeding testimonials...');
  for (const testimonial of mockTestimonials) {
    await testimonialsService.create(testimonial);
  }
  console.log('Testimonials seeded!');

  console.log('Seeding users...');
  const users = [
    { name: "Admin User", email: "admin@jstormhomes.com", password: "password123", role: UserRole.SUPER_ADMIN },
    { name: "Manager One", email: "manager1@jstormhomes.com", password: "password123", role: UserRole.PROPERTIES_MANAGER },
    { name: "Staff Two", email: "staff2@jstormhomes.com", password: "password123", role: UserRole.BOOKINGS_AGENT },
  ];

  for (const user of users) {
    try {
      await usersService.create(user as any);
    } catch (e) {
      console.log(`User ${user.email} already exists or error occurred`);
    }
  }
  console.log('Users seeded!');

  await app.close();
  process.exit(0);
}

bootstrap();
