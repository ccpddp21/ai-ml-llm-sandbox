const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const csvParser = require('csv-parser');
const leadService = require('../services/leadService');
const aiService = require('../services/aiService');

// CSV file path
const dataFilePath = path.join(__dirname, '../../data/leads.csv');

// Create leads.csv if it doesn't exist
const ensureCSVExists = () => {
  if (!fs.existsSync(dataFilePath)) {
    const csvWriter = createObjectCsvWriter({
      path: dataFilePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'company', title: 'Company' },
        { id: 'position', title: 'Position' },
        { id: 'industry', title: 'Industry' },
        { id: 'companySize', title: 'Company Size' },
        { id: 'phone', title: 'Phone' },
        { id: 'message', title: 'Message' },
        { id: 'qualificationScore', title: 'Qualification Score' },
        { id: 'aiInsights', title: 'AI Insights' },
        { id: 'createdAt', title: 'Created At' }
      ]
    });
    csvWriter.writeRecords([]);
  }
};

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    ensureCSVExists();
    
    const leadData = req.body;
    
    // Generate a unique ID
    leadData.id = Date.now().toString();
    leadData.createdAt = new Date().toISOString();
    
    // Qualify the lead using AI
    const aiResult = await aiService.qualifyLead(leadData);
    leadData.qualificationScore = aiResult.score;
    leadData.aiInsights = aiResult.insights;
    
    // Save lead to CSV
    await leadService.saveLead(leadData);
    
    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: leadData
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      error: error.message
    });
  }
};

// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    ensureCSVExists();
    const leads = await leadService.getAllLeads();
    
    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leads',
      error: error.message
    });
  }
};

// Get a specific lead by ID
exports.getLeadById = async (req, res) => {
  try {
    ensureCSVExists();
    const { id } = req.params;
    const lead = await leadService.getLeadById(id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Error getting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve lead',
      error: error.message
    });
  }
};

// Get qualified leads based on minimum score
exports.getQualifiedLeads = async (req, res) => {
  try {
    ensureCSVExists();
    const { minScore } = req.params;
    const minScoreNum = parseInt(minScore, 10);
    
    if (isNaN(minScoreNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid minimum score'
      });
    }
    
    const leads = await leadService.getAllLeads();
    const qualifiedLeads = leads.filter(lead => 
      parseInt(lead.qualificationScore, 10) >= minScoreNum
    );
    
    res.status(200).json({
      success: true,
      count: qualifiedLeads.length,
      data: qualifiedLeads
    });
  } catch (error) {
    console.error('Error getting qualified leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve qualified leads',
      error: error.message
    });
  }
};

// Export leads to CSV
exports.exportLeadsToCSV = async (req, res) => {
  try {
    ensureCSVExists();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    
    const fileStream = fs.createReadStream(dataFilePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export leads',
      error: error.message
    });
  }
};
