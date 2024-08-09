import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { setUser } from '../redux/userSlice'
import { hideLoading, showLoading } from '../redux/alertSlice'

const ProtectedRoute = (props) => {
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const getUser = async () => {
    try {
      dispatch(showLoading())
      const token = localStorage.getItem("token");
      const response = await axios.post('/api/user/get-user-info-by-id',{token} , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.success){
         dispatch(setUser(response.data.data))
      }else{
         navigate('/login')
      }
    } catch (error) {
      localStorage.clear()
      navigate('/login')
    }finally{
       dispatch(hideLoading())
    }
  }
  useEffect(() => {
    if (!user) {
      getUser()
    }
  }, [user])

  if (localStorage.getItem('token')) {
    return props.children
  } else {
    return <Navigate to='/login' />
  }
}

export default ProtectedRoute
