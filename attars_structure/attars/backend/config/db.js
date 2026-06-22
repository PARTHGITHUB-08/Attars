import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Disable buffering if connection fails to avoid hanging requests
    mongoose.set('bufferCommands', false);
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attars', {
      serverSelectionTimeoutMS: 2000 // fail fast if not running
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.warn('\n==================================================');
    console.warn('WARNING: MongoDB connection error:', err.message);
    console.warn('The server will start using IN-MEMORY MOCK DATABASE.');
    console.warn('==================================================\n');
  }
};
