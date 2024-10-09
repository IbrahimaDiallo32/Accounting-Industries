import React from 'react';
import './Accounts.css';
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
                    <h2 className=''>Account Help</h2>
                    <img src="/AIT.PNG" width={100} height={100} className='regLogo2' alt="Logo" />
                </div>
            </header>
            
                <div className="createAccountHelp">
                <h2> Create Account </h2>
                The "+Account" button at the top of the page will popup a form that needs to be filled out in-order to add a new account. More can be found under the help button on that page.
                </div>
                <div className ="accountHelpBody">
                    <h2 className="sortingAccounts" >How to Sort</h2>
                    The sorting function has two fields: "Sort By Type" and "Sort Direction". You must select a type and direction before sorting.
                </div>
                <div >The "Sort by Type" represents variable we can sort the table by. Each type is represented by a element in the database.</div>
                <div>The direction is indicated by ascending or descending order, asending: smallest to largest, descending: largest to smallest.
                    If the type is represented in words or characters ascending means alphabetical, and descending is the reverse.
                </div>
                <div>
                    <h2>Chart of Accounts Table</h2>
                    The chart of accounts show all current accounts in the database. 
                    At first they will apear in the order they were created, but you can change the oder using the search function. See Above
                    <div>The top row represents titles for every column which are the following:Order Number, Account Number, Account Name, Account Category, Sub-Category, Balance, Debit, Credit, Account, Description, Edit </div>
                    
                </div>
            </div>
    );
};

export default AccountsHelp;