import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ setChange }) {
 
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      localStorage.removeItem("dataKey")
      setChange(prev => !prev);
      navigate('/login');
    } catch (err) {
      console.log(err);
      navigate('/login');
    }
  }
  useEffect(() => {
    logout();
  }, []);

  return (
    <div>Logout</div>
  )
}

export default Logout