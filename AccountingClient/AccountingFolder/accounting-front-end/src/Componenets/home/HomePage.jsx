import './HomePage.css';
import Avatar from '../Assets/Avatar';
import 'reactjs-popup/dist/index.css';
import React from 'react';
import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { CiCalendar } from "react-icons/ci";
import CalandarPopUp from '../Modal/CalandarPopUp';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {

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
                    <a href="/Journalize">Journalize</a>
                    <a href="/EventLog">Event Log</a>
                    <a><button className="logout-other-button" onClick={handleLogout}>Logout</button></a>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <div className="header">
                        <div className="title-logo">
                            <img src="/AIT.PNG" alt="AIT Logo" />
                            <h1>Welcome To Accounting Treasury Industries!</h1>
                        </div>
                        <div className='rightHeader'>
                            <button className='Calandar' onClick={openCalandar}><CiCalendar /></button>
                        </div>
                    </div>
                    <Modal isOpen={isCalandarOpen} onClose={closeCalandar}>
                        <CalandarPopUp />
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
