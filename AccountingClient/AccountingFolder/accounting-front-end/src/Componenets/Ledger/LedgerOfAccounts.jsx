import React from 'react';
import './LedgerOfAccounts.css';
import { RxAvatar } from "react-icons/rx";
import Avatar from '../Assets/Avatar';


const LedgerOfAccounts = () => {

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
                    <a href="/LedgerOfAccounts">Ledger</a>
                    <a href="#module3">Module 3</a>
                    <a href="#module5">MODULE 5</a>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    
                </div>
            </div>
        </div>
    );
};

export default LedgerOfAccounts;
