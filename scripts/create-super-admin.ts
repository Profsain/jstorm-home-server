import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const superAdminData = {
  name: 'Profsain Husain',
  email: 'profsainhm@gmail.com',
  password: 'winWIN247$$',
  role: 'Super Admin',
  status: 'active',
};

async function createSuperAdmin() {
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: superAdminData.email });
    if (existingUser) {
      console.log(`User with email ${superAdminData.email} already exists.`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(superAdminData.password, 10);

    // Prepare user document
    const newUser = {
      ...superAdminData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user
    const result = await usersCollection.insertOne(newUser);
    console.log('Super admin account created successfully:');
    console.log('ID:', result.insertedId);
    console.log('Name:', superAdminData.name);
    console.log('Email:', superAdminData.email);
    console.log('Role:', superAdminData.role);

  } catch (error) {
    console.error('Error creating super admin account:', error);
  } finally {
    await client.close();
  }
}

createSuperAdmin();
