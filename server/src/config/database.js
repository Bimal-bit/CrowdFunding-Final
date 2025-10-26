import mongoose from 'mongoose';
import User from '../models/User.model.js';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://random77335_db_user:xMaw05gmPEI1NmS1@cluster1.zjhfwrz.mongodb.net/CrowdFunding?retryWrites=true&w=majority&appName=Cluster1';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create default admin user
    await createDefaultAdmin();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@fundrise.com';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin'
      });
      console.log('✅ Default admin user created');
      console.log(`📧 Admin Email: ${adminEmail}`);
      console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};
