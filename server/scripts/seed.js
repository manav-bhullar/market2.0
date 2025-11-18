require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Item = require('../models/Item');
const Review = require('../models/Review');

/**
 * Seed script to populate database with dummy data
 * Run with: npm run seed
 */
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Item.deleteMany({});
    await Review.deleteMany({});

    // Create dummy users
    console.log('Creating users...');
    const users = await User.insertMany([
      {
        googleId: 'user1_google',
        name: 'Raj Kumar',
        email: 'raj.kumar@thapar.edu',
        photoURL: 'https://i.pravatar.cc/150?img=1',
        averageRating: 4.5,
        itemsSold: 5,
      },
      {
        googleId: 'user2_google',
        name: 'Priya Singh',
        email: 'priya.singh@thapar.edu',
        photoURL: 'https://i.pravatar.cc/150?img=2',
        averageRating: 4.8,
        itemsSold: 8,
      },
      {
        googleId: 'user3_google',
        name: 'Arjun Patel',
        email: 'arjun.patel@thapar.edu',
        photoURL: 'https://i.pravatar.cc/150?img=3',
        averageRating: 4.2,
        itemsSold: 3,
      },
    ]);

    // Create dummy items
    console.log('Creating items...');
    const items = await Item.insertMany([
      {
        title: 'Physics Textbook - Halliday & Resnick',
        description: 'Complete Physics textbook in excellent condition. Used for 2 semesters. No annotations or markings.',
        price: 450,
        category: 'Books',
        imageURL: 'https://images.unsplash.com/photo-150784272343-583f20270319?w=400',
        sellerId: users[0]._id,
        status: 'active',
        averageRating: 4.5,
      },
      {
        title: 'HP Laptop - i5 11th Gen',
        description: '8GB RAM, 256GB SSD, 15.6" HD Display. 2 years old but in perfect working condition. Charger included.',
        price: 35000,
        category: 'Electronics',
        imageURL: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        sellerId: users[1]._id,
        status: 'active',
        averageRating: 4.8,
      },
      {
        title: 'Wooden Study Desk',
        description: 'Solid wood study desk with storage shelves. Very sturdy and spacious. Perfect for college room.',
        price: 2500,
        category: 'Furniture',
        imageURL: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
        sellerId: users[2]._id,
        status: 'active',
        averageRating: 4.2,
      },
      {
        title: 'Winter Jacket - Puffer',
        description: 'Black puffer jacket, size M. Barely used. Warm and waterproof. Purchased from Decathlon.',
        price: 1200,
        category: 'Clothing',
        imageURL: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400',
        sellerId: users[0]._id,
        status: 'active',
        averageRating: 4.5,
      },
      {
        title: 'Cricket Bat - English Willow',
        description: 'High quality English Willow cricket bat. 2lb 8oz. Perfect for net practice.',
        price: 3500,
        category: 'Sports',
        imageURL: 'https://images.unsplash.com/photo-1536126613408-eca07ce68773?w=400',
        sellerId: users[1]._id,
        status: 'active',
        averageRating: 4.8,
      },
      {
        title: 'Chemistry Lab Notes',
        description: 'Comprehensive handwritten notes from Chemistry lectures. Covers all topics for semester exams.',
        price: 200,
        category: 'Books',
        imageURL: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        sellerId: users[2]._id,
        status: 'active',
        averageRating: 4.2,
      },
    ]);

    // Create dummy reviews
    console.log('Creating reviews...');
    const reviews = await Review.insertMany([
      {
        itemId: items[0]._id,
        userId: users[1]._id,
        rating: 5,
        comment: 'Great condition! Seller was very helpful. Highly recommended.',
      },
      {
        itemId: items[0]._id,
        userId: users[2]._id,
        rating: 4,
        comment: 'Good book. Fast delivery.',
      },
      {
        itemId: items[1]._id,
        userId: users[0]._id,
        rating: 5,
        comment: 'Laptop works perfectly! No issues. Great deal.',
      },
      {
        itemId: items[2]._id,
        userId: users[1]._id,
        rating: 4,
        comment: 'Sturdy desk. Arrived in good condition.',
      },
      {
        itemId: items[3]._id,
        userId: users[1]._id,
        rating: 5,
        comment: 'Perfect! Exactly as described. Very happy with purchase.',
      },
      {
        itemId: items[4]._id,
        userId: users[2]._id,
        rating: 5,
        comment: 'High quality bat. Worth every penny.',
      },
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} users, ${items.length} items, and ${reviews.length} reviews`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
