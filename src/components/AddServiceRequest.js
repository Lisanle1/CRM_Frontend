import React, { useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import * as yup from "yup";
import { useFormik } from "formik";
import "../styles/AddLeads.css";
import { API_URL } from "./API_URL"
import { ErrorMessage } from "./Utils"
import axios from 'axios';

export default function AddServiceRequest({ getDataFromDb }) {
    let refToken = useRef()                             //useRef hook to save token in locally
    const localToken = localStorage.getItem("token");   //getting token from localStorage
    refToken.current = localToken;                      //assigning token in refToken

    //function to create service request
    // const onSubmit = async (values) => {
    //     await fetch(`${API_URL}/service-requests`, {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //             token: refToken.current                 //adding token in header to process request
    //         },
    //         body: JSON.stringify({
    //             name: values.name,
    //             email: values.email,
    //             request: values.request,
    //             status: values.status
    //         })
    //     }).then(data => data.json())
    //     resetForm();                                    // to reset form values after request is done
    //     getDataFromDb()
    // }
     const onSubmit=async(values)=>{
        await axios.post(`${API_URL}/service-requests`,{
                    name: values.name,
                    email: values.email,
                   request: values.request,
                   status: values.status
        },
        {
            headers:{
                accesstoken:localStorage.getItem("token")
            }   
    });
    resetForm(); 
    }

    //Form validation using Formik package
    const { handleBlur, handleChange, handleSubmit, errors, touched, values, isValid, resetForm } = useFormik({
        initialValues: {
            name: "",
            email: "",
            request: "",
            status: "",
        },
        validationSchema: yup.object({
            name: yup.string().required("Please enter name!"),
            email: yup.string().required("Please enter email!").email("Email must be a valid email!"),
            request: yup.string().required("Please enter request!"),
            status: yup.string().required("Please mark status!")
        }),
        onSubmit
    })

    return <>
        <div className="addleads-page">
            <h1>Add Request</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" class="form-control" placeholder="Name" name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
                    </div>
                    {touched.name && errors.name ? (<ErrorMessage>{errors.name}</ErrorMessage>) : null}

                    <div class="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" class="form-control" placeholder="Enter email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                    </div>
                    {touched.email && errors.email ? (<ErrorMessage>{errors.email}</ErrorMessage>) : null}

                    <div className="form-group">
                        <label htmlFor="request">Request</label>
                        <textarea type="text" class="form-control" placeholder="Enter request" name="request" onChange={handleChange} onBlur={handleBlur} value={values.request} />
                    </div>
                    {touched.request && errors.request ? (<ErrorMessage>{errors.request}</ErrorMessage>) : null}

                    <div>
                        <FormControl sx={{ mt: 1, mb: 1, minWidth: 90 }} >
                            <InputLabel id="status-input">Status</InputLabel>
                            <Select labelId="status-input" id="status" label="Status" autoWidth name="status" onChange={handleChange} onBlur={handleBlur} value={values.status} >
                                <MenuItem id="list11" value="Created">Created</MenuItem>
                                <MenuItem id="list12" value="Open">Open</MenuItem>
                                <MenuItem id="list13" value="In process">In process</MenuItem>
                                <MenuItem id="list14" value="Released">Released</MenuItem>
                                <MenuItem id="list15" value="Canceled">Canceled</MenuItem>
                                <MenuItem id="list16" value="Completed">Completed</MenuItem>
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

    </>;
}
