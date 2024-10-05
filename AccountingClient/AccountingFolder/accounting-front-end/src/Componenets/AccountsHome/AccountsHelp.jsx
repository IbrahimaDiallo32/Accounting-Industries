import React from 'react';
import './Accounts.css';
import { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';



const AccountsHelp = () => {

    return (
        <div>
        <header className='logoForRegistration'>
                <a href="/Accounts"><button className='backButtonRegistration'><IoArrowBack />BACK</button></a>
                <div className='shiftForRegis'>
                    <img src="/AIT.PNG" width={100} height={100} alt="Logo" className='shiftForRegistation' />
                    <h2 className='registerText'>Account Help</h2>
                    <img src="/AIT.PNG" width={100} height={100} className='regLogo2' alt="Logo" />
                </div>
            </header>
            
            </div>
    );
};

export default AccountsHelp;