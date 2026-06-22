import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import Testimonial from '../models/Testimonial.js';
import { mockProducts, mockTestimonials } from '../config/mockData.js';

const seedDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.error('Cannot seed: MongoDB is not connected.');
      process.exit(1);
    }
    
    await Product.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('Cleared existing data');

    await Product.insertMany(mockProducts);
    console.log(`Seeded ${mockProducts.length} products`);

    await Testimonial.insertMany(mockTestimonials);
    console.log(`Seeded ${mockTestimonials.length} testimonials`);

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

connectDB().then(seedDB);
