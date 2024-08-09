import React, { useState } from 'react';
import Popup from '../components/Popup';
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux';
import UserExpenses from '../components/UserExpenses';

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const { user } = useSelector((state) => state.user);
//   console.log(user)
  const handleAddExpense = (expense) => {
    console.log('New Expense:', expense);
    window.location.reload();
  };

  return (
     <Layout>
        <div>
      <center><button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full focus:outline-none focus:shadow-outline' onClick={() => setIsPopupOpen(true)}>Add New Expense</button></center>
      <br />
      <Popup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        onSubmit={handleAddExpense} 
      />
      
     <UserExpenses/>

    </div>
     </Layout>
  );
};

export default Home;
