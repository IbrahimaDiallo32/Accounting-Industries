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
import axios from 'axios';

const HomePage = () => {

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();
    const [ratiosAndDashboard, setRatiosAndDashboard] = useState([]);

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
        const dashboardRatios = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/account/dashboard`);
                setRatiosAndDashboard(response.data);
            } catch (error) {
                console.error("Error fetching accounts", error);
            }
        };
        dashboardRatios();
        if (!storedUser) { //if no one is logged it, it automatically navigates back to login page
            navigate("/", { replace: true });
        }
        console.log(ratiosAndDashboard);
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
                    <a href="/AllJournalEntries">Journalize</a>
                    <a href="/LedgerOfAccounts">Ledger</a>
                    <a href="/Statements">Statements</a>
                    {storedUser.accountType === 'Admin' || storedUser.accountType === 'Manager' ? (
                        <a href="/EventLog">Event Log</a>
                    ) : ""}
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
                            <button className='Calandar' onClick={toggleCalculator}><CiCalculator1 /></button>
                            <button className='Calandar' onClick={toggleCalendar}><CiCalendar /></button>
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
                                    <CalculatorPopUp />
                                </div>
                            </div>
                        </Draggable>

                    )}
                    <div className="dash-entry-cards">
                                <div className="dash-card">
                                    <div className="dash-card-header">
                                        <span>Current Ratio</span>
                                    </div>
                                    
                                    <div className={`dash-card-content ${ratiosAndDashboard.currentRatio < 90
                                            ? "poor-ratio"
                                            : ratiosAndDashboard.currentRatio >= 90 && ratiosAndDashboard.currentRatio < 140
                                            ? "average-ratio"
                                             : "healthy-ratio"
                                            }`}>
                                        {ratiosAndDashboard.currentRatio}%
                                    </div>
                                   
                                </div>

                                <div className="dash-card">
                                    <div className="dash-card-header">
                                    <span>Return on Assets</span>
                                    </div>
                                    <div className={`dash-card-content ${ratiosAndDashboard.returnOnAssets < 5
                                            ? "poor-ratio"
                                            : ratiosAndDashboard.returnOnAssets >= 5 && ratiosAndDashboard.returnOnAssets < 10
                                            ? "average-ratio"
                                             : "healthy-ratio"
                                            }`}>
                                    {ratiosAndDashboard.returnOnAssets}%
                                    </div>
                                </div>

                                <div className="dash-card">
                                    <div className="dash-card-header">
                                        <span>Net Profit Margin</span>
                                    </div>
                                    <div className={`dash-card-content ${ratiosAndDashboard.netProfitMargin < 5
                                            ? "poor-ratio"
                                            : ratiosAndDashboard.netProfitMargin >= 5 && ratiosAndDashboard.netProfitMargin < 15
                                            ? "average-ratio"
                                             : "healthy-ratio"
                                            }`}>
                                        {ratiosAndDashboard.netProfitMargin}%
                                    </div>
                                </div>

                                <div className="dash-card">
                                    <div className="dash-card-header">
                                        <span>Return on Equity</span>
                                    </div>
                                    <div className={`dash-card-content ${ratiosAndDashboard.returnOnEquity < 10
                                            ? "poor-ratio"
                                            : ratiosAndDashboard.returnOnEquity >= 10 && ratiosAndDashboard.returnOnEquity < 20
                                            ? "average-ratio"
                                             : "healthy-ratio"
                                            }`}>
                                        {ratiosAndDashboard.returnOnEquity}%
                                    </div>
                                </div>

                                <div className="dash-card">
                                    <div className="dash-card-header">
                                        <span>Asset Turnover</span>
                                    </div>
                                    <div className={`dash-card-content ${ratiosAndDashboard.assetTurnover < 50
                                            ? "poor-ratio"
                                            : ratiosAndDashboard.assetTurnover >= 50 && ratiosAndDashboard.assetTurnover < 100
                                            ? "average-ratio"
                                             : "healthy-ratio"
                                            }`}>
                                        {ratiosAndDashboard.assetTurnover}%
                                    </div>
                                </div>

                                <div className="dash-card">
                                    <div className="dash-card-header">
                                        <span>Quick Ratio</span>
                                    </div>
                                    <div className={`dash-card-content ${ratiosAndDashboard.quickRatio < 90
                                            ? "poor-ratio"
                                            : ratiosAndDashboard.quickRatio >= 90 && ratiosAndDashboard.quickRatio < 140
                                            ? "average-ratio"
                                             : "healthy-ratio"
                                            }`}>
                                        {ratiosAndDashboard.quickRatio}%
                                    </div>
                                </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default HomePage;
