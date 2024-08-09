import React, { useState } from 'react';
import axios from '../utils/axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertSlice';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading())
      const response = await axios.post('/api/user/register', {
        name,
        email,
        password
      });

      if (response.data.success) {
        setAlertMessage(response.data.message);
        setAlertType('success');
        setName('');
        setEmail('');6
        setPassword('');
        navigate('/login')
      } else {
        setAlertMessage(response.data.message || 'Failed to register user');
        setAlertType('error');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setAlertMessage('Network error. Please try again.');
      setAlertType('error');
    }finally{
       dispatch(hideLoading())
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">Register</h2>
        <form onSubmit={handleSubmit} method="POST">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              Register
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-700"
              href="/login"
            >
              Login
            </a>
          </div>
        </form>
        {alertMessage && (
          <div className={`mt-4 p-2 ${alertType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
