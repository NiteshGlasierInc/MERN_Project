import React, { useState } from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Form = styled.form`
    box-shadow: 5px 10px 18px #888888;
    border-radius: 5px;
`;

function UserRegistration() {
    const [userdetails, setUserDetails] = useState({ name: "", email: "", phone: "", password: "" });
    const HandleSubmit = async (e) => {
        try {
            e.preventDefault();
            const url = "http://localhost:3001/register";
            const res = await axios.post(url, userdetails);
            if (res) {
                if (!res.data.status) {
                    toast.error(res.data.message);
                    return;
                }
                toast.success(res.data.message);
                const details = { name: "", email: "", phone: "", password: "" };
                setUserDetails(details);
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
                        <h1>Register Now</h1>
                    </div>
                    <Form className='p-4' onSubmit={HandleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="InputName">Full Name</label>
                            <input type="text" className="form-control" id="InputName" placeholder="Enter Full Name" value={userdetails.name} onChange={(e) => { setUserDetails((prevState) => ({ ...prevState, name: e.target.value })) }} required />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="InputEmail">Email address</label>
                            <input type="email" className="form-control" id="InputEmail" placeholder="Enter Email" value={userdetails.email} onChange={(e) => { setUserDetails((prevState) => ({ ...prevState, email: e.target.value })) }} required />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="InputPhone">Phone</label>
                            <input type="text" className="form-control" id="InputPhone" placeholder="Enter Phone" value={userdetails.phone} onChange={(e) => { setUserDetails((prevState) => ({ ...prevState, phone: e.target.value })) }} pattern='[0-9]{10}' maxLength='10' minLength='10' required />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="InputPassword">Password</label>
                            <input type="password" className="form-control" id="InputPassword" placeholder="Enter Password" value={userdetails.password} onChange={(e) => { setUserDetails((prevState) => ({ ...prevState, password: e.target.value })) }} pattern='[A-Za-z0-9]{4}' maxLength='4' minLength='4' required />
                        </div>
                        <button type="submit" className="btn btn-primary mb-4">Register</button>
                        <Link to="/login"><p style={{ textDecoration: "underline" }}>Already have an account? Login here</p></Link>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default UserRegistration;