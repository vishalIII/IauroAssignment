import React, { useEffect, useState } from 'react';
import { showLoading, hideLoading } from '../../redux/alertSlice';
import axios from '../../utils/axios'; 
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import { Table } from 'antd'; // Ensure you have the correct import for the Table component

const UserList = () => {
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();

    const getUsersData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/admin/get-all-users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setUsers(response.data.data);
            } else {
                console.error('Failed to fetch users:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getUsersData();
    }, []);
    
    const columns = [
        {
            title: "Name",
            dataIndex: 'name',
            key: 'name',
            className: 'text-gray-800'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            className: 'text-gray-800'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: 'text-gray-800'
        }
    ];

    return (
        <Layout>
            <div className='container mx-auto px-4'>
                <h1 className='text-3xl font-bold mb-6 text-center text-green-600'>Users List</h1>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <Table
                        columns={columns}
                        dataSource={users.map(user => ({ ...user, key: user._id }))}
                        pagination={false}
                        className="rounded-lg overflow-hidden"
                    />
                </div>
            </div>
        </Layout>
    );
};

export default UserList;
