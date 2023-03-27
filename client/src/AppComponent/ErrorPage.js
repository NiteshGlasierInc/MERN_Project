import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <>
    <div className='container-fluid vh-100'>
        <div className='row h-100'>
            <div className='col-3 m-auto' style={{width: "23rem"}}>
                <div className='text-center pb-2'>
                    <h1 style={{fontSize: "11rem",color:"#0000001f"}}>404</h1>
                    <h3>Page Not Found</h3>
                    <p>The Page you are looking dosen't exist</p>
                    <p>Go to <Link to="/" style={{textDecoration: "underline"}}>Home Page</Link></p>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default ErrorPage;