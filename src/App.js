import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideBar from './components/SideBar';
import DashBoard from './components/DashBoard';
import React from "react";
import Leads from './components/Leads';
import ServiceRequest from './components/ServiceRequest';
import ResetPassword from './components/ResetPassword';
import Settings from './components/Settings';
import Users from './components/Users';

export const UserContext = React.createContext(""); 

function App() {

    return (
        <Router>

            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/reset-password/:id" element={<ResetPassword />} />
            </Routes>
            <Routes>
                <Route element={<SideBar />} />
            </Routes>
            <Routes>
                <Route exact path="/dashboard" element={<DashBoard />} />
                <Route path="/service-requests" element={<ServiceRequest />} />
                <Route exact path="/leads" element={<Leads />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>

        </Router>
    );
}

export default App;
