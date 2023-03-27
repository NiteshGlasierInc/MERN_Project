import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductDetails from './ProductDetails';
import PopUpContainer from './PopUpContainer';
import { MyButton, PopupButton, Tr, SortButton } from './Categories';
import Switch from 'react-switch';
import fileDownload from 'js-file-download';


const Table = styled.table`
    width: 100%;
      & th{
        text-align: left;
        padding: 1rem 3rem;
        font-weight: 600;
        font-size: 1.2rem;
      }
      & td{
        text-align: left;
        padding: 1rem 3rem;
    }
`;

const Box = styled.div`
    box-shadow: rgb(0 0 0 / 18%) 5px 10px 10px;
    width: 100%;
    font-family: Times New Roman;
    border-radius: 5px;
    border: 1px solid #ffc107;
    font-weight: 400;
    overflow: auto;
    background-color: #fff;

    & h3{
        line-height: 3rem;
        padding-left: 1.5rem;
        display: inline-block;
    }

    & span{
        font-size: 1.2rem;
        font-weight: bold;
        padding: 0 1.5rem;
        & button{
            padding: 0 9px;
            margin-top: 8px;
            border: 1px solid #ffc107;
            background-color: #ffc107;
            color: #fff;
            font-weight: bold;
            font-size: 1.5rem;
        }
    }

    & #addproductspan{
        float: right;
    }
`;

const Select = styled.select`
    width: 40%;
    padding: 5px;
    margin: 0.8rem 0;
    border: 1px solid #ffc107;
    
    & option{
        border: 1px solid #ffc107;
    }
`;

const Button = styled.button`
    background-color: #ffc107;
    border-radius: 2px;
    color: #fff;
    font-weight: bolder;
    border: 1px solid #ffc107;
    padding: 0px 15px;

    &:hover{
        background-color: #fff;
        color: black;
    }
`;

const SearchInput = styled.input`
    border: 1px solid #ffc107;
    padding-left: 10px;

    :focus{
        border: none;
    }
`;


function Products() {
    const [category, setCategory] = useState([]);
    const [subcategory, setSubCategory] = useState([]);
    const [products, setProducts] = useState([]);
    const [productspage, setProductsPage] = useState([]);
    const [addproduct, setAddProduct] = useState({ subcategoryid: "", product: "", categoryid: "", price: 0, productimage: null });
    const [selectcategory, setSelectCategory] = useState("");
    const [selectsubcategory, setSelectSubCategory] = useState("");
    const [productDetails, setproductDetails] = useState("");
    const [flag, setFlag] = useState(true);
    const [addcsv, setAddCsv] = useState(true);
    const [csv, setCsv] = useState(null);
    const [currpage, setCurrPage] = useState(1);
    const [itemsperpage, setItemsPerPage] = useState(10);
    const [sorted, setSorted] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        FetchCategory();
    }, [])

    useEffect(() => {
        FetchSubCategory();
    }, [selectcategory]);

    useEffect(() => {
        FetchProducts();
    }, [selectsubcategory, currpage, itemsperpage]);

    useEffect(() => {
        FetchProductsPage();
    }, [selectsubcategory, currpage, itemsperpage, search]);

    const FetchCategory = async () => {
        try {
            const url = "http://localhost:3001/display/category";
            const res = await axios.post(url);
            if (res) {
                if (!res.data?.status) {
                    setCategory([]);
                    return;
                }
                setCategory(res.data.data);
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const FetchSubCategory = async () => {
        try {
            setCurrPage(1);
            setSearch("");
            setProductsPage([]);
            const url = "http://localhost:3001/display/subcategory";
            const res = await axios.post(url, { id: selectcategory });
            if (res) {
                if (!res.data?.status) {
                    setSubCategory([]);
                    setProducts([]);
                    return;
                }
                setSubCategory(res.data.data);
                setProducts([]);
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const FetchProducts = async () => {
        try {
            setSearch("");
            const url = "http://localhost:3001/display/products";
            const res = await axios.post(url, { id: selectsubcategory });
            if (res) {
                if (!res.data?.status) {
                    setProducts([]);
                    return;
                }
                setProducts(res.data.data);
                FetchProductsPage();
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const FetchProductsPage = async () => {
        try {
            const url = "http://localhost:3001/display/products/page";
            const res = await axios.post(url, { id: selectsubcategory, currpage: currpage, itemsperpage: itemsperpage, search: search });
            if (res) {
                if (!res.data?.status) {
                    setProductsPage([]);
                    //setSearch("");
                    return;
                }
                setProductsPage(res.data.data);
                //setSearch("");
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const FetchProductsDetails = (e) => {
        e.preventDefault();
        setproductDetails(e.target.value);
        return;
    }

    const AddProduct = (e) => {
        e.preventDefault();
        setFlag(prev => !prev);
        if (flag) {
            if (e.target.name === "import-btn") {
                setAddCsv(false);
            } else {
                setAddCsv(true);
            }
            document.getElementById("addproduct").style.display = "block";
        } else {
            setAddProduct({ subcategoryid: "", product: "", categoryid: "", price: "", productimage: null });
            document.getElementById("addproduct").style.display = "none";
        }
    }

    const HandleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (addcsv) {
                formData.append("subcategoryid", addproduct.subcategoryid);
                formData.append("product", addproduct.product);
                formData.append("categoryid", addproduct.categoryid);
                formData.append("price", addproduct.price);
                for (let i = 0; i < addproduct.productimage?.length; i++) {
                    formData.append('productimage', addproduct.productimage[i]);
                }

                const url = "http://localhost:3001/create/product";
                const res = await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                });
                if (res) {
                    document.getElementById("addproduct").style.display = "none";
                    if (!res.data?.status) {
                        toast.error(res.data.message);
                        return;
                    }
                    toast.success(res.data.message);
                    FetchProducts();
                    return;
                }
            } else {
                console.log('==========>', csv);
                formData.append('csvfile', csv[0]);
                const url = "http://localhost:3001/csvtojson";
                const res = await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                });
                if (res) {
                    document.getElementById("addproduct").style.display = "none";
                    if (!res.data?.status) {
                        toast.error(res.data.message);
                        return;
                    }
                    toast.success(res.data.message);
                    FetchProducts();
                    FetchProductsPage();
                    return;
                }
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const handleaddproductchange = (e) => {
        const target = e.target;
        const value = target.type === 'file' ? target.files : target.value;
        const name = target.name;
        setAddProduct({ ...addproduct, [name]: value });
        if (name === 'categoryid') {
            setSelectCategory(value);
        }
    }

    const DeleteProduct = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:3001/delete/product";
            const res = await axios.post(url, { id: e.currentTarget.value });
            if (res) {
                if (!res.data?.status) {
                    toast.error(res.data.message);
                    return;
                }
                toast.success(res.data.message);
                FetchProducts();
                FetchProductsPage();
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const HandleStatusButton = async (val, e, id) => {
        try {
            if (window.confirm("Are you sure? You want to change status")) {
                const url = "http://localhost:3001/update/product/status";
                const res = await axios.post(url, { id: id, status: val });
                if (res) {
                    if (!res.data?.status) {
                        toast.error(res.data.message);
                        return;
                    }
                    FetchProducts();
                    FetchProductsPage();
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const CsvFileOnChange = (e) => {
        setCsv(e.target.files);
    }

    const FileExport = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:3001/csv/product/details";
            const res = await axios.post(url);
            if (res) {
                fileDownload(res.data, 'newdata.csv');
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const HandleItemsPerPage = (e) => {
        setItemsPerPage(e.target.value);
    }

    const HandleCurrPage = (e) => {
        const len = Math.ceil(products.length / itemsperpage);

        if (currpage >= 1 && currpage <= len) {
            let curr_page = e.target.name === 'prev' ? currpage - 1 : currpage + 1;
            curr_page === 0 || curr_page === len + 1 ? (curr_page === len + 1 ? setCurrPage(len) : setCurrPage(1)) : setCurrPage(curr_page);
        }
    }

    const SortProducts = (e) => {
        const value = e.currentTarget.value;
        productspage.sort(function (x, y) {
            return value !== 'price' ? compareStrings(x.productName, y.productName) : x.price - y.price
        });
        setSorted(prev => !prev);
    }

    function compareStrings(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }
    

    return (
        <>
            {
                productDetails.length > 0 ? (<>
                    <ProductDetails value={productDetails} subcategory={subcategory} category={category} />
                </>) : (<>
                    <div className='container-fluid vh-100'>
                        <div className='row mx-auto'>
                            <div className='col-12 mx-auto mt-5'>
                                <Box>
                                    <h3>Products</h3><span id='addproductspan'>
                                        <button className='mb-2' name="import-btn" onClick={(e) => { AddProduct(e); }} style={{ fontSize: "18px", textDecoration: "underline", color: "rgb(233 175 0)", marginRight: "5px", backgroundColor: "#fff", border: "none" }}>Import</button>

                                        <button onClick={FileExport} style={{ fontSize: "18px", textDecoration: "underline", color: "rgb(233 175 0)", marginRight: "5px", backgroundColor: "#fff", border: "none" }}>Export</button>

                                        <button onClick={AddProduct} value="add" data-toggle="tooltip" data-placement="bottom" title="Add Product" style={{ borderRadius: "2px", boxShadow: "rgb(0 0 0 / 21%) 4px 5px 18px" }}>+</button></span>
                                </Box>
                            </div>
                            <div className='col-12 mx-auto mt-5 mb-5'>
                                <Box style={{ border: "none" }}>
                                    <div className='row mx-auto'>

                                        <div className='col-6 mx-auto'>
                                            <span>Select Category</span>
                                            <Select name="category" id="category" onChange={(e) => { setSelectCategory(e.target.value) }}>
                                                <option value="">Select Category</option>
                                                {
                                                    category.length > 0 ? (<>{
                                                        category.map((ele) => {
                                                            return (<option key={ele._id} value={ele._id}>{ele.categoryname}</option>)
                                                        })
                                                    }</>) : (<option>No result</option>)
                                                }
                                            </Select>
                                        </div>
                                        <div className='col-6 mx-auto'>
                                            <span>Select SubCategory</span>
                                            <Select name="subcategory" id="subcategory" onChange={(e) => { setSelectSubCategory(e.target.value) }}>
                                                <option value="">Select Subcategory</option>
                                                {
                                                    subcategory.length > 0 ? (<>{
                                                        subcategory.map((ele) => {
                                                            return (<option key={ele._id} value={ele._id}>{ele.subcategoryname}</option>)
                                                        })
                                                    }</>) : (<option>No result</option>)
                                                }
                                            </Select>
                                        </div>
                                        {
                                            products.length > 0 ? (
                                                <div className='col-12 mx-auto mt-3'>
                                                    <Select className='itemsperpage' style={{ width: "8%" }} onChange={HandleItemsPerPage}>
                                                        <option value="10">Show 10</option>
                                                        <option value="20">Show 20</option>
                                                        <option value="30">Show 30</option>
                                                    </Select>
                                                    <span><SearchInput type='search' value={search} onInput={e => setSearch(e.target.value)} placeholder={`${products?.length} records..`} aria-label="Search" aria-describedby="search-addon" /></span>
                                                </div>
                                            ) : ("")
                                        }
                                        <div className='col-12 mx-auto mt-3'>
                                            {
                                                productspage.length > 0 ? (<>
                                                    <Table>
                                                        <tr style={{ borderBottom: "1px solid #ffc107" }}>
                                                            <th>S.No.</th>
                                                            <th>Product Name &nbsp;<SortButton value="product" onClick={SortProducts}><i className="fa fa-sort"></i></SortButton></th>
                                                            <th>Category</th>
                                                            <th>SubCategory</th>
                                                            <th>Price &nbsp;<SortButton value="price" onClick={SortProducts}><i className="fa fa-sort"></i></SortButton></th>
                                                            <th>Status</th>
                                                            <th>Details</th>
                                                        </tr>
                                                        {
                                                            productspage.map((ele, index) => {
                                                                return (<Tr key={ele._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{ele.productName}</td>
                                                                    <td>{ele.subcategoryid?.categoryid?.categoryname ?? ""}</td>
                                                                    <td>{ele.subcategoryid?.subcategoryname ?? ""}</td>
                                                                    <td>{ele.price}</td>
                                                                    <td>
                                                                        <Switch checked={ele.status} id={ele._id} onChange={HandleStatusButton} checkedIcon={false} uncheckedIcon={false} offColor="#dee2e6" onColor='#ffc107' height={24} />
                                                                    </td>
                                                                    <td><Button value={ele._id} onClick={FetchProductsDetails} style={{ boxShadow: "rgb(0 0 0 / 21%) 4px 5px 18px" }}>See Details</Button></td>
                                                                    <td><button value={ele._id} onClick={DeleteProduct} style={{ background: "none", border: "none", color: "red" }}><i className="material-icons">&#xe872;</i></button></td>
                                                                </Tr>)
                                                            })
                                                        }
                                                    </Table>
                                                    <div className='mt-5 mb-3' style={{ textAlign: "right" }}>
                                                        <span>Total page: {Math.ceil(products.length / itemsperpage)}</span>
                                                        <Button type='button' name="prev" onClick={HandleCurrPage}>Prev</Button>
                                                        <span>{currpage}</span>
                                                        <Button type='button' name='next' onClick={HandleCurrPage}>Next</Button>
                                                    </div>
                                                </>) : (<p className='text-center'>No Result Found</p>)

                                            }
                                        </div>
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                    <PopUpContainer id="addproduct">
                        <form className='p-4' onSubmit={HandleAddProduct} encType='multipart/form-data' style={{ backgroundColor: "#fff", width: "25%", position: "relative", left: "40%", top: "30%" }}>
                            <PopupButton onClick={AddProduct}>x</PopupButton>
                            <h3 className='text-center pb-2'>Add Product</h3>
                            {
                                addcsv ? (<>
                                    <div className="form-group">
                                        <label htmlFor="InputCategoryId">Category<span style={{ color: "red" }}> *</span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                                        <Select name="categoryid" id="InputCategoryId" onChange={handleaddproductchange} style={{ width: "58%" }} required>
                                            <option value="">Select Category</option>
                                            {
                                                category.length > 0 ? (<>{
                                                    category.map((ele) => {
                                                        return (<option key={ele._id} value={ele._id}>{ele.categoryname}</option>)
                                                    })
                                                }</>) : (<option>No result</option>)
                                            }
                                        </Select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="InputSubCategoryId">SubCategory<span style={{ color: "red" }}> *</span></label>{" "}
                                        <Select name="subcategoryid" id="InputSubCategoryId" onChange={handleaddproductchange} style={{ width: "58%" }} required>
                                            <option value="">Select SubCategory</option>
                                            {
                                                subcategory.length > 0 ? (<>{
                                                    subcategory.map((ele) => {
                                                        return (<option key={ele._id} value={ele._id}>{ele.subcategoryname}</option>)
                                                    })
                                                }</>) : (<option>No result</option>)
                                            }
                                        </Select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="InputName">Product Name<span style={{ color: "red" }}> *</span></label>
                                        <input type="text" name="product" className="form-control" id="InputName" value={addproduct.product} placeholder="Enter Product Name"
                                            onChange={handleaddproductchange} required />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="InputPrice">Price<span style={{ color: "red" }}> *</span></label>
                                        <input type="text" name="price" className="form-control" id="InputPrice" value={addproduct.price} placeholder="Enter Price"
                                            onChange={handleaddproductchange} pattern='[0-9]{3}' required />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="InputImage">Product Images<span style={{ color: "red" }}> *</span></label>
                                        <input type="file" name="productimage" multiple className="form-control" id="InputImage" onChange={handleaddproductchange} required />
                                    </div>
                                </>) : (<>
                                    {/* <button className='mb-2' onClick={(e) => setAddCsv(prev => !prev)} style={{ backgroundColor: "#fff", border: "none", color: "rgb(0 43 255)", textDecoration: "underline" }}>Add Manually</button> */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="InputCsv">Csv File<span style={{ color: "red" }}> *</span></label>
                                        <input type="file" name="csvfile" className="form-control" id="InputCsv" onChange={CsvFileOnChange} required />
                                    </div>
                                </>)
                            }

                            <MyButton type="submit" className="pb-2 pt-1">Add</MyButton>
                        </form>
                    </PopUpContainer>

                </>)
            }
        </>
    )
}

export default Products;