const Lead = require('../models/Lead');
const { Op } = require('sequelize');

// Save a lead to database
exports.saveLead = async (leadData) => {
  try {
    const lead = await Lead.create(leadData);
    return lead.toJSON();
  } catch (error) {
    console.error('Error saving lead:', error);
    throw error;
  }
};

// Get all leads from database
exports.getAllLeads = async () => {
  try {
    const leads = await Lead.findAll({
      order: [['createdAt', 'DESC']]
    });
    return leads.map(lead => lead.toJSON());
  } catch (error) {
    console.error('Error getting leads:', error);
    throw error;
  }
};

// Get a lead by ID from database
exports.getLeadById = async (id) => {
  try {
    const lead = await Lead.findByPk(id);
    return lead ? lead.toJSON() : null;
  } catch (error) {
    console.error('Error getting lead by ID:', error);
    throw error;
  }
};

// Get qualified leads based on minimum score
exports.getQualifiedLeads = async (minScore) => {
  try {
    const leads = await Lead.findAll({
      where: {
        qualificationScore: {
          [Op.gte]: minScore
        }
      },
      order: [['qualificationScore', 'DESC']]
    });
    return leads.map(lead => lead.toJSON());
  } catch (error) {
    console.error('Error getting qualified leads:', error);
    throw error;
  }
};

// Export leads as CSV
exports.exportLeadsToCSV = async () => {
  try {
    const leads = await Lead.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    // Convert leads to JSON objects
    const leadsData = leads.map(lead => lead.toJSON());
    
    // Get all possible headers from the data
    const headers = ['id', 'name', 'email', 'company', 'position', 'industry', 'companySize', 
                    'phone', 'message', 'qualificationScore', 'aiInsights', 'createdAt', 'updatedAt'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add each lead as a row
    leadsData.forEach(lead => {
      const row = headers.map(header => {
        // Handle values that might contain commas by wrapping in quotes
        let value = lead[header] !== undefined ? String(lead[header]) : '';
        // Escape quotes and wrap in quotes if contains comma or newline
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
  } catch (error) {
    console.error('Error exporting leads:', error);
    throw error;
  }
};
