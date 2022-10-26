import React, { useRef } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import * as yup from "yup";
import { useFormik } from "formik";
import "../styles/AddLeads.css";
import { ErrorMessage } from "./Utils"
import axios from 'axios';
import { API_URL } from "./API_URL"


function AddLeads() {
    let refToken = useRef()                             //useRef hook to save token in locally
    const localToken = localStorage.getItem("token");   //getting token from localStorage
    refToken.current = localToken;                      //assigning token in refToken

   
    const onSubmit=async(values)=>{
        await axios.post(`${API_URL}/leads`,{
                name: values.name,
                email: values.email,
                contact: values.contact,
                company: values.company,
                status: values.status
        },
        {
            headers:{
                accesstoken:localStorage.getItem("token")
            }   
    });
    resetForm(); 
    }
    //Form validation using formik package
    const { handleBlur, handleChange, handleSubmit, errors, touched, values, isValid, resetForm } = useFormik({
        initialValues: {
            name: "",
            email: "",
            contact: "",
            company: "",
            status: "",
        },
        validationSchema: yup.object({
            name: yup.string().required("Please enter name!"),
            email: yup.string().required("Please enter email!").email("Email must be a valid email!"),
            contact: yup.string().required("Please enter contact no!"),
            company: yup.string().required("Please enter company name!"),
            status: yup.string().required("Please mark status!")
        }),
        onSubmit
    })

    return (
        <div className="addleads-page">
            <h1>Add Lead</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" class="form-control" placeholder="Name" name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
                    </div>
                    {touched.name && errors.name ? (<ErrorMessage>{errors.name}</ErrorMessage>) : null}
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" class="form-control" placeholder="Enter email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                    </div>
                    {touched.email && errors.email ? (<ErrorMessage>{errors.email}</ErrorMessage>) : null}
                    <div className="form-group">
                        <label htmlFor="contact">Contact</label>
                        <input type="text" class="form-control" placeholder="Contact" name="contact" onChange={handleChange} onBlur={handleBlur} value={values.contact} />
                    </div>
                    {touched.contact && errors.contact ? (<ErrorMessage>{errors.contact}</ErrorMessage>) : null}
                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input type="text" class="form-control" placeholder="Company" name="company" onChange={handleChange} onBlur={handleBlur} value={values.company} />
                    </div>
                    {touched.company && errors.company ? (<ErrorMessage>{errors.company}</ErrorMessage>) : null}
                    <div>
                        <FormControl sx={{ mt: 1, mb: 1, minWidth: 90 }} >
                            <InputLabel id="status-input">Status</InputLabel>
                            <Select labelId="status-input" id="status" label="Status" autoWidth name="status" onChange={handleChange} onBlur={handleBlur} value={values.status} >
                                <MenuItem id="list1" value="New">New</MenuItem>
                                <MenuItem id="list2" value="Lost">Lost</MenuItem>
                                <MenuItem id="list3" value="Contacted">Contacted</MenuItem>
                                <MenuItem id="list4" value="Canceled">Canceled</MenuItem>
                                <MenuItem id="list5" value="Qualified">Qualified</MenuItem>
                                <MenuItem id="list6" value="Confirmed">Confirmed</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {touched.status && errors.status ? (<ErrorMessage>{errors.status}</ErrorMessage>) : null}
                    <div>
                        <button className="btn btn-primary addleads-submitbtn" type="submit" disabled={!isValid}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddLeads;
