import React, { useEffect, useState, useRef } from 'react'
import SideBar from './SideBar';
import { FormControl, RadioGroup, FormControlLabel, FormLabel, Radio } from "@mui/material"
import "../styles/ServiceRequest.css"
import axios from "axios"
import { Modal, Button, Stack } from 'react-bootstrap';
import { API_URL } from "./API_URL"
import jwt from "jsonwebtoken";
import AddServiceRequest from './AddServiceRequest';
import { useNavigate } from 'react-router-dom';

function ServiceRequest() {
    let [data, setData] = useState([])                          //hook to save data from database
    const [currentStatus, setCurrentStatus] = useState("")      //hook to handle status of the service request
    const [addRequest, setAddRequest] = useState(true)          //hook to handle add request page
    const [viewRequest, setViewRequest] = useState(false)       //hook to handle view lead page
    const [show, setShow] = useState(false)                     //hook to handle status modal
    const [passId, setPassId] = useState("")                    //hook to hold current userId for updating status
    let decodedRef = useRef()                                   //hook to save decoded token 
    const [checkRoles, setCheckRoles] = useState("")            //hook to check the roles
    const navigate = useNavigate()                              //hook to change the routes           
    let refToken = useRef()                                     //hook to save token locally

    useEffect(() => {
        const localToken = localStorage.getItem("token")
        let decodedToken = jwt.decode(localToken)               //decoding the token
        decodedRef.current = decodedToken.existUser.role
        if (decodedToken.exp * 1000 <= Date.now()) {
            return navigate("/login")
        }
        else {
            setCheckRoles(decodedRef.current)
            refToken.current = localToken;                        //assigning token in a useRef hook  
            getDataFromDb()
        }
    }, [])

    //function to get data from database
    const getDataFromDb = async () => {
        const res=await axios.get(`${API_URL}/service-requests`, {
            headers: {
                accesstoken: localStorage.getItem("token")                     //adding token in header to process request
            }
        })
          setData(res.data)
    }

    //to display the create request button & view request page
    const handleData = () => {
        setAddRequest(false)
        setViewRequest(true)
    }

    //to display the view request button & add request page
    const handleData2 = () => {
        setAddRequest(true)
        setViewRequest(false)
    }

    //function to delete service request on database
    let handleDelete = async (id) => {
        await axios.delete(`${API_URL}/service-requests/`+id, {
            headers: {
                accesstoken: localStorage.getItem("token")                     //adding token in header to process request
            }
        })
        getDataFromDb()
    }

    //to display the status modal
    const handleStatusModal = (status, id) => {
        setCurrentStatus(status)
        setShow(true)
        setPassId(id)
    }

    //function to update the status on database
    const changeStatusHandler = async () => {
        const decodedToken =jwt.decode(localStorage.getItem("token"));
        if(decodedToken.exp * 1000 < Date.now()){
            navigate("/login")
        }
        else{          
            await axios.put(`${API_URL}/service-requests/`+passId,
            {
                status: currentStatus
            },
            {
            headers: {
                accesstoken:localStorage.getItem("token")
                    },
                    
            });
            getDataFromDb();
            setShow(false)
        }
    }

    return (
        <>
            <SideBar />
            {checkRoles === "" ?
                "" :
                (addRequest ?
                    <button className="btn btn-outline-primary leadPage-hidebtn" onClick={()=>handleData()}><i class="fas fa-pen"> Create</i></button>
                    : <button className="btn btn-outline-success leadPage-hidebtn" onClick={()=>handleData2()}><i class="far fa-list-alt"> View</i></button>
                )
            }

            {addRequest ?
                <div className="request-page">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Request</th>
                                <th scope="col">Status</th>
                                {checkRoles==="" || checkRoles==="Employee"?null:<th scope="col">Option</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((e,i) => {
                                    return (<tr key={i}>
                                        <th scope="row">{i+1}</th>
                                        <td>{e.name}</td>
                                        <td>{e.email}</td>
                                        <td>{e.request}</td>
                                        <td>
                                            <div className="role-edit-button" onClick={checkRoles === "" ? null :(() => handleStatusModal(e.status, e._id))}>
                                                <i className="fas fa-user-edit">{e.status=== ""?"unassigned":e.status}</i>
                                            </div>
                                        </td>
                                        {checkRoles===""||checkRoles==="Employee" ?null:<td>
                                                <button className="btn btn-outline-danger" onClick={() => handleDelete(e._id)}>Delete</button>
                                            </td>}
                                    </tr>)
                                })
                            }
                        </tbody>
                    </table>
                </div>:null}

            {viewRequest ? <AddServiceRequest getDataFromDb={getDataFromDb()} />:null}

            <Modal show={show}
                onHide={() => {
                    setCurrentStatus("")
                    setShow(false)
                }} backdrop="static" keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title >
                        Do you want to change status?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body fluid="true">
                    <Stack>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Status:</FormLabel>
                            <RadioGroup row name="row-radio-buttons-group" value={currentStatus} onChange={(e) => {

                                setCurrentStatus(e.target.value)
                            }}>
                                <FormControlLabel value="Created" control={<Radio />} label="Created" />
                                <FormControlLabel value="Open" control={<Radio />} label="Open" />
                                <FormControlLabel value="In process" control={<Radio />} label="In process" />
                                <FormControlLabel value="Released" control={<Radio />} label="Released" />
                                <FormControlLabel value="Canceled" control={<Radio />} label="Canceled" />
                                <FormControlLabel value="Completed" control={<Radio />} label="Completed" />
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => changeStatusHandler()}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ServiceRequest
