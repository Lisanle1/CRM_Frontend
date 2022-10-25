import React, { useState, useEffect, useRef } from 'react'
import SideBar from './SideBar';
import "../styles/DashBoard.css"
import axios from "axios"
import jwt from "jsonwebtoken";
import { API_URL } from "./API_URL"
import { useNavigate } from "react-router-dom"

function DashBoard() {
    const [leads, setLeads] = useState([0])           //hook to save total leads
    const [deals, setDeals] = useState([0])           //hook to save total deals
    const [requests, setRequests] = useState([0])     //hook to save total service request
    const [contacts, setContacts] = useState([0])     //hook to save total contacts
    let navigate = useNavigate();                   //hook to change the routes
    let refToken = useRef();                        //hook to save token locally


    useEffect(() => {
        const localToken = localStorage.getItem("token")
        let decodedToken = jwt.decode(localToken)
        if (decodedToken.exp * 1000 <= Date.now()) {        //checking token expiration
            return navigate("/login")
        }
        refToken.current = localToken;
        getDataFromDb()
    }, [])

    //function to get data from database
    const getDataFromDb = async () => {
        // await fetch(`${API_URL}/leads`, {
        //     method: "GET",
        //     headers: {
        //         token: refToken.current                 //adding token in header to process request
        //     }
        // })
        //     .then(data => data.json())
        //     .then(data => {
            let data= await axios.get(`${API_URL}/leads`,{
                headers: {
                             token: refToken.current                 //adding token in header to process request
                         }
            })
                let leads = data.reduce((prev, cur) => {
                    return (cur ? prev + 1 : prev)
                }, 0)
                let deals = data.filter(data => data.status === "Confirmed").reduce((prev, cur) => {
                    return (cur ? prev + 1 * 3 : prev)
                }, 0)
                let contacts = data.filter(data => data.contact !== null).reduce((prev, cur) => {
                    return (cur ? prev + 1 : prev)
                }, 0)
                setContacts(contacts)
                setDeals(deals)
                setLeads(leads)
    

        //adding total service request
        // await fetch(`${API_URL}/service-requests`, {
        //     method: 'GET',
        //     headers: {
        //         token: refToken.current                         //adding token in header to process request
        //     }
        // }).then(data => data.json()).then(data => {
             await axios.get(`${API_URL}/leads`,{
                headers: {
                             token: refToken.current                 //adding token in header to process request
                         }
            })
            let request = data.reduce((prev, cur) => {
                return (cur ? prev + 1 : prev)
            }, 0)
            setRequests(request)
        
    }

    return (
        <>
            <SideBar />
            <div className=" dashboard-page" >
                <div class="lead-container">
                    <form class="d-flex">
                        <button class="btn btn-outline-dark dashboard-btns" type="button" >
                            <span className="hoverContent">Total Leads</span>
                            <i class="bi-cart-fill me-1"></i>
                            Leads
                            <span class="badge bg-dark text-white ms-2 rounded-pill fs-6">
                                {leads}
                            </span>
                        </button>
                    </form>
                </div>
                <div class="lead-container">
                    <form class="d-flex">
                        <button class="btn btn-outline-dark dashboard-btns" type="button" >
                            <span className="hoverContent">Confirmed leads x ₹3</span>
                            <i class="bi-cart-fill me-1"></i>
                            Deals
                            <span class="badge bg-dark text-white ms-2 rounded-pill fs-6">
                                ₹ {deals}
                            </span>
                        </button>
                    </form>
                </div>

                <div class="lead-container">
                    <form class="d-flex">
                        <button class="btn btn-outline-dark dashboard-btns" type="button" >
                            <span className="hoverContent">Total Requests</span>
                            <i class="bi-cart-fill me-1"></i>
                            Service Request
                            <span class="badge bg-dark text-white ms-2 rounded-pill fs-6">
                                {requests}
                            </span>

                        </button>
                    </form>
                </div>
                <div class="lead-container">
                    <form class="d-flex">
                        <button class="btn btn-outline-dark dashboard-btns" type="button" >
                            <span className="hoverContent">Total Contacts</span>
                            <i class="bi-cart-fill me-1"></i>
                            Contacts
                            <span class="badge bg-dark text-white ms-2 rounded-pill fs-6">
                                {contacts}
                            </span>

                        </button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default DashBoard
