import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Link } from "react-router-dom"
import * as yup from "yup";
import { useFormik } from "formik";
import { ErrorMessage, SuccessMessage } from "./Utils.js"
import { API_URL } from "./API_URL"
import image from "../images/image.jpg"
import axios from 'axios';

function ForgotPassword() {
    const [error, setError] = useState(null)        //hook to handle errors from the server

    //function to check email on database
    const onSubmit = async (values) => {
        const res=await axios.put(`${API_URL}/forgot-password`, {
                email: values.email
        })
        setError(res.data.message) 
        console.log(res.data.message);     
    }

    //Form validation using Formik package
    const { handleBlur, handleChange, handleSubmit, errors, touched, values, isValid } = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: yup.object({
            email: yup.string().required("Please enter email").email("Email must be a valid email")
        }),
        onSubmit
    })


    return (
        <div className="wrapper">
            <div className="logo"> <img src={image} alt="" /> </div>
            <div className="text-center mt-4 name"> FORGOT PASSWORD </div><br />
            <div>Enter your email address and we'll send you the instruction for resetting your password.</div>
                <form onSubmit={handleSubmit}>
                {error?(error==="User with this email doesn't exists."?(<ErrorMessage>{error}</ErrorMessage>):(<SuccessMessage>{error}</SuccessMessage>)):null}
                <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '34ch', maxWidth: '90%' },}} noValidate autoComplete="off">
                    <div >
                        <TextField type="text" id="standard-basic" name="email" label="Email" variant="standard" onChange={handleChange} onBlur={handleBlur} value={values.email}  />
                        {touched.email&&errors.email?(<ErrorMessage>{errors.email}</ErrorMessage>):null}
                    </div>
                </Box>
                <button className="btn mt-3" type="submit" disabled={error==="Email has been sent!"?true:!isValid}>Send Link</button><br /><br/>
            </form>
            <div className="text-center mt-2" > Don't have an account?<Link to="/sign-up">Sign up</Link></div>
        </div>
    )
}

export default ForgotPassword
