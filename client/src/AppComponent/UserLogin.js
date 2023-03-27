import React, { useState } from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Form = styled.form`
    box-shadow: 5px 10px 18px #888888;
    border-radius: 5px;
`;

function UserLogin({setChange}) {
    const [userdetails, setUserDetails] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const HandleSubmit = async (e) => {
        try {
            e.preventDefault();
            const url = "http://localhost:3001/login";
            const res = await axios.post(url, userdetails, { withCredentials: true });
            if (res) {
                if (!res.data.status) {
                    toast.error(res.data.message);
                    return;
                }
                localStorage.setItem('dataKey', JSON.stringify(res.data.status));
                toast.success(res.data.message);
                const details = { email: "", password: "" };
                setUserDetails(details);
                setChange(prev => !prev);
                navigate('/');
                return;
            }
            throw new Error(res);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    return (
        <div className='container-fluid vh-100'>
            <div className='row h-100'>
                <div className='col-3 m-auto' style={{ width: "23rem" }}>
                    <div className='text-center pb-2'>
                        <h1>Login Now</h1>
                    </div>
                    <Form className='px-4 py-5' onSubmit={HandleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="InputEmail">Email address</label>
                            <input type="email" className="form-control" id="InputEmail" placeholder="Enter Email" value={userdetails.email} onChange={(e) => { setUserDetails((prevState) => ({ ...prevState, email: e.target.value })) }} required />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="InputPassword">Password</label>
                            <input type="password" className="form-control" id="InputPassword" placeholder="Enter Password" value={userdetails.password} onChange={(e) => { setUserDetails((prevState) => ({ ...prevState, password: e.target.value })) }} pattern='[A-Za-z0-9]{4}' maxLength='4' minLength='4' required />
                        </div>
                        <button type="submit" className="btn btn-primary mb-4">Login</button>
                        <Link to="/"><p style={{ textDecoration: "underline" }}>Don't have an account? Register here</p></Link>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default UserLogin;