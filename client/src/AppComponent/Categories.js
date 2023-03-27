import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
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
        float: right;
        padding: 5px 1rem;
        margin-right: 1rem;
        font-size: 1.5rem;

        & button{
            padding: 0 9px;
            margin-top: 3px;
            border: 1px solid #ffc107;
            background-color: #ffc107;
            color: #fff;
            font-weight: bold;
        }
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

export const MyButton = styled.button`
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

export const PopupButton = styled.button`
    position: relative;
    top: 0;
    left: 95%;
    background-color: #ffc107;
    border: 1px solid #ffc107;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    padding: 0px 9px;
    padding-bottom: 2px;
    font-weight: 600;
`;

export const Tr = styled.tr`
    border-bottom : 1px solid rgb(255 193 7 / 22%);
    :hover{
        box-shadow: rgb(0 0 0 / 18%) 2px 5px 5px 1px;
        cursor: pointer;
    }
`;

export const SortButton = styled.button`
    background-color: transparent;
    border: none;
    & i{
        font-size: 14px;
        cursor: pointer;
    }
`;

function Categories() {
    const [category, setCategory] = useState([]);
    const [formdata, setFormdata] = useState({});
    const [updatedata, setUpdatedata] = useState({ id: "", categoryname: "" });
    const [flag, setFlag] = useState(true);
    const [addcategory, setAddcategory] = useState("");
    const [sorted, setSorted] = useState(false);

    useEffect(() => {
        FetchCategory();
    }, []);

    const HandleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (window.confirm("Are you sure? You want to update data")) {
                const url = "http://localhost:3001/update/category";
                const res = await axios.post(url, updatedata);
                if (res) {
                    document.getElementById("myForm").style.display = "none";
                    if (!res.data?.status) {
                        toast.error(res.data.message);
                        return;
                    }
                    toast.success(res.data.message);
                    FetchCategory();
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
            const list = category.find((ele) => {
                return ele._id === e.target.value;
            });
            const data = { id: list._id, categoryname: list.categoryname };
            setUpdatedata(data);
            setFormdata(list);
            document.getElementById("myForm").style.display = "block";
        } else {
            document.getElementById("myForm").style.display = "none";
        }
    }

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

    const AddCategory = (e) => {
        //e.preventDefault();
        setFlag(prev => !prev);
        if (flag) {
            document.getElementById("addcategory").style.display = "block";
        } else {
            document.getElementById("addcategory").style.display = "none";
        }
    }

    const handlechange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setUpdatedata({ ...updatedata, [name]: value })
    }

    const HandleAddCategory = async (e) => {
        try {
            e.preventDefault();
            const url = "http://localhost:3001/create/category";
            const res = await axios.post(url, { categoryname: addcategory });
            if (res) {
                document.getElementById("addcategory").style.display = "none";
                if (!res.data?.status) {
                    toast.error(res.data.message);
                    return;
                }
                toast.success(res.data.message);
                setAddcategory("");
                FetchCategory();
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    }

    const DeleteCategory = async (e) => {
        try {
            const url = "http://localhost:3001/delete/category";
            const res = await axios.post(url, { id: e.currentTarget.value });
            if (res) {
                if (!res.data?.status) {
                    toast.error(res.data.message);
                    return;
                }
                toast.success(res.data.message);
                FetchCategory();
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
                const url = "http://localhost:3001/update/category/status";
                const res = await axios.post(url, { id: id, status: val });
                if (res) {
                    if (!res.data?.status) {
                        toast.error(res.data.message);
                        return;
                    }
                    FetchCategory();
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }

    }

    const SortCategories = (e) => {

        category.sort(function (x, y) {
            return compareStrings(x.categoryname, y.categoryname);
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
                        <h3>Categories</h3><span><button onClick={AddCategory} value="add" data-toggle="tooltip" data-placement="bottom" title="Add Category" style={{ borderRadius: "2px", boxShadow: "rgb(0 0 0 / 21%) 4px 5px 18px" }}>+</button></span>
                    </Box>
                </div>
                <div className='col-12 mx-auto mt-5'>
                    <Box style={{ border: "none" }}>
                        {
                            category.length > 0 ? (<>
                                <Table>
                                    <tr style={{ borderBottom: "1px solid #ffc107" }}>
                                        <th>S.No.</th>
                                        <th>Category &nbsp;<SortButton onClick={SortCategories}><i className="fa fa-sort"></i></SortButton></th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                        <th></th>
                                    </tr>
                                    {
                                        category.map((ele, index) => {
                                            return (
                                                <Tr key={ele._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{ele.categoryname}</td>
                                                    <td>
                                                        <Switch checked={ele.status} id={ele._id} onChange={HandleStatusButton} checkedIcon={false} uncheckedIcon={false} offColor="#dee2e6" onColor='#ffc107' height={24} />
                                                    </td>
                                                    <td><MyButton value={ele._id} onClick={PopUp} style={{ boxShadow: "rgb(0 0 0 / 21%) 4px 5px 18px" }}>Edit</MyButton></td>
                                                    <td><button value={ele._id} onClick={DeleteCategory} style={{ background: "none", border: "none", color: "red" }}><i className="material-icons">&#xe872;</i></button></td>
                                                </Tr>
                                            )
                                        })
                                    }
                                </Table>
                            </>) : (<>No Result</>)
                        }
                    </Box>
                </div>
            </div>
        </div>
        <PopUpContainer id="myForm">
            <form className='p-4' onSubmit={HandleSubmit} style={{ backgroundColor: "#fff", width: "25%", position: "relative", left: "40%", top: "30%" }}>
                <PopupButton onClick={PopUp}>x</PopupButton>
                <h3 className='text-center pb-2'>Update Category</h3>
                <div className="form-group mb-3">
                    <label htmlFor="InputName">category Name</label>
                    <input type="text" name="categoryname" className="form-control" id="InputCategory" value={updatedata.categoryname} placeholder="Enter Category Name"
                        onChange={(e) => handlechange(e)} required />
                </div>
                <MyButton type="submit" className="pb-2 pt-1">Update</MyButton>
            </form>
        </PopUpContainer>

        <PopUpContainer id="addcategory">
            <form className='p-4' onSubmit={HandleAddCategory} style={{ backgroundColor: "#fff", width: "25%", position: "relative", left: "40%", top: "30%" }}>
                <PopupButton onClick={AddCategory}>x</PopupButton>
                <h3 className='text-center pb-2'>Add Category</h3>
                <div className="form-group mb-3">
                    <label htmlFor="InputAddCategory">Category Name<span style={{ color: "red" }}> *</span></label>
                    <input type="text" name="categoryname" className="form-control" id="InputAddCategory" value={addcategory} placeholder="Enter Category Name"
                        onChange={(e) => setAddcategory(e.target.value)} required />
                </div>
                <MyButton type="submit" className="pb-2 pt-1">Add</MyButton>
            </form>
        </PopUpContainer>
    </>)
}

export default Categories