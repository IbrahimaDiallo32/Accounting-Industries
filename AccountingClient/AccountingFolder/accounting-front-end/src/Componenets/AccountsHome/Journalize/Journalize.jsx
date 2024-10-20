import './Journalize.css';
import Avatar from '/Users/ibrahimadiallo/AccountingClient/AccountingFolder/accounting-front-end/src/Componenets/Assets/Avatar.jsx';
import 'reactjs-popup/dist/index.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCalendar } from "react-icons/ci";
import CalandarPopUp from '/Users/ibrahimadiallo/AccountingClient/AccountingFolder/accounting-front-end/src/Componenets/Modal/CalandarPopUp.jsx';
import Modal from '/Users/ibrahimadiallo/AccountingClient/AccountingFolder/accounting-front-end/src/Componenets/Modal/Modal.jsx';

const Journalize = () => {

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();
    const [isCalandarOpen, setIsCalandarOpen] = useState(false);
    const openCalandar = () => setIsCalandarOpen(true);
    const closeCalandar = () => setIsCalandarOpen(false);

    useEffect(() => {
        if (!storedUser) { //if no one is logged it, it automatically navigates back to login page
            navigate("/", { replace: true });
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("currentUser"); // Clear user data
        navigate("/loginForm"); // Redirect to login
    };

    return (
        <div className='outerContainers'>
            <div className="homePageOutermostcontainer">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="profile">
                        <Avatar name={fullName} />
                        <span className="spanForHome">Hello {storedUser.firstName}</span>
                    </div>
                    <a href="/HomePage" className='spacingHomePage'>Home</a>
                    <a href="/DisplayUserList">User List</a>
                    <a href="/Accounts">Accounts</a>
                    <a href="/EventLog">Event Log</a>
                    <a href="/#">Module 5</a>
                    <a><button className="logout-other-button" onClick={handleLogout}>Logout</button></a>
                </div>
                <div className="main-content">
                    <h1>Journal Entry
                        <button className='createNewAccountButton'>Clear</button>
                        <button className='journalCalendar' onClick={openCalandar}><CiCalendar />Calendar</button>
                    </h1>
                    <Modal isOpen={isCalandarOpen} onClose={closeCalandar}>
                        <CalandarPopUp />
                    </Modal>

                    Debits:
                    <div className='Field'>
                        <label>Last name <sup>*</sup></label>
                        <input className='registrationInput'

                            placeholder='Last Name' />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Journalize;
