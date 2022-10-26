import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Link, useParams } from 'react-router-dom';
import * as yup from "yup";
import { useFormik } from "formik";
import { ErrorMessage, SuccessMessage } from "./Utils.js"
import { API_URL } from "./API_URL"
import image from "../images/image.jpg"
import axios from 'axios';

function ResetPassword() {
    const [error, setError] = useState(null)        //hook to handle error messages from the server
    const [show, setShow] = useState(false)         //hook to display sign in button after success message from database
    const [disabled, setDisabled] = useState(false) //hook to disable button after password update
    const { id } = useParams()                      //hook to get token from the url

    //function to update the password
    const onSubmit = async (values) => {
        const res=await axios.put(`${API_URL}/reset-password`, {
            newPassword: values.newPassword,
            resetLink: id                           //passing token as reset link to server
        },{

        headers: {
            accesstoken:localStorage.getItem("token")
        },
        })
                setError(res.data.message)                              //setting error message from the database to UI
                if (res.data.message === 'Your password has been changed successfully!') {
                    setDisabled(true);                  //trigger disable attribute
                    setShow(true)                       //display the sign in button after success message
                }
            }
    

    //password pattern using regex
    const PASSWORD_REGEX = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/

    //Form validation using Formik package
    const { handleBlur, handleChange, handleSubmit, errors, touched, values, isValid } = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: yup.object({
            newPassword: yup.string().required("Please enter password").matches(PASSWORD_REGEX,
                "Password must contain at least 8 characters, one uppercase, number and special character"
            ),
            confirmPassword: yup.string().required("Please confirm your password").when("newPassword", {
                is: val => val && val.length > 0 ? true : false,
                then: yup.string().oneOf([yup.ref("newPassword")], "Password does not match")
            })
        }),
        onSubmit
    })

    return (
        <div className="wrapper">
            <div className="logo"> <img src={image} alt="" /> </div>
            <div className="text-center mt-4 name"> Reset Password </div>
            <form onSubmit={handleSubmit}>
                {error ?
                    (error === "Your password has been changed successfully!" ?
                        (<SuccessMessage >{error} </SuccessMessage>)
                        : (<ErrorMessage >{error} </ErrorMessage>))
                    : ""
                }
                <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '34ch', maxWidth: '90%' }, }} noValidate autoComplete="off" >
                    <div >
                        <TextField type="password" id="standard-basic" name="newPassword" label="New Password" variant="standard" onChange={handleChange} onBlur={handleBlur} value={values.newPassword} />
                        {touched.newPassword && errors.newPassword ? (<ErrorMessage>{errors.newPassword} </ErrorMessage>) : null}
                        <TextField type="password" id="standard-basic" name="confirmPassword" label="Confirm Password" variant="standard" onChange={handleChange} onBlur={handleBlur} value={values.confirmPassword} />
                        {touched.confirmPassword && errors.confirmPassword ? (<ErrorMessage>{errors.confirmPassword} </ErrorMessage>) : null}

                    </div>
                </Box>
                <button type="submit" disabled={!isValid || disabled} className="btn mt-3" >Reset</button>
            </form><br />
            {show ? <div>Sign in to your account: <Link to='/'>Sign In</Link></div> : ""}
        </div>
    )
}

export default ResetPassword
