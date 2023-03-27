import './App.css';
import UserRegistration from './AppComponent/UserRegistration';
import UserLogin from './AppComponent/UserLogin';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './AppComponent/Dashboard';
import ErrorPage from './AppComponent/ErrorPage';
import Navbar from './AppComponent/Navbar';
import Logout from './AppComponent/Logout';
import Products from './AppComponent/Products';
import Categories from './AppComponent/Categories';
import SubCategories from './AppComponent/SubCategories';
import { useEffect, useState } from 'react';

function App() {

  const [change, setChange] = useState(false);

  useEffect(() => {
  }, [change]);

  return (
    <>
      {
        localStorage.getItem("dataKey") && localStorage.getItem("dataKey") !== null ? (
          <>
            <Navbar />
            <Routes>
              <Route path='/' element={<Dashboard />}></Route>
              <Route path='/categories' element={<Categories />}></Route>
              <Route path='/subcategories' element={<SubCategories />}></Route>
              <Route path='/products' element={<Products />}></Route>
              <Route path='/logout' element={<Logout setChange={setChange} />}></Route>
              <Route path='*' element={<ErrorPage />}></Route>
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path='/' element={<UserRegistration />}></Route>
            <Route path='/login' element={<UserLogin setChange={setChange}/>}></Route>
            <Route path='*' element={<ErrorPage />}></Route>
          </Routes>
        )
      }
      <ToastContainer position="top-right" theme="colored" />
    </>
  );
}

export default App;
