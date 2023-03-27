import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MyButton, PopupButton, Tr, SortButton } from './Categories';
import PopUpContainer from './PopUpContainer';
import Switch from 'react-switch';

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
            margin-top: 3px;
            border: 1px solid #ffc107;
            background-color: #ffc107;
            color: #fff;
            font-weight: bold;
            font-size: 1.5rem;
        }
    }

    & #addsubcategoryspan{
        float: right;
        margin-top: 5px;
    }
`;

const Table = styled.table`
    width: 100%;
      & th{
        text-align: left;
        padding: 1rem 5rem;
        font-weight: 600;
        font-size: 1.2rem;
      }
      & td{
        text-align: left;
        padding: 1rem 5rem;
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

const Select = styled.select`
    width: 20%;
    padding: 5px;
    margin: 0.8rem 0;
    border: 1px solid #ffc107;
    
    & option{
        border: 1px solid #ffc107;
    }
`;

function SubCategories() {
    const [category, setCategory] = useState([]);
    const [subcategory, setSubCategory] = useState([]);
    const [flag, setFlag] = useState(true);
    const [selectcategory, setSelectCategory] = useState("");
    const [updatedata, setUpdatedata] = useState({ id: "", subcategoryname: "", categoryid: "" });
    const [addsubcategory, setAddsubcategory] = useState({ subcategory: "", categoryid: "" });
    const [sorted, setSorted] = useState(false);

    useEffect(() => {
        FetchCategory();
    }, [])

    useEffect(() => {
        FetchSubCategory();
    }, [selectcategory])

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
            const url = "http://localhost:3001/display/subcategory";
            const res = await axios.post(url, { id: selectcategory });
            if (res) {
                if (!res.data?.status) {
                    setSubCategory([]);
                    return;
                }
                setSubCategory(res.data.data);
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (window.confirm("Are you sure? You want to update data")) {
                const url = "http://localhost:3001/update/subcategory";
                const res = await axios.post(url, updatedata);
                if (res) {
                    document.getElementById("myForm").style.display = "none";
                    if (!res.data?.status) {
                        toast.error(res.data.message);
                        return;
                    }
                    toast.success(res.data.message);
                    FetchSubCategory();
                    return;
                }
            }
            document.getElementById("myForm").style.display = "none";
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }

    }

    const PopUp = (e) => {
        e.preventDefault();
        setFlag(prev => !prev);
        if (flag) {
            const list = subcategory.find((ele) => {
                return ele._id === e.target.value;
            });
            const data = { id: list._id, subcategoryname: list.subcategoryname, categoryid: list.categoryid?._id };
            setUpdatedata(data);
            document.getElementById("myForm").style.display = "block";
        } else {
            document.getElementById("myForm").style.display = "none";
        }
    }

    const handlechange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setUpdatedata({ ...updatedata, [name]: value });
    }

    const HandleAddSubCategory = async (e) => {
        try {
            e.preventDefault();
            const url = "http://localhost:3001/create/subcategory";
            const res = await axios.post(url, addsubcategory);
            if (res) {
                document.getElementById("addsubcategory").style.display = "none";
                if (!res.data?.status) {
                    toast.error(res.data.message);
                    return;
                }
                toast.success(res.data.message);
                setAddsubcategory({ subcategory: "", categoryid: "" });
                FetchSubCategory();
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const AddSubCategory = (e) => {
        e.preventDefault();
        setFlag(prev => !prev);
        if (flag) {
            document.getElementById("addsubcategory").style.display = "block";
        } else {
            document.getElementById("addsubcategory").style.display = "none";
        }
    }

    const DeleteSubCategory = async (e) => {
        try {
            const url = "http://localhost:3001/delete/subcategory";
            const res = await axios.post(url, { id: e.currentTarget.value });
            if (res) {
                if (!res.data?.status) {
                    toast.error(res.data.message);
                    return;
                }
                toast.success(res.data.message);
                FetchSubCategory();
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
                const url = "http://localhost:3001/update/subcategory/status";
                const res = await axios.post(url, { id: id, status: val });
                if (res) {
                    if (!res.data?.status) {
                        toast.error(res.data.message);
                        return;
                    }
                    FetchSubCategory();
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const SortSubCategories = (e) => {

        subcategory.sort(function (x, y) {
            return compareStrings(x.subcategoryname, y.subcategoryname);
        });
        setSorted(prev => !prev);
    }

    function compareStrings(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

    return (<>
        <div className='container-fluid vh-100'>
            <div className='row mx-auto'>
                <div className='col-12 mx-auto mt-5'>
                    <Box>
                        <h3>SubCategories</h3><span id='addsubcategoryspan'><button onClick={AddSubCategory} data-toggle="tooltip" data-placement="bottom" title="Add SubCategory" style={{ borderRadius: "2px", boxShadow: "rgb(0 0 0 / 21%) 4px 5px 18px" }}>+</button></span>
                    </Box>
                </div>
                <div className='col-12 mx-auto mt-5'>
                    <Box style={{ border: "none" }}>
                        <span>Select Category</span><Select name="category" id="category" onChange={(e) => { setSelectCategory(e.target.value) }}>
                            <option value="">Select Category</option>
                            {
                                category.length > 0 ? (<>{
                                    category.map((ele) => {
                                        return (<option key={ele._id} value={ele._id}>{ele.categoryname}</option>)
                                    })
                                }</>) : (<option>No result</option>)
                            }
                        </Select>
                        {
                            category.length > 0 && subcategory.length > 0 ? (<>{
                                <Table>
                                    <tr style={{ borderBottom: "1px solid #ffc107" }}>
                                        <th>S.No.</th>
                                        <th>SubCategory &nbsp;<SortButton onClick={SortSubCategories}><i className="fa fa-sort"></i></SortButton></th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                        <th></th>
                                    </tr>
                                    {
                                        subcategory.map((ele, index) => {
                                            return (
                                                <Tr key={ele._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{ele.subcategoryname}</td>
                                                    <td>{ele.categoryid?.categoryname}</td>
                                                    <td>
                                                        <Switch checked={ele.status} id={ele._id} onChange={HandleStatusButton} checkedIcon={false} uncheckedIcon={false} offColor="#dee2e6" onColor='#ffc107' height={24} />
                                                    </td>
                                                    <td><Button value={ele._id} onClick={PopUp} style={{ boxShadow: "rgb(0 0 0 / 21%) 4px 5px 18px" }}>Edit</Button></td>
                                                    <td><button value={ele._id} onClick={DeleteSubCategory} style={{ background: "none", border: "none", color: "red" }}><i className="material-icons">&#xe872;</i></button></td>
                                                </Tr>
                                            )
                                        })
                                    }
                                </Table>
                            }</>) : (<h5 className='text-center'>No Result</h5>)
                        }
                    </Box>
                </div>
            </div>
        </div>
        <PopUpContainer id="myForm">
            <form className='p-4' onSubmit={HandleSubmit} style={{ backgroundColor: "#fff", width: "25%", position: "relative", left: "40%", top: "30%" }}>
                <PopupButton onClick={PopUp}>x</PopupButton>
                <h3 className='text-center pb-2'>Update SubCategory</h3>

                <div className="form-group mb-3">
                    <label htmlFor="InputCategoryId">Category<span style={{ color: "red" }}> *</span></label>{" "}
                    <Select name="categoryid" id="category" onChange={(e) => handlechange(e)} style={{ width: "50%" }}>
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

                <div className="form-group mb-3">
                    <label htmlFor="InputName">Subcategory Name</label>
                    <input type="text" name="subcategoryname" className="form-control" id="InputName" value={updatedata.subcategoryname} placeholder="Enter SubCategory Name"
                        onChange={(e) => handlechange(e)} required />
                </div>

                <MyButton type="submit" className="pb-2 pt-1">Update</MyButton>
            </form>
        </PopUpContainer>

        <PopUpContainer id="addsubcategory">
            <form className='p-4' onSubmit={HandleAddSubCategory} style={{ backgroundColor: "#fff", width: "25%", position: "relative", left: "40%", top: "30%" }}>
                <PopupButton onClick={AddSubCategory}>x</PopupButton>
                <h3 className='text-center pb-2'>Add SubCategory</h3>
                <div className="form-group mb-3">
                    <label htmlFor="InputCategoryId">Category<span style={{ color: "red" }}> *</span></label>{" "}
                    <Select name="categoryid" id="InputCategoryId" onChange={(e) => { setAddsubcategory({ ...addsubcategory, [e.target.name]: e.target.value }) }} style={{ width: "50%" }} required>
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
                <div className="form-group mb-3">
                    <label htmlFor="InputName">SubCategory Name<span style={{ color: "red" }}> *</span></label>
                    <input type="text" name="subcategory" className="form-control" id="InputAddSubCategory" value={addsubcategory.subcategory} placeholder="Enter SubCategory Name"
                        onChange={(e) => setAddsubcategory({ ...addsubcategory, [e.target.name]: e.target.value })} required />
                </div>
                <MyButton type="submit" className="pb-2 pt-1">Add</MyButton>
            </form>
        </PopUpContainer>
    </>)
}

export default SubCategories