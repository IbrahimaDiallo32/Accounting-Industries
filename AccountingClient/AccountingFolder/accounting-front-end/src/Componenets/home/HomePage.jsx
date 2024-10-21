import './HomePage.css';
import Avatar from '../Assets/Avatar';
import 'reactjs-popup/dist/index.css';
import React from 'react';
import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { CiCalendar } from "react-icons/ci";
import CalandarPopUp from '../Modal/CalandarPopUp';
import { useNavigate } from 'react-router-dom';
import { CiCalculator1 } from "react-icons/ci";
import CalculatorPopUp from '../Modal/CalculatorPopUp';

const HomePage = () => {

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();

    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const toggleCalculator = () => {
        setIsCalculatorOpen(!isCalculatorOpen);
    }
    const closeCalculator = () => {
        setIsCalculatorOpen(false);
      };

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
      };

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
                    <a href="/Journalize">Journalize</a>
                    <a href="/Ledger">Ledger</a>
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
                            <button className='Calandar' onClick={toggleCalculator}><CiCalculator1/></button>
                            <button className='Calandar' onClick={toggleCalendar}><CiCalendar/></button>
                        </div>
                    </div>
                    {isCalendarOpen && (
                      <Draggable>
                        <div>
                             <CalandarPopUp />
                       </div>
                     </Draggable>
                     )}
                    {isCalculatorOpen && (
                        <Draggable>
                            <div className="CalculatorOuterContainer">
                                 <h4>Calculator</h4>
                                 <button onClick={closeCalculator} className="close-button">
                                  X
                                 </button>
                            <div>
                                <CalculatorPopUp/>
                            </div>
                            </div>
                        </Draggable>
    
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
