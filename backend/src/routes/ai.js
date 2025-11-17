const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../controllers/authController');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/api';

// Simple proxy to ML service
router.post('/analyze-entry', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/classify-entry`, {
      text: text
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ML Service Error:', error.message);
    res.status(500).json({ 
      error: 'AI analysis failed',
      details: error.message 
    });
  }
});

module.exports = router;