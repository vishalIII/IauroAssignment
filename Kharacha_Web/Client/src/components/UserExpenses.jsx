import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import Popup from './PopupU';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  // For dynamic filter options
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.post('/api/expenses/user', { userId: user._id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          const expensesData = response.data.data;
          setExpenses(expensesData);

          // Extract unique categories and subcategories
          const uniqueCategories = [...new Set(expensesData.map(exp => exp.category))];
          setCategories(uniqueCategories);

          const uniqueSubcategories = [...new Set(expensesData.map(exp => exp.subcategory))];
          setSubcategories(uniqueSubcategories);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  useEffect(() => {
    let filtered = [...expenses];

    if (startDate) {
      filtered = filtered.filter(expense => new Date(expense.createdAt) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(expense => new Date(expense.createdAt) <= new Date(endDate));
    }

    if (selectedCategory) {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    if (selectedSubcategory) {
      filtered = filtered.filter(expense => expense.subcategory === selectedSubcategory);
    }

    setFilteredExpenses(filtered);
  }, [expenses, startDate, endDate, selectedCategory, selectedSubcategory]);

  const handleUpdateClick = (expense) => {
    setSelectedExpense(expense);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedExpense(null);
    // Reload
    window.location.reload(true);
  };

  const handleRemoveFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategory('');
    setSelectedSubcategory('');
  };

  const handleDelete = async (expenseId) => {
    try {
      const response = await axios.delete(`/api/expenses/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setExpenses(expenses.filter(exp => exp._id !== expenseId));
        setFilteredExpenses(filteredExpenses.filter(exp => exp._id !== expenseId));
        alert('Expense deleted successfully');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  // Calculating total amount
  const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Data for the chart
  const categoryData = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Amount by Category',
        data: Object.values(categoryData),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Expenses</h2>

      {/* Filters */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Subcategory:</label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Subcategories</option>
                {subcategories.filter(subcat => subcat.category === selectedCategory).map(subcategory => (
                  <option key={subcategory} value={subcategory}>{subcategory}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <button
          onClick={handleRemoveFilters}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Remove Filters
        </button>
      </div>

      {/* Displaying total amount */}
      <h3 className="text-xl font-semibold mb-4">Total Amount: Rs.{totalAmount.toFixed(2)}</h3>

      {/* Chart */}
      {filteredExpenses.length > 0 && (
        <div className="mb-6">
          <Bar data={chartData} />
        </div>
      )}

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <p className="text-gray-500">No expenses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Subcategory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Comments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map(expense => (
                <tr key={expense._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.subcategory}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs.{expense.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.comments}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(expense.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleUpdateClick(expense)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isPopupOpen && (
        <Popup 
          isOpen={isPopupOpen} 
          onClose={handleClosePopup} 
          onSubmit={handleClosePopup} 
          expense={selectedExpense}
        />
      )}
    </div>
  );
};

export default UserExpenses;
