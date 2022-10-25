import React, { useEffect, useState, useRef } from 'react'
import SideBar from './SideBar';
import AddLeads from './AddLeads';
import { FormControl, RadioGroup, FormControlLabel, FormLabel, Radio } from "@mui/material"
import "../styles/Leads.css";
import axios from "axios"
import { Modal, Button, Stack } from 'react-bootstrap';
import { API_URL } from "./API_URL"
import jwt from "jsonwebtoken";
import { useNavigate} from 'react-router-dom';


function Leads() {
    const [data, setData] = useState([])                    //hook to save data from database
    const [currentStatus, setCurrentStatus] = useState("")  //hook to handle the status of the lead
    const [addLead, setAddLead] = useState(true)            //hook to handle the add lead page
    const [viewLead, setViewLead] = useState(false)         //hook to handle the view lead page
    const [show, setShow] = useState(false)                 //hook to handle status modal
    const [passId, setPassId] = useState("")                //hook to hold current userId for updating status
    let decodedRef = useRef()                               //hook to decode token to check the user's role
    const [checkRoles, setCheckRoles] = useState("")        //hook to check role
    const navigate = useNavigate()                          //hook to changing the routes
    let refToken = useRef()                              //hook to save token locally
    useEffect(() => {
        const localToken = localStorage.getItem("token")
        let decodedToken = jwt.decode(localToken)
        decodedRef.current = decodedToken.existUser.role    //assigning user role in a useRef hook
        if (decodedToken.exp * 1000 <= Date.now()) {
            return navigate("/login")
        }
        else {
            refToken.current = localToken;
            setCheckRoles(decodedRef.current)               //setting user role
            getDataFromDb()
        }
    },[])

    //function to get data from database
    const getDataFromDb = async () => {
        const res=await axios.get(`${API_URL}/leads`, {
            headers: {
                accesstoken:localStorage.getItem("token")
            }
        })
        setData(res.data)
    }

    //to display view lead button & add lead page
    const handleData = () => {
        setAddLead(false)
        setViewLead(true)
    }

    //to display add lead button & view lead page
    const handleData2 = () => {
        setAddLead(true)
        setViewLead(false)
    }

    let handleDelete=async(id)=>{
    await axios.delete(`${API_URL}/leads/` + id,
    {
            headers:{
                accesstoken:localStorage.getItem("token")
            }
        })
        getDataFromDb();
    }

    //function to handle status modal
    const handleStatusModal = (status, id) => {
        setCurrentStatus(status)
        setShow(true)
        setPassId(id)
    }

    const changeStatusHandler = async () => {
        const decodedToken =jwt.decode(localStorage.getItem("token"));
        if(decodedToken.exp * 1000 < Date.now()){
            navigate("/login")
        }
        else{
            
            await axios.put(`${API_URL}/leads/`+passId,
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
                (addLead ?
                   <button className="btn btn-outline-primary leadPage-hidebtn" onClick={()=>handleData()}><i class="fas fa-pen"> Create</i></button>
                    : <button className="btn btn-outline-success leadPage-hidebtn" onClick={()=>handleData2()}><i class="far fa-list-alt"> View</i></button>
                )
            }

            {addLead ?
                <div className="leads-page">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Contact</th>
                                <th scope="col">Company</th>
                                <th scope="col">Status</th>
                                {checkRoles === "" || checkRoles === "Employee" ? "" : <th scope="col">Option</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((e,i) => {
                                    return <tr key={i}>
                                        <th scope="row">{i+ 1}</th>
                                        <td>{e.name}</td>
                                        <td>{e.email}</td>
                                        <td>{e.contact}</td>
                                        <td>{e.company}</td>
                                        <td>
                                            <div className="role-edit-button" onClick={checkRoles === "" ? "" : (() => handleStatusModal(e.status, e._id))}>
                                                <i class="fas fa-user-edit">{e.status === "" ? "unassigned" : e.status}</i>
                                            </div>
                                        </td>
                                        {checkRoles === "" || checkRoles === "Employee" ?
                                            "" :
                                            <td>
                                                <button className="btn btn-outline-danger" onClick={() => handleDelete(e._id)}>Delete</button>
                                            </td>} 
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                : null
            }
            {viewLead ? <AddLeads getDataFromDb={getDataFromDb()} /> : null}

            <Modal show={show} onHide={() => {
                setCurrentStatus("")
                setShow(false)
            }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title >
                        Do you want to change status?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body fluid="true">
                    <Stack>
                        <FormControl >
                            <FormLabel id="demo-row-radio-buttons-group-label">Status:</FormLabel>
                            <RadioGroup row name="row-radio-buttons-group" value={currentStatus} onChange={(e) => {

                                setCurrentStatus(e.target.value)
                            }}>
                                <FormControlLabel value="New" control={<Radio />} label="New" />
                                <FormControlLabel value="Lost" control={<Radio />} label="Lost" />
                                <FormControlLabel value="Contacted" control={<Radio />} label="Contacted" />
                                <FormControlLabel value="Canceled" control={<Radio />} label="Canceled" />
                                <FormControlLabel value="Qualified" control={<Radio />} label="Qualified" />
                                <FormControlLabel value="Confirmed" control={<Radio />} label="Confirmed" />
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success"  onClick={() => changeStatusHandler()}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}     
 
export default Leads
