import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Topbar = styled.nav`
  box-shadow: 0px 1px 10px #00000075;
  font-family: Times New Roman;
  background-color: #fff !important;

  & ul>li{
    font-size: 1.2rem;

    :hover{
      text-decoration: underline;
    }
  }
`;

function Navbar() {
    const [search, setSearch] = useState("");

  return (
   <>
        <Topbar className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to='/'>
            Dashboard 
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
              data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
              aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              {/* <form className="me-3">
                <div className="form-white input-group" style={{width: "250px"}}>
                  <input type="search" value={search} onChange={(e)=>{setSearch(e.target.value)}} className="form-control rounded" placeholder=" Search here.."
                    aria-label="Search" aria-describedby="search-addon"/>
                </div>
              </form> */}
              <ul className="navbar-nav d-flex flex-row ms-auto me-5">
                <li className="nav-item pe-4 me-lg-0 dropdown" data-toggle="tooltip" data-placement="bottom" title="Categories">
                  <Link className="nav-link " to="/categories" id="navbarDropdown"
                    aria-expanded="false">
                   Categories
                  </Link>
                </li>

                <li className="nav-item pe-4 me-lg-0 dropdown" data-toggle="tooltip" data-placement="bottom" title="SubCategories">
                  <Link className="nav-link " to="/subcategories" id="navbarDropdown"
                    aria-expanded="false">
                   SubCategories
                  </Link>
                </li>

                <li className="nav-item pe-4 me-lg-0 dropdown" data-toggle="tooltip" data-placement="bottom" title="Products">
                  <Link className="nav-link " to="/products" id="navbarDropdown"
                    aria-expanded="false">
                   Products
                  </Link>
                </li>

                <li className="nav-item pe-4 me-lg-0 dropdown" data-toggle="tooltip" data-placement="bottom" title="Logout">
                  <Link className="nav-link " to="/logout" id="navbarDropdown"
                    aria-expanded="false">
                   Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Topbar>
   </>
  )
}

export default Navbar