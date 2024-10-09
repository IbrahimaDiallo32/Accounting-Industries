import React from 'react';
import './DisplayUserList.css';
import { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';



const AccountsHelp = () => {

    return (
        <div classname = "accountHelpMainPage">
        <header className='logoForRegistration'>
                <a href="/Accounts"><button className='backButtonRegistration'><IoArrowBack />BACK</button></a>
                <div className='shiftForRegis'>
                    <img src="/AIT.PNG" width={100} height={100} alt="Logo" className='shiftForRegistation' />
                    <h2 className=''>UserList Help</h2>
                    <img src="/AIT.PNG" width={100} height={100} className='regLogo2' alt="Logo" />
                </div>
            </header>
                <div className="createAccountHelp">
                <h2> Add new user button</h2>
                The administrator can create new users from within the webpage using this button. Follow the promps that open after clicking the button to continue.
                </div>
                <div className= "editUserInfoHelp">
                    <h2>Edit User Info Button</h2>
                    The administrator can edit user the selected user by the corrisponding edit button. Follow the promps after clicking the edit button to continue.
                </div>
            </div>
    );
};

export default AccountsHelp;