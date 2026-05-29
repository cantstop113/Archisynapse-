const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const customerService = require('../services/customerService');

// Create customer
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer({
      ...req.body,
      apiKey: req.apiKey
    });
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
});

// Get customer
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const customer = await customerService.getCustomer(req.params.id);
    if (!customer) {
      return res.status(404).json({
        error: {
          code: 'not_found',
          message: 'Customer not found'
        }
      });
    }
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

// List customers
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const customers = await customerService.listCustomers({
      limit: Math.min(parseInt(limit), 100),
      offset: parseInt(offset),
      apiKey: req.apiKey
    });
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
