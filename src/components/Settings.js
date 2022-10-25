import SideBar from './SideBar';
import React, { useState, useEffect, useRef } from 'react';
import "../styles/Settings.css"
import { Modal, Button, Stack } from 'react-bootstrap';
import { FormControl, RadioGroup, FormControlLabel, FormLabel, Radio } from "@mui/material"
import axios from "axios"
import { API_URL } from "./API_URL"
import jwt from "jsonwebtoken";
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const [data, setData] = useState([])                    //hook to save data from database
    const [show, setShow] = useState(false)                 //hook to handle role modal
    const [currentRole, setCurrentRole] = useState("")      //hook to handle the roles    
    const [passId, setPassId] = useState("")                //hook to hold current userId for updating status   
    const navigate = useNavigate()                          //hook to change the routes
    let refToken = useRef()                                 //hook to save token locally

    useEffect(() => {
        const localToken = localStorage.getItem("token")
        let decodedToken = jwt.decode(localToken)           //decoding the token
        if (decodedToken.exp * 1000 <= Date.now()) {
            return navigate("/login")
        }
        refToken.current = localToken;                      //assigning token in a useRef hook
        getDataFromDb()
    }, [])

    //function to get data from database
    const getDataFromDb = async () => {
        await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
                token: refToken.current
            }
        }).then(data => data.json()).then(data => setData(data))
    }

    //to display the role modal
    const handleRoleModal = (role, id) => {
        setCurrentRole(role)
        setShow(true)
        setPassId(id)
    }

    //function to update the user role on database
    const changeRoleHandler = async () => {
        await axios.put(`${API_URL}/users/` + passId,
            {
                role: currentRole
            },
            {
                headers: {
                    token: refToken.current
                }
            })
        getDataFromDb()
        setShow(false)
    }

    //function to delete user on database
    const handleDelete = async (id) => {
        await axios.delete(`${API_URL}/users/` + id, {
            headers: {
                token: refToken.current
            }
        })
        getDataFromDb()
    }

    return <>
        <SideBar />
        <div className="request-page">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Option</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((e, i) => {
                            return <tr key={i}>
                                <th scope="row">{i + 1}</th>
                                <td>{e.firstName}</td>
                                <td>{e.lastName}</td>
                                <td>{e.email}</td>
                                <td>
                                    <div className="role-edit-button" onClick={() => handleRoleModal(e.role, e._id)}>
                                        <i class="fas fa-user-edit">{e.role === "" ? "unassigned" : e.role} </i>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(e._id)}>Delete</button>
                                </td>

                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>

        <Modal show={show}
            onHide={() => {
                setCurrentRole("")
                setShow(false)
            }} backdrop="static" keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title >
                    Do you want to change Role?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body fluid="true">
                <Stack>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Role:</FormLabel>
                        <RadioGroup row name="row-radio-buttons-group" value={currentRole}
                            onChange={(e) => {
                                setCurrentRole(e.target.value)
                            }}
                        >
                            <FormControlLabel value="Employee" control={<Radio />} label="Employee" />
                            <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
                            <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
                        </RadioGroup>
                    </FormControl>
                </Stack>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => changeRoleHandler()}>Submit</Button>
            </Modal.Footer>
        </Modal>
    </>;
}
