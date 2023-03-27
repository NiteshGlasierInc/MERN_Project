import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import styled from 'styled-components';
import { MyButton, PopupButton } from './Categories';
import PopUpContainer from './PopUpContainer';
import Switch from 'react-switch';

const Box = styled.div`
    box-shadow: rgb(0 0 0 / 18%) 5px 5px 10px;
    width: 100%;
    font-family: Times New Roman;
    border-radius: 5px;
    border: 1px solid #ffc107;
    font-weight: 400;

    & h3{
        line-height: 3rem;
        padding-left: 1.5rem;
        display: inline-block;
    }
    & #editproductdetail{
        float: right;
        margin-right: 1.5rem;
        margin-top: 1rem;
    }
`;

const Table = styled.table`
    width: 100%;
      & th{
        text-align: left;
        padding: 1rem 2rem;
        font-weight: 600;
        font-size: 1.2rem;
      }
      & td{
        text-align: left;
        padding: 1rem 2rem;
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

function ProductDetails(props) {
    const [productInfo, setProductInfo] = useState([]);
    const [editproduct, setEditProduct] = useState({id: "", categoryid: "", subcategoryid: "", productname: "", price: "", productimage: null, path: null});

    useEffect(() => {
        GetProductDetails();
    }, []);

    const GetProductDetails = async () => {
        try {
            const url = "http://localhost:3001/get/product";
            const res = await axios.post(url, { id: props.value });
            if (res) {
                if (!res.data?.status) {
                    if (res.data.message === "id is not allowed to be empty") {
                        toast.error("Please Select a Product");
                        return;
                    }
                    toast.error(res.data.message);
                    return;
                }
                setProductInfo(res.data.data);
                const details = res.data.data[0];
                setEditProduct({...editproduct, id: details._id, categoryid: details.subcategoryid?.categoryid?._id, subcategoryid: details.subcategoryid?._id, productname: details.productName, price: details.price, path: details.productimage});
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }


    const HandleEditProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('id', editproduct.id);
            formData.append('categoryid', editproduct.categoryid);
            formData.append('subcategoryid', editproduct.subcategoryid);
            formData.append('productname', editproduct.productname);
            formData.append('price', editproduct.price);
            for (let i = 0; i < editproduct.path?.length; i++) {
                formData.append('path', editproduct.path[i]);
            }
            for (let i = 0; i < editproduct.productimage?.length; i++) {
                formData.append('productimage', editproduct.productimage[i]);
            }

            const url = "http://localhost:3001/update/product";
            const res = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            });
            if (res) {
                document.getElementById("editproduct").style.display = "none";
                if (!res.data?.status) {
                    toast.error(res.data.message);
                    return;
                }
                toast.success(res.data.message);
                GetProductDetails();
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }

    }

    const DisplayPopup = (e) => {
        e.preventDefault();
        const flag = e.target.value ? true : false;
        if (flag) {
            document.getElementById("editproduct").style.display = "block";
        } else {
            document.getElementById("editproduct").style.display = "none";
        }
    }

    const handleEditProductChange = (e) => {
        const target = e.target;
        const value = target.type === 'file' ? target.files : target.value;
        const name = target.name;
        setEditProduct({ ...editproduct, [name]: value });
    }

    return (
        <>
            <div className='container-fluid vh-100'>
                <div className='row mx-auto'>
                    <div className='col-12 mx-auto mt-5'>
                        <Box>
                            <h3>Product Details</h3><span id="editproductdetail"><MyButton value={productInfo[0]?._id} onClick={DisplayPopup}>Edit Details</MyButton></span>
                        </Box>
                    </div>
                    <div className='col-12 mx-auto mt-5'>
                        <Box>
                            {
                                productInfo.length > 0 ? (<>
                                    <Table>
                                        <tr>
                                            <th>Product Name</th>
                                            <td>{productInfo[0].productName}</td>
                                        </tr>
                                        <tr>
                                            <th>Product Price</th>
                                            <td>{productInfo[0].price}</td>
                                        </tr>
                                        <tr>
                                            <th>Category</th>
                                            <td>{productInfo[0].subcategoryid?.categoryid?.categoryname}</td>
                                        </tr>
                                        <tr>
                                            <th>SubCategory</th>
                                            <td>{productInfo[0].subcategoryid?.subcategoryname}</td>
                                        </tr>
                                        <tr>
                                            <th>Availability</th>
                                            <td>{productInfo[0].status ? "Available" : "Not Available"}</td>
                                        </tr>
                                    </Table>
                                    {
                                        productInfo[0].productimage?.length > 0 ? (<>
                                            <Table className='w-auto'>
                                                <tr className='w-auto'>
                                                    {
                                                        productInfo[0].productimage.map((ele, index) => {
                                                            return (<td key={index}><img src={"http://localhost:3001/static/" + ele} width="100%" height="auto" alt="" /></td>)
                                                        })
                                                    }
                                                </tr>
                                            </Table>
                                        </>) : ("")
                                    }
                                </>) : (<p className='text-center'>No Result</p>)
                            }
                        </Box>
                    </div>
                </div>
            </div>

            <PopUpContainer id="editproduct">
                <form className='p-4' onSubmit={HandleEditProduct} encType='multipart/form-data' style={{ backgroundColor: "#fff", width: "25%", position: "relative", left: "40%", top: "30%" }}>
                    <PopupButton value="" onClick={DisplayPopup}>x</PopupButton>
                    <h3 className='text-center pb-2'>Edit Product Details</h3>

                    <div className="form-group mb-2">
                        <label htmlFor="InputId">Product Code<span style={{ color: "red" }}> *</span></label>
                        <input type="password" name="id" className="form-control" id="InputId" value={editproduct.id} readOnly />
                    </div>

                    <div className="form-group">
                        <label htmlFor="InputName">Product Name<span style={{ color: "red" }}> *</span></label>
                        <input type="text" name="productname" className="form-control" id="InputName" value={editproduct.productname} placeholder="Enter Product Name" onChange={handleEditProductChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="InputCategoryId">Category<span style={{ color: "red" }}> *</span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Select name="categoryid" id="InputCategoryId" onChange={handleEditProductChange} style={{ width: "58%" }} required>
                            <option value="">Select Catgeory</option>
                            {
                                props.category.length > 0 ? (<>{
                                    props.category.map((ele) => {
                                            return (<option key={ele._id} value={ele._id}>{ele.categoryname}</option>)
                                    })
                                }</>) : (<option>No result</option>)
                            }
                        </Select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="InputSubCategoryId">Sub Category<span style={{ color: "red" }}> *</span></label>{" "}
                        <Select name="subcategoryid" id="InputSubCategoryId" onChange={handleEditProductChange} style={{ width: "58%" }} required>
                            <option value="">Select SubCategory</option>
                            {
                                props.subcategory.length > 0 ? (<>{
                                    props.subcategory.map((ele) => {
                                            return (<option key={ele._id} value={ele._id}>{ele.subcategoryname}</option>)
                                    })
                                }</>) : (<option>No result</option>)
                            }
                        </Select>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="InputPrice">Price<span style={{ color: "red" }}> *</span></label>
                        <input type="text" name="price" className="form-control" id="InputPrice" value={editproduct.price} placeholder="Enter Price"
                            onChange={handleEditProductChange} pattern='[0-9]{3}' required />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="InputImage">Product Images<span style={{ color: "red" }}> *</span></label>
                        <input type="file" name="productimage" multiple className="form-control" id="InputImage" onChange={handleEditProductChange} required />
                    </div>

                    <MyButton type="submit" className="pb-2 pt-1">Update</MyButton>
                </form>
            </PopUpContainer>
        </>
    )
}

export default ProductDetails;