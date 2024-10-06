import React from 'react';
import './HomePage.css';
import { RxAvatar } from "react-icons/rx";
import Avatar from '../Assets/Avatar';


const HomePage = ({ userName }) => {

    const username = "Ibrahima Diallo";

    return (
        <div className='outerContainers'>
            <div className="homePageOutermostcontainer">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="profile">
                        <Avatar name={username} />
                        <span className="spanForHome">Hello Alexa</span>
                    </div>
                    <a href="/DisplayUserList" className='spacingHomePage'>USER LIST</a>
                    <a href="/Accounts">Accounts</a>
                    <a href="/#">Chart Of Accounts</a>
                    <a href="/NewUserForm">New user form</a>
                    <a href="#module5">MODULE 5</a>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <div className="header">
                        <div className="title-logo">
                            <img src="/AIT.PNG" alt="AIT Logo" />
                            <h1>Welcome To Accounting Treasury Industries!</h1>
                        </div>
                        <a href="/LoginForm"><button className="logout-btn">LOGOUT</button></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
