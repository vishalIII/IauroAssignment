const express = require('express');
const router = express.Router();
const Expense = require('../models/expenseModel'); 
const auth = require('../middlewares/authMiddleware');


router.post('/add', async (req, res) => {
    try {
        const { userId, category, subcategory, amount, comments } = req.body;

        // console.log('Received Data:', req.body); 

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const newExpense = new Expense({
            user: userId,  
            category,
            subcategory,
            amount,
            comments
        });
        await newExpense.save();
        res.status(201).json({ success: true, message: 'Expense added successfully', data: newExpense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


router.put('/:id', auth, async (req, res) => {
  const { category, subcategory, amount, comments } = req.body;

  const expenseFields = {};
  if (category) expenseFields.category = category;
  if (subcategory) expenseFields.subcategory = subcategory;
  if (amount) expenseFields.amount = amount;
  if (comments) expenseFields.comments = comments;

  try {
      let expense = await Expense.findById(req.params.id);

      if (!expense) return res.status(404).json({ msg: 'Expense not found' });

      if (expense.user.toString() !== req.body.userId) {
          return res.status(401).json({ msg: 'User not authorized' });
      }

      expense = await Expense.findByIdAndUpdate(
          req.params.id,
          { $set: expenseFields },
          { new: true }
      );

      res.json({ success: true, message: 'Expense updated successfully', data: expense });
  } catch (err) {
      console.error('Error updating expense:', err.message);
      res.status(500).send('Server Error');
  }
});


router.delete('/:id', async (req, res) => {
    try {
      const expenseId = req.params.id;
      const result = await Expense.findByIdAndDelete(expenseId);
      
      if (result) {
        res.json({ success: true, message: 'Expense deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Expense not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  


router.post('/user', auth, async (req, res) => {
  try {
      const { userId } = req.body;

      if (!userId) {
          return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
      res.json({ success: true, data: expenses });
  } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
  }
});



module.exports = router;
