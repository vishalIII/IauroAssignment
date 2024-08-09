import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../utils/axios';
import { showLoading, hideLoading } from '../redux/alertSlice';

const Popup = ({ isOpen, onClose, onSubmit, expense }) => {
  const [selectedCategory, setSelectedCategory] = useState(expense?.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(expense?.subcategory || '');
  const [amount, setAmount] = useState(expense?.amount || '');
  const [comments, setComments] = useState(expense?.comments || '');
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const categories = {
    "Food & Dining": ["Groceries", "Restaurants", "Coffee Shops"],
    "Transportation": ["Fuel", "Public Transit", "Car Maintenance"],
    "Housing": ["Rent", "Mortgage", "Utilities", "Home Repairs"],
    "Entertainment": ["Movies", "Music", "Streaming Services", "Events"],
    "Health & Fitness": ["Gym Memberships", "Medical Expenses", "Supplements"],
    "Shopping": ["Clothes", "Electronics", "Online Purchases"],
    "Travel": ["Flights", "Hotels", "Travel Insurance", "Vacation Activities"],
    "Education": ["Courses", "Books", "School Supplies", "Tuition"],
    "Personal Care": ["Haircuts", "Skincare", "Cosmetics"],
    "Insurance": ["Health", "Auto", "Home", "Life Insurance"],
    "Investments": ["Stocks", "Mutual Funds", "Retirement Savings"],
    "Gifts & Donations": ["Charity", "Gifts for Family and Friends"],
    "Utilities": ["Electricity", "Water", "Internet", "Phone"],
    "Miscellaneous": ["Anything that doesn’t fit into other categories"],
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(showLoading());
      let response;

      if (expense) {
        // Update existing expense
        response = await axios.put(`/api/expenses/${expense._id}`, {
          userId: user._id,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          amount,
          comments,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        // Add new expense
        response = await axios.post('/api/expenses/add', {
          userId: user._id,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          amount,
          comments,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      if (response.data.success) {
        alert(`Expense ${expense ? 'updated' : 'added'} successfully`);
        onSubmit();
        onClose();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(`Error ${expense ? 'updating' : 'adding'} expense:`, error);
    } finally {
      dispatch(hideLoading());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{expense ? 'Update Expense' : 'Add New Expense'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="" disabled>Select Category</option>
              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Subcategory</label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="" disabled>Select Subcategory</option>
                {categories[selectedCategory].map((subcategory) => (
                  <option key={subcategory} value={subcategory}>{subcategory}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comments (optional)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {expense ? 'Update Expense' : 'Add Expense'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
