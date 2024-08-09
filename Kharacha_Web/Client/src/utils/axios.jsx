import axe from 'axios';

// Create an instance of axios with a base URL
const axios = axe.create({
  baseURL: 'http://localhost:3000', // Set your base URL here
  // baseURL: 'https://proappoint.onrender.com',
  timeout: 10000, // Optional timeout configuration
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers as needed
  },
});

export default axios;

