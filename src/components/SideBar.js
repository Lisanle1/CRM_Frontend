import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import LogOut from './LogOut'
import "../styles/SideBar.css"
import image from "../logo.jpg"
import jwt from "jsonwebtoken";

function SideBar() {
    const [showUserPage, setShowUserPage] = useState(false)             //hook to handle user page for manager/admin
    const [showSettingPage, setShowSettingPage] = useState(false)       //hook to handle setting page for admin
    const decodedRef = useRef()                                         //hook to save decoded token    

    useEffect(() => {
        const localToken = localStorage.getItem("token")
        let decodedToken = jwt.decode(localToken)
        decodedRef.current = decodedToken.existUser.role            //assigning user role to useRef hook
        if (decodedRef.current === "Manager" || decodedRef.current === "Admin") {
            setShowUserPage(true)
        }
        if (decodedRef.current === "Admin") {
            setShowSettingPage(true)
        }

    }, [])

    return (
        <>
            <div class="sidebar-container">
                <div class="sidebar-logo">
                    <img className="logo-img" src={image} alt="logo" />
                    <span className="ms-3 sidebar-titles">CRM</span>
                </div>
                <ul class="sidebar-navigation">

                    <li>
                        <Link to="/dashboard">

                            <i class="fa fa-list" aria-hidden="true"></i> <span className="sidebar-titles"> &nbsp;&nbsp;Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/leads">

                            <i class="fa fa-users" aria-hidden="true"></i><span className="sidebar-titles">Leads</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/service-requests">

                            <i class="fa fa-edit" aria-hidden="true"></i><span className="sidebar-titles">Service Requests</span>
                        </Link>
                    </li>
                    {showUserPage ?
                        <li>
                            <Link to="/users">

                                <i class="fa fa-users" aria-hidden="true"></i><span className="sidebar-titles">Users</span>
                            </Link>
                        </li>
                        : null
                    }
                    {showSettingPage ?
                        <li>
                            <Link to="/settings">

                                <i class="fas fa-users-cog" aria-hidden="true"></i><span className="sidebar-titles">&nbsp;&nbsp;Settings</span>
                            </Link>
                        </li>
                        : null
                    }
                    <LogOut />
                </ul>
            </div>

        </ >
    )
}

export default SideBar
