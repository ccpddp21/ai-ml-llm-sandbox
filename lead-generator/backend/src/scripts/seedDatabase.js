require('dotenv').config({ path: '../../.env' });
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../config/database');
const Lead = require('../models/Lead');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Test data
const testLeads = [
  {
    name: 'Alice Zhang',
    email: 'alice.zhang@quantumtech.io',
    company: 'QuantumTech',
    position: 'CTO',
    industry: 'Technology',
    companySize: '201-500',
    phone: '+1-415-555-0132',
    message: 'Looking for AI solutions to optimize our cloud infrastructure.',
    qualificationScore: 92,
    aiInsights: 'High-value lead with technical background and decision-making authority. Immediate follow-up recommended.'
  },
  {
    name: 'Ben Castillo',
    email: 'bcastillo@urbanfinance.org',
    company: 'Urban Finance Co.',
    position: 'Director of Strategy',
    industry: 'Finance',
    companySize: '51-200',
    phone: '+1-312-555-0117',
    message: 'Interested in automation tools for risk modeling.',
    qualificationScore: 85,
    aiInsights: 'Strategic decision-maker in finance sector. Potential for large-scale implementation.'
  },
  {
    name: 'Dr. Carla Edwards',
    email: 'cedwards@healthrevive.com',
    company: 'HealthRevive',
    position: 'Chief Innovation Officer',
    industry: 'Healthcare',
    companySize: '501-1000',
    phone: '+1-617-555-0123',
    message: 'Seeking AI solutions for remote patient monitoring.',
    qualificationScore: 90,
    aiInsights: 'Healthcare innovation leader with specific use case. High potential for long-term partnership.'
  },
  {
    name: 'David Lopez',
    email: 'dlopez@buildrightconstruct.com',
    company: 'BuildRight Construction',
    position: 'Operations Manager',
    industry: 'Construction',
    companySize: '1000+',
    phone: '+1-702-555-0109',
    message: 'Exploring smart scheduling platforms for project management.',
    qualificationScore: 78,
    aiInsights: 'Large construction firm with operational needs. Good fit for scheduling and resource management solutions.'
  },
  {
    name: 'Emily Khan',
    email: 'ekhan@edpath.org',
    company: 'EdPath Learning',
    position: 'Product Manager',
    industry: 'Education',
    companySize: '11-50',
    phone: '+1-202-555-0188',
    message: 'Curious about personalized learning through AI tutoring.',
    qualificationScore: 75,
    aiInsights: 'EdTech startup with product focus. May need education-specific customizations.'
  },
  {
    name: 'Frederick Moore',
    email: 'fred.moore@agrochain.com',
    company: 'AgroChain Inc.',
    position: 'VP of Product',
    industry: 'Agriculture',
    companySize: '201-500',
    phone: '+1-919-555-0199',
    message: 'Investigating supply chain tracking using ML and blockchain.',
    qualificationScore: 82,
    aiInsights: 'Innovative agriculture company exploring advanced tech. Good match for data analytics offerings.'
  },
  {
    name: 'Grace Lee',
    email: 'glee@movemoretransport.com',
    company: 'MoveMore Transport',
    position: 'Business Analyst',
    industry: 'Transportation',
    companySize: '1000+',
    phone: '+1-646-555-0162',
    message: 'Looking to analyze fleet efficiency using predictive analytics.',
    qualificationScore: 80,
    aiInsights: 'Large transportation company with specific analytics needs. Good potential for data-driven solutions.'
  },
  {
    name: 'Hassan Jafari',
    email: 'hjafari@retailconnect.com',
    company: 'Retail Connect',
    position: 'Head of Marketing',
    industry: 'Retail',
    companySize: '51-200',
    phone: '+1-801-555-0144',
    message: 'Can your AI help us segment customers for targeted campaigns?',
    qualificationScore: 76,
    aiInsights: 'Marketing focus with clear use case. May be interested in customer analytics and segmentation tools.'
  },
  {
    name: 'Isabella Rossi',
    email: 'isabella.rossi@greenpulse.energy',
    company: 'GreenPulse Energy',
    position: 'Sustainability Lead',
    industry: 'Energy',
    companySize: '11-50',
    phone: '+1-305-555-0139',
    message: 'Seeking smart tools for energy consumption optimization.',
    qualificationScore: 88,
    aiInsights: 'Sustainability-focused energy startup. Strong alignment with optimization solutions.'
  },
  {
    name: 'Jason Kim',
    email: 'jkim@creativesync.com',
    company: 'CreativeSync',
    position: 'CEO',
    industry: 'Entertainment',
    companySize: '1-10',
    phone: '+1-503-555-0127',
    message: 'Want to integrate generative AI into our video production workflows.',
    qualificationScore: 79,
    aiInsights: 'Small creative company with CEO involvement. Interested in cutting-edge generative AI applications.'
  },
  // Include the existing lead from the CSV
  {
    name: 'John Doe',
    email: 'john@ai-defense.com',
    company: 'AI Defense Corp',
    position: 'CTO',
    industry: 'Finance',
    companySize: '11-50',
    phone: '',
    message: 'Decision-maker at a govtech firm with AI applications.',
    qualificationScore: 80,
    aiInsights: 'Mock qualification score based on available lead information. This is a high-quality lead that should be prioritized for follow-up.'
  }
];

// Seed the database
async function seedDatabase() {
  try {
    // Sync the database (create tables)
    await sequelize.sync({ force: true }); // Warning: This will drop existing tables!
    
    console.log('Database synced. Inserting seed data...');
    
    // Insert test leads
    await Lead.bulkCreate(testLeads);
    
    console.log('Successfully seeded database with test leads!');
    
    // Close the database connection
    await sequelize.close();
    
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeder
seedDatabase();
