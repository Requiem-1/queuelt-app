require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Venue = require('../models/Venue');
const Counter = require('../models/Counter');
const Ticket = require('../models/Ticket');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    console.log('[seed]: Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[seed]: Connected to MongoDB.');

    // Clear existing data
    console.log('[seed]: Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Venue.deleteMany({}),
      Counter.deleteMany({}),
      Ticket.deleteMany({}),
    ]);

    // Insert Venues
    console.log('[seed]: Inserting Venues...');
    const venues = await Venue.insertMany([
      {
        name: 'Main Cafeteria',
        slug: 'main-cafeteria',
        category: 'Dining',
        address: 'Building A, Floor 1',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
        estimatedAvgWaitTime: 12,
      },
      {
        name: 'CityCare Medical Clinic',
        slug: 'citycare-medical-clinic',
        category: 'Healthcare',
        address: 'Medical Block B, Suite 200',
        status: 'busy',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
        estimatedAvgWaitTime: 25,
      },
      {
        name: 'Pulse Fitness Club',
        slug: 'pulse-fitness-club',
        category: 'Gym',
        address: 'Sports Complex, Ground Floor',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        estimatedAvgWaitTime: 5,
      },
      {
        name: 'Central Knowledge Hub',
        slug: 'central-knowledge-hub',
        category: 'Library',
        address: 'University Avenue 10',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
        estimatedAvgWaitTime: 8,
      },
      {
        name: 'Apex Financial Services',
        slug: 'apex-financial-services',
        category: 'Banking',
        address: 'Financial Plaza, Floor 3',
        status: 'busy',
        imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&q=80&w=800',
        estimatedAvgWaitTime: 18,
      },
      {
        name: 'Grand Arena Event Center',
        slug: 'grand-arena-event-center',
        category: 'Events',
        address: 'Starlight Boulevard 500',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
        estimatedAvgWaitTime: 15,
      },
    ]);

    const mainCafeteria = venues[0];
    const cityCare = venues[1];
    const pulseFitness = venues[2];
    const knowledgeHub = venues[3];
    const apexFinancial = venues[4];
    const grandArena = venues[5];

    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const superAdminPassword = await bcrypt.hash('superadmin123', salt);

    // Insert Users
    console.log('[seed]: Inserting Users...');
    const users = await User.insertMany([
      {
        name: 'Super Admin',
        email: 'superadmin@queueit.app',
        password: superAdminPassword,
        role: 'superadmin',
      },
      {
        name: 'Admin User',
        email: 'admin@queueit.app',
        password: adminPassword,
        role: 'admin',
        assignedVenue: mainCafeteria._id,
      },
      { name: 'Sarah', email: 'sarah@example.com', role: 'guest', guestId: 'G-1001' },
      { name: 'Angela', email: 'angela@example.com', role: 'guest', guestId: 'G-1002' },
      { name: 'Ryan', email: 'ryan@example.com', role: 'guest', guestId: 'G-1003' },
      { name: 'Michael', email: 'michael@example.com', role: 'guest', guestId: 'G-1004' },
      { name: 'Pam', email: 'pam@example.com', role: 'guest', guestId: 'G-1005' },
      { name: 'Jim', email: 'jim@example.com', role: 'guest', guestId: 'G-1006' },
      { name: 'Dwight', email: 'dwight@example.com', role: 'guest', guestId: 'G-1007' },
      { name: 'Kelly', email: 'kelly@example.com', role: 'guest', guestId: 'G-1008' },
      { name: 'Oscar', email: 'oscar@example.com', role: 'guest', guestId: 'G-1009' },
      { name: 'Stanley', email: 'stanley@example.com', role: 'guest', guestId: 'G-1010' },
    ]);

    // Insert Counters for Venues
    console.log('[seed]: Inserting Counters...');
    const counters = await Counter.insertMany([
      // Main Cafeteria
      {
        venue: mainCafeteria._id,
        name: 'Veg Counter',
        code: 'V',
        status: 'active',
        currentServingToken: 'V-102',
        dailyTokenCounter: 105,
      },
      {
        venue: mainCafeteria._id,
        name: 'Non-Veg Counter',
        code: 'NV',
        status: 'active',
        currentServingToken: 'NV-201',
        dailyTokenCounter: 204,
      },
      {
        venue: mainCafeteria._id,
        name: 'Beverages',
        code: 'B',
        status: 'active',
        currentServingToken: 'B-045',
        dailyTokenCounter: 48,
      },
      // CityCare Medical Clinic
      {
        venue: cityCare._id,
        name: 'General Checkup',
        code: 'GC',
        status: 'active',
        currentServingToken: 'GC-012',
        dailyTokenCounter: 15,
      },
      {
        venue: cityCare._id,
        name: 'Pharmacy',
        code: 'PH',
        status: 'active',
        currentServingToken: 'PH-008',
        dailyTokenCounter: 10,
      },
      // Pulse Fitness Club
      {
        venue: pulseFitness._id,
        name: 'Reception / Check-in',
        code: 'R',
        status: 'active',
        currentServingToken: 'R-005',
        dailyTokenCounter: 8,
      },
      // Central Knowledge Hub
      {
        venue: knowledgeHub._id,
        name: 'Book Checkout Counter',
        code: 'BCO',
        status: 'active',
        currentServingToken: 'BCO-003',
        dailyTokenCounter: 12,
      },
      {
        venue: knowledgeHub._id,
        name: 'Digital Archival Lab',
        code: 'DAL',
        status: 'active',
        currentServingToken: 'DAL-001',
        dailyTokenCounter: 5,
      },
      // Apex Financial Services
      {
        venue: apexFinancial._id,
        name: 'Teller Counter 1',
        code: 'TC1',
        status: 'active',
        currentServingToken: 'TC1-015',
        dailyTokenCounter: 25,
      },
      {
        venue: apexFinancial._id,
        name: 'Account Opening Desk',
        code: 'AOD',
        status: 'active',
        currentServingToken: 'AOD-004',
        dailyTokenCounter: 8,
      },
      // Grand Arena Event Center
      {
        venue: grandArena._id,
        name: 'VIP Gate',
        code: 'VIP',
        status: 'active',
        currentServingToken: 'VIP-002',
        dailyTokenCounter: 10,
      },
      {
        venue: grandArena._id,
        name: 'General Admission Gate A',
        code: 'GA',
        status: 'active',
        currentServingToken: 'GA-042',
        dailyTokenCounter: 80,
      },
    ]);

    const vegCounter = counters[0];
    const nonVegCounter = counters[1];
    const bevCounter = counters[2];

    // Insert Tickets
    console.log('[seed]: Inserting Tickets...');
    await Ticket.insertMany([
      {
        ticketNumber: 'V-101',
        venue: mainCafeteria._id,
        counter: vegCounter._id,
        user: users[2]._id,
        guestName: 'Sarah',
        partySize: 2,
        status: 'served',
        qrCodeToken: 'QR-V101-TOKEN',
        joinedAt: new Date(Date.now() - 40 * 60000),
        calledAt: new Date(Date.now() - 25 * 60000),
        servedAt: new Date(Date.now() - 15 * 60000),
        estimatedWaitMinutes: 0,
      },
      {
        ticketNumber: 'V-102',
        venue: mainCafeteria._id,
        counter: vegCounter._id,
        user: users[3]._id,
        guestName: 'Angela',
        partySize: 1,
        status: 'serving',
        qrCodeToken: 'QR-V102-TOKEN',
        joinedAt: new Date(Date.now() - 30 * 60000),
        calledAt: new Date(Date.now() - 5 * 60000),
        estimatedWaitMinutes: 0,
      },
      {
        ticketNumber: 'V-103',
        venue: mainCafeteria._id,
        counter: vegCounter._id,
        user: users[4]._id,
        guestName: 'Ryan',
        partySize: 3,
        status: 'next',
        qrCodeToken: 'QR-V103-TOKEN',
        joinedAt: new Date(Date.now() - 20 * 60000),
        estimatedWaitMinutes: 3,
      },
      {
        ticketNumber: 'V-104',
        venue: mainCafeteria._id,
        counter: vegCounter._id,
        user: users[5]._id,
        guestName: 'Michael',
        partySize: 4,
        status: 'waiting',
        qrCodeToken: 'QR-V104-TOKEN',
        joinedAt: new Date(Date.now() - 15 * 60000),
        estimatedWaitMinutes: 8,
      },
      {
        ticketNumber: 'V-105',
        venue: mainCafeteria._id,
        counter: vegCounter._id,
        user: users[6]._id,
        guestName: 'Pam',
        partySize: 2,
        status: 'waiting',
        qrCodeToken: 'QR-V105-TOKEN',
        joinedAt: new Date(Date.now() - 10 * 60000),
        estimatedWaitMinutes: 14,
      },
      {
        ticketNumber: 'NV-201',
        venue: mainCafeteria._id,
        counter: nonVegCounter._id,
        user: users[7]._id,
        guestName: 'Jim',
        partySize: 2,
        status: 'serving',
        qrCodeToken: 'QR-NV201-TOKEN',
        joinedAt: new Date(Date.now() - 25 * 60000),
        calledAt: new Date(Date.now() - 4 * 60000),
        estimatedWaitMinutes: 0,
      },
      {
        ticketNumber: 'NV-202',
        venue: mainCafeteria._id,
        counter: nonVegCounter._id,
        user: users[8]._id,
        guestName: 'Dwight',
        partySize: 1,
        status: 'waiting',
        qrCodeToken: 'QR-NV202-TOKEN',
        joinedAt: new Date(Date.now() - 12 * 60000),
        estimatedWaitMinutes: 6,
      },
      {
        ticketNumber: 'B-045',
        venue: mainCafeteria._id,
        counter: bevCounter._id,
        user: users[9]._id,
        guestName: 'Kelly',
        partySize: 1,
        status: 'serving',
        qrCodeToken: 'QR-B045-TOKEN',
        joinedAt: new Date(Date.now() - 18 * 60000),
        calledAt: new Date(Date.now() - 2 * 60000),
        estimatedWaitMinutes: 0,
      },
      {
        ticketNumber: 'B-046',
        venue: mainCafeteria._id,
        counter: bevCounter._id,
        user: users[10]._id,
        guestName: 'Oscar',
        partySize: 2,
        status: 'waiting',
        qrCodeToken: 'QR-B046-TOKEN',
        joinedAt: new Date(Date.now() - 8 * 60000),
        estimatedWaitMinutes: 4,
      },
      {
        ticketNumber: 'B-047',
        venue: mainCafeteria._id,
        counter: bevCounter._id,
        user: users[11]._id,
        guestName: 'Stanley',
        partySize: 1,
        status: 'waiting',
        qrCodeToken: 'QR-B047-TOKEN',
        joinedAt: new Date(Date.now() - 5 * 60000),
        estimatedWaitMinutes: 9,
      },
    ]);

    console.log('[seed]: Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[seed]: Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
