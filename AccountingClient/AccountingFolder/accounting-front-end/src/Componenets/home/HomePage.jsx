import './HomePage.css';
import { Link } from 'react-router-dom';
import Avatar from '../Assets/Avatar';
import { FaCalendar } from "react-icons/fa";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React from 'react';

const HomePage = ({ userName }) => {
    // Using the userName prop, defaulting to "Ibrahima Diallo" if not provided
    const username = userName || "Ibrahima Diallo";

    return (
        <div className='outerContainers'>
            <form action="">
                {/* Placeholder form */}
            </form>

            <div className="homePageOutermostcontainer">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="profile">
                        <Avatar name={username} />
                        <span className="spanForHome">
                            <button className="profilebtn">Hello {username}</button>
                        </span>
                    </div>
                    <a href="/DisplayUserList" className='spacingHomePage'>USER LIST</a>
                    <a href="#module2">EXPIRED PASSWORDS</a>
                    <a href="#module3">MODULE 3</a>
                    <a href="#module4">MODULE 4</a>
                    <a href="#module5">MODULE 5</a>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <div className="header">
                        <div className="title-logo">
                            <img src="/AIT.PNG" alt="AIT Logo" />
                            <h1>Accounting Treasury Industries</h1>
                        </div>
                        <a href="/LoginForm">
                            <button className="logout-btn">LOGOUT</button>
                        </a>
                    </div>

                    <div className='taskbar'>
                        <Link to="/EventLog">
                            <button type='button' className='eventLogBtn'>Event Log</button>
                        </Link>

                        {/* Calendar Popup Button */}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
