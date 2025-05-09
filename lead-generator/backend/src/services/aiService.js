const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Qualifies a lead using Google Gemini AI
 * @param {Object} leadData - The lead data to qualify
 * @returns {Object} - Object containing qualification score and insights
 */
exports.qualifyLead = async (leadData) => {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      console.warn('GEMINI_API_KEY not configured. Using mock qualification.');
      return mockQualification(leadData);
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare the prompt
    const prompt = `
    Please analyze this lead information and provide:
    1. A qualification score from 1-100 based on how promising this lead appears
    2. Brief insights about why this score was given
    
    Lead Information:
    - Name: ${leadData.name || 'Not provided'}
    - Email: ${leadData.email || 'Not provided'}
    - Company: ${leadData.company || 'Not provided'}
    - Position: ${leadData.position || 'Not provided'}
    - Industry: ${leadData.industry || 'Not provided'}
    - Company Size: ${leadData.companySize || 'Not provided'}
    - Message: ${leadData.message || 'Not provided'}
    
    Consider factors like:
    - Decision-maker status (based on position)
    - Company size fit
    - Industry relevance
    - Level of interest shown in message
    
    Format your response as JSON with these fields:
    {
      "score": [number between 1-100],
      "insights": [brief explanation of score]
    }
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      // Extract JSON from the response if needed
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const parsedResponse = JSON.parse(jsonStr);
      
      return {
        score: parsedResponse.score,
        insights: parsedResponse.insights
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback to mock if parsing fails
      return mockQualification(leadData);
    }
  } catch (error) {
    console.error('Error qualifying lead with AI:', error);
    // Fallback to mock qualification
    return mockQualification(leadData);
  }
};

/**
 * Provides a mock qualification when AI is unavailable
 * @param {Object} leadData - The lead data to qualify
 * @returns {Object} - Object containing qualification score and insights
 */
function mockQualification(leadData) {
  // Simple scoring algorithm based on available data
  let score = 50; // Base score
  
  // Adjust score based on available fields
  if (leadData.position && isDecisionMaker(leadData.position)) score += 15;
  if (leadData.companySize && isTargetCompanySize(leadData.companySize)) score += 10;
  if (leadData.industry && isTargetIndustry(leadData.industry)) score += 10;
  if (leadData.message && leadData.message.length > 50) score += 5;
  if (leadData.email && leadData.email.includes('gmail.com')) score -= 5;
  
  // Ensure score is within 1-100 range
  score = Math.max(1, Math.min(100, score));
  
  return {
    score: score,
    insights: `Mock qualification score based on available lead information. ${getScoreInsight(score)}`
  };
}

/**
 * Checks if the position title indicates a decision maker
 * @param {string} position - Job position
 * @returns {boolean} - True if likely a decision maker
 */
function isDecisionMaker(position) {
  const decisionMakerTitles = [
    'ceo', 'cto', 'cio', 'cfo', 'cmo', 
    'director', 'vp', 'head', 'chief', 
    'president', 'founder', 'owner', 'manager'
  ];
  
  position = position.toLowerCase();
  return decisionMakerTitles.some(title => position.includes(title));
}

/**
 * Checks if company size is within target range
 * @param {string} size - Company size
 * @returns {boolean} - True if within target range
 */
function isTargetCompanySize(size) {
  // Convert size to lowercase for comparison
  size = size.toLowerCase();
  
  // Check for keywords indicating medium to large companies
  if (
    size.includes('50-') || 
    size.includes('100-') || 
    size.includes('500-') || 
    size.includes('1000+') ||
    size.includes('enterprise') ||
    size.includes('medium') ||
    size.includes('large')
  ) {
    return true;
  }
  
  // Try to extract numeric values
  const numbers = size.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    const employeeCount = parseInt(numbers[0], 10);
    return employeeCount >= 50;
  }
  
  return false;
}

/**
 * Checks if industry is a target industry
 * @param {string} industry - Industry name
 * @returns {boolean} - True if a target industry
 */
function isTargetIndustry(industry) {
  const targetIndustries = [
    'tech', 'technology', 'software', 'saas', 
    'finance', 'financial', 'banking', 
    'healthcare', 'health', 'medical',
    'manufacturing', 'retail', 'ecommerce',
    'education', 'consulting', 'professional services'
  ];
  
  industry = industry.toLowerCase();
  return targetIndustries.some(target => industry.includes(target));
}

/**
 * Returns insight text based on score range
 * @param {number} score - Qualification score
 * @returns {string} - Insight text
 */
function getScoreInsight(score) {
  if (score >= 80) {
    return 'This is a high-quality lead that should be prioritized for follow-up.';
  } else if (score >= 60) {
    return 'This is a good lead that shows potential and should be contacted.';
  } else if (score >= 40) {
    return 'This is an average lead that may require additional qualification.';
  } else {
    return 'This lead shows limited potential based on the provided information.';
  }
}
