import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import * as yup from "yup";
import { useFormik } from "formik";
import { ErrorMessage, SuccessMessage } from "./Utils.js"
import { API_URL } from "./API_URL"
import image from "../images/image.jpg"
import axios from 'axios';

function SignUp() {
    const [error, setError] = useState(null)        //hook to error messages from the server
    const [disabled, setDisabled] = useState(false) //hook to handle save button disable attribute
    const [show, setShow] = useState(false) //hook to handle sign in button

    //function to add the user info to database
    const onSubmit = async (values) => {
        const res=await axios.post(`${API_URL}/sign-up`, {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password
        },
        {
        headers: {
            accesstoken:localStorage.getItem("token")
        },
      })
            setError(res.data.message)
                if (res.data.message === 'Account created successfully!') {
                    setDisabled(true);                  //trigger disable attribute
                    setShow(true)
                }
            
    }

    //password pattern using regex
    const PASSWORD_REGEX = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/

    //Form validation using formik package
    const { handleBlur, handleChange, handleSubmit, errors, touched, values, isValid } = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: yup.object({
            firstName: yup.string().required("Please enter first name"),
            lastName: yup.string().required("Please enter last name"),
            email: yup.string().required("Please enter email").email("Email must be a valid email"),
            password: yup.string().required("Please enter password").matches(PASSWORD_REGEX,
                "Password must contain at least 8 characters, one uppercase, number and special character"
            ),
            confirmPassword: yup.string().required("Please confirm your password").when("password", {
                is: val => val && val.length > 0 ? true : false,
                then: yup.string().oneOf([yup.ref("password")], "Password does not match")
            })
        }),
        onSubmit
    })

    return (
        <div className="wrapper">
            <div className="logo"> <img src={image} alt="" /> </div>
            <div className="text-center mt-4 name"> SIGN UP </div>
            <form onSubmit={handleSubmit}>
                <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '34ch', maxWidth: '90%' }, }} noValidate autoComplete="off" >
                    <div >
                        <TextField type="text" name="firstName" label="First Name" variant="standard" onChange={handleChange} onBlur={handleBlur} value={values.firstName} />
                        {touched.firstName && errors.firstName ? (<ErrorMessage >{errors.firstName}</ErrorMessage>) : null}

                        <TextField type="text" name="lastName" label="Last Name" variant="standard" onChange={handleChange} onBlur={handleBlur} value={values.lastName} />
                        {touched.lastName && errors.lastName ? (<ErrorMessage >{errors.lastName}</ErrorMessage>) : null}

                        <TextField type="email" name="email" label="Email" variant="standard" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                        {touched.email && errors.email ? (<ErrorMessage >{errors.email} </ErrorMessage>) : null}

                        <TextField type="password" name="password" label="Password" variant="standard" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                        {touched.password && errors.password ? (<ErrorMessage>{errors.password} </ErrorMessage>) : null}

                        <TextField type="password" name="confirmPassword" label="Confirm Password" variant="standard" onChange={handleChange} onBlur={handleBlur} value={values.confirmPassword} />
                        {touched.confirmPassword && errors.confirmPassword ? (<ErrorMessage>{errors.confirmPassword} </ErrorMessage>) : null}
                    </div>
                </Box>
                {error ? (error === "Account created successfully!" ? <SuccessMessage>{error} </SuccessMessage> : <ErrorMessage>{error} </ErrorMessage>) : ""}
                <button type="submit" disabled={!isValid || disabled} className="btn mt-3" >SIGN UP</button>
            </form><br />

            <div className="text-center mt-2">
                {show ? ("Sign in to your account: ") : ("Already have an account? ")}
                <Link to="/" >Sign in</Link>
            </div>

        </div>
    )
}

export default SignUp
