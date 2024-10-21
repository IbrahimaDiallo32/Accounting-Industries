import './Journalize.css';
import Avatar from '../../Assets/Avatar.jsx';
import 'reactjs-popup/dist/index.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCalendar } from "react-icons/ci";
import CalandarPopUp from '/Users/ibrahimadiallo/AccountingClient/AccountingFolder/accounting-front-end/src/Componenets/Modal/CalandarPopUp.jsx';
import Modal from '/Users/ibrahimadiallo/AccountingClient/AccountingFolder/accounting-front-end/src/Componenets/Modal/Modal.jsx';
import axios from 'axios';

const Journalize = () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);

    const [debitEntries, setDebitEntries] = useState([{ account: 'NULL', amount: '0.00' }]);
    const [creditEntries, setCreditEntries] = useState([{ account: 'NULL', amount: '0.00' }]);

    const [isCalandarOpen, setIsCalandarOpen] = useState(false);
    const openCalandar = () => setIsCalandarOpen(true);
    const closeCalandar = () => setIsCalandarOpen(false);

    useEffect(() => {
        if (!storedUser) {
            navigate("/", { replace: true });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/loginForm");
    };

    const handleClearForm = () => {
        setAccounts('');
        setDebitEntries(['']);
        setCreditEntries(['']);
    };

    const handleDebitChange = (index, field, value) => {
        const newEntries = [...debitEntries];
        newEntries[index][field] = value;
        setDebitEntries(newEntries);
    };

    const handleCreditChange = (index, field, value) => {
        const newEntries = [...creditEntries];
        newEntries[index][field] = value;
        setCreditEntries(newEntries);
    };

    // Add new debit entry
    const handleAddDebitEntry = (accountNameToRemove) => {
        const hasIncompleteEntry = debitEntries.some(
            (entry) => entry.account === 'NULL' || entry.account === 'Select Account' || entry.amount === '0.00' || entry.amount === '');

        // If any entry is incomplete, prevent the adding a new one and notify user
        if (hasIncompleteEntry) {
            alert('Fill all information to allow new Debit Entry');
            return;
        }
        setDebitEntries([...debitEntries, { account: 'NULL', amount: '0.00' }]);

        //this is removing the account that was just used in the submission
        const updatedDebitAccounts = debitEntries.filter(entry => entry.account !== accountNameToRemove);
        setAccounts(updatedDebitAccounts);

    };

    // Add new credit entry
    const handleAddCreditEntry = () => {
        const hasIncompleteEntry = creditEntries.some(
            (entry) => entry.account === 'NULL' || entry.account === 'Select Account' || entry.amount === '0.00' || entry.amount === '');

        // If any entry is incomplete, prevent the adding a new one and notify user
        if (hasIncompleteEntry) {
            alert('Fill all information to allow new Credit Entry');
            return;
        }

        setCreditEntries([...creditEntries, { account: 'NULL', amount: '0.00' }]); //these 3 dots ensure the original copy of creditEntries isnt modified
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            const accountsData = await axios.get('http://localhost:8080/account');
            setAccounts(accountsData.data);
        };
        fetchAccounts();
    }, []);

    return (
        <div className='outerContainers'>
            <div className="homePageOutermostcontainer">
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
                <div className="main-content">
                    <h1>Journal Entry
                        <button className='createNewAccountButton' onClick={handleClearForm}>Clear</button>
                        <button className='journalCalendar' onClick={openCalandar}><CiCalendar />Calendar</button>
                    </h1>
                    <Modal isOpen={isCalandarOpen} onClose={closeCalandar}>
                        <CalandarPopUp />
                    </Modal>

                    <h3>Debits:</h3>
                    {debitEntries.map((entry, index) => (
                        <div key={index} className="journalizeField">
                            <select
                                className="registrationInput"
                                value={entry.account}
                                onChange={(e) => handleDebitChange(index, 'account', e.target.value)}
                            >
                                <option value="">Select Account</option>
                                {accounts.map((account, i) => (
                                    <option key={i} value={account.accountName}>
                                        {account.accountName}
                                    </option>
                                ))}
                            </select>
                            $ <input
                                placeholder='Amount'
                                value={entry.amount}
                                onChange={(e) => handleDebitChange(index, 'amount', e.target.value)}
                            />
                        </div>
                    ))}
                    <button className='createNewAccountButton' onClick={() => handleAddDebitEntry(debitEntries.account)}>Add debit entry</button>

                    <h3>Credits:</h3>
                    {creditEntries.map((entry, index) => (
                        <div key={index} className="journalizeField">
                            <select
                                className="registrationInput"
                                value={entry.account}
                                onChange={(e) => handleCreditChange(index, 'account', e.target.value)}
                            >
                                <option value="">Select Account</option>
                                {accounts.map((account, i) => (
                                    <option key={i} value={account.accountName}>
                                        {account.accountName}
                                    </option>
                                ))}
                            </select>
                            $ <input
                                placeholder='Amount'
                                value={entry.amount}
                                onChange={(e) => handleCreditChange(index, 'amount', e.target.value)}
                            />
                        </div>
                    ))}
                    <button className='createNewAccountButton' onClick={handleAddCreditEntry}>Add credit entry</button>
                    <div>
                        <button className='createNewAccountButton'>Submit entry</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Journalize;
