const express = require('express');
const router = express.Router();
const Joi = require('joi');
const leadService = require('../services/leadService');
const aiService = require('../services/aiService');

// Validation schema for lead data
const leadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  company: Joi.string().required(),
  position: Joi.string().required(),
  industry: Joi.string().required(),
  companySize: Joi.string().required(),
  phone: Joi.string().allow(''),
  message: Joi.string().allow('')
});

// Create a new lead
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = leadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    
    const leadData = { ...value };
    
    // Get qualification score from AI
    try {
      const aiResult = await aiService.qualifyLead(leadData);
      leadData.qualificationScore = aiResult.score;
      leadData.aiInsights = aiResult.insights;
    } catch (aiError) {
      console.error('Error qualifying lead with AI:', aiError);
      // Fallback to a default score if AI fails
      leadData.qualificationScore = Math.floor(Math.random() * 100);
      leadData.aiInsights = 'AI qualification unavailable';
    }
    
    // Save the lead
    const savedLead = await leadService.saveLead(leadData);
    
    res.status(201).json({ success: true, data: savedLead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, error: 'Failed to create lead' });
  }
});

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await leadService.getAllLeads();
    res.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({ success: false, error: 'Failed to get leads' });
  }
});

// Export leads as CSV - IMPORTANT: specific routes must come before parameterized routes
router.get('/export/csv', async (req, res) => {
  try {
    const csvData = await leadService.exportLeadsToCSV();
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
    
    // Send CSV data directly
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({ success: false, error: 'Failed to export leads' });
  }
});

// Get qualified leads - IMPORTANT: specific routes must come before parameterized routes
router.get('/qualified/:score', async (req, res) => {
  try {
    const minScore = parseInt(req.params.score, 10) || 70;
    const leads = await leadService.getQualifiedLeads(minScore);
    res.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error getting qualified leads:', error);
    res.status(500).json({ success: false, error: 'Failed to get qualified leads' });
  }
});

// Get a lead by ID - IMPORTANT: This must come after all other specific routes
router.get('/:id', async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    
    res.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error getting lead:', error);
    res.status(500).json({ success: false, error: 'Failed to get lead' });
  }
});

module.exports = router;
