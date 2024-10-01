import React from 'react';
import './HomePage.css';
import { RxAvatar } from "react-icons/rx";
import Avatar from '../Assets/Avatar';


const HomePage = ({ userName }) => {

    //this is creating the User that will be used throughout the entire application

    const username = "Ibrahima Diallo"
    return (

        <div className='outerContainers'>
            <form action="">
                <h1>This this the home page.. more incomming</h1>
                <a href="/DisplayUserList">Click here to see the Full User List</a>
                <a href="/#">Click here to edit users?</a>
                {/* alex was here */}
            </form>

        <div className="homePageOutermostcontainer">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="profile">

                    {/* <RxAvatar className='avatarHomePage' /> */}
                    {/* <img src="https://via.placeholder.com/40" alt="Profile Picture" /> */}
                    <Avatar name={username} />
                    <span className="spanForHome">Hello Alexa</span>
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
                    <a href="/LoginForm"><button className="logout-btn">LOGOUT</button></a>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
