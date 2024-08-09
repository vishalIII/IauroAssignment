import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUtensils, FaSignOutAlt, FaUser , FaPlus  } from 'react-icons/fa';
import { IoPerson, IoMenu, IoClose } from 'react-icons/io5';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminMenu = [
    { name: 'Home', path: '/', icon: <FaHome /> },
  ];

  const userMenu = [
    { name: 'Home', path: '/', icon: <FaHome /> }
  ];

  const mainMenu = user?.isAdmin ? adminMenu : userMenu;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="bg-indigo-700  text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button className="md:hidden mr-4" onClick={toggleSidebar}>
            <IoMenu size={24} />
          </button>
          <h1 className="text-lg font-semibold mr-8">Kharacha</h1>
          <div className="hidden md:flex items-center space-x-4">
            {mainMenu.map((item) => (
              <Link key={item.path} to={item.path} className="flex items-center mx-2 text-white hover:text-yellow-300">
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center mx-2">
            <FaUser className="text-white text-xl" />
            <span className="ml-2">{user?.name}</span>
          </span>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="hidden md:flex items-center mx-2 text-white hover:text-red-400"
          >
            <FaSignOutAlt />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-50 bg-green-600 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:hidden`}>
        <div className="p-4 w-64">
          <button className="text-white" onClick={toggleSidebar}>
            <IoClose size={24} />
          </button>
          <ul className="mt-4 space-y-4">
            {mainMenu.map((item) => (
              <li key={item.path} className="hover:bg-green-700 rounded-md flex items-center p-2">
                {item.icon}
                <Link to={item.path} onClick={toggleSidebar} className="ml-2">
                  {item.name}
                </Link>
              </li>
            ))}
            <li
              className="hover:bg-green-700 rounded-md flex items-center p-2"
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
            >
              <FaSignOutAlt />
              <span className="ml-2">Logout</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-4 overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
