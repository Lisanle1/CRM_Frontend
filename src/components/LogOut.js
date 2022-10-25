import React, { useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


function LogOut() {
    const [modelOpen, setModelOpen] = useState(false)       //hook to handle log out modal
    let navigate = useNavigate();                           //hook to change the routes

    return (
        <>
            <li>
                <a onClick={setModelOpen}>
                    <i class="fa fa-sign-out-alt" aria-hidden="true"></i><span className="sidebar-titles">Log Out</span>
                </a>
            </li>
            <Modal show={modelOpen} onHide={() => setModelOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>LOG OUT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Do you want to Log Out?

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModelOpen(false)} >
                        NO
                    </Button>
                    <Button variant="primary" onClick={() => {
                        localStorage.removeItem('token');
                        navigate("/login")
                        setModelOpen(false)
                    }}>
                        YES
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LogOut
