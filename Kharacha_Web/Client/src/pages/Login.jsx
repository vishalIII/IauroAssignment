import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/login', {
        email,
        password
      });

      if (response.status === 200 && response.data.success) {
        setAlertMessage('User logged in successfully');
        setAlertType('success');
       
        localStorage.setItem('token', response.data.token);
        setEmail('');
        setPassword('');
        navigate("/");
      } else {
        setAlertMessage(response.data.message || 'Failed to login user');
        setAlertType('error');
      }
    } catch (error) {
      if (error.response) {
        setAlertMessage(error.response.data.message || 'Failed to login user');
      } else {
        setAlertMessage('Network error. Please try again.');
      }
      setAlertType('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">Login</h2>
        <form onSubmit={handleSubmit} method="POST">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-700"
              href="/register"
            >
              Register
            </a>
          </div>
        </form>
        {alertMessage && (
          <div className={`mt-4 p-2 ${alertType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded`}>
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
