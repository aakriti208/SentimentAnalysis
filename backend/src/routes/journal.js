const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { protect } = require('../controllers/authController');

router.use(protect); // All routes require authentication

router.get('/', journalController.getAll);
router.get('/:id', journalController.getOne);
router.post('/', journalController.create);
router.put('/:id', journalController.update);
router.delete('/:id', journalController.delete);

module.exports = router;