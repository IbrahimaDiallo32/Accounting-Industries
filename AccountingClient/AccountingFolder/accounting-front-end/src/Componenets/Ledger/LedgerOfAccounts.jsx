import React from 'react';
import './LedgerOfAccounts.css';
import { RxAvatar } from "react-icons/rx";
import Avatar from '../Assets/Avatar';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const LedgerOfAccounts = () => {

    const [accounts, setAccounts] = useState([]);
    const [journals, setJournals] = useState([]);

    const { accountName } = useParams();

    const fetchJournalEntries = async (ledgerAccount) => {
        try {
            const responce = await axios.get(`http://localhost:8080/journal/account/${ledgerAccount}`); // ledgerAccount is the account you selected
            setJournals(responce.data);
        }
        catch (error) {
            console.error('Error fetching options:', error);
        }
    }

    useEffect(() => {
        fetchAccountNames();
    }, []);

    const fetchAccountNames = async () => {
        try {
            const responce = await axios.get(`http://localhost:8080/account/accountName`);
            setAccounts(responce.data);
        }
        catch (error) {
            console.error('Error fetching options:', error);
        }
    }

    const checkEntryType = (journalEntryType) => {
        if (journalEntryType == "Debit") {
            return true;
        }
        else {
            return false;
        }
    }

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("currentUser"); // Clear user data
        navigate("/loginForm"); // Redirect to login
    };

    const openHelp = () => setIsHelpOpen(true);
    const closeHelp = () => setIsHelpOpen(false);

    const [ledgerAccount, setLedgerAccount] = useState('Select-Account');

    useEffect(() => {
        const storedAccount = localStorage.getItem("currentAccount");
        if (storedAccount) {
            fetchJournalEntries(storedAccount);
            setLedgerAccount(storedAccount);
            localStorage.removeItem("currentAccount");
        }
    }, [])

    const saveSelectedPostReference = (postRef) => {
        console.log("Saving to localStorage:", postRef); // Log to confirm saving
        localStorage.setItem("currentPostRef", postRef);
    }

    return (
        <div className="homePageOutermostcontainer">
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
                <a href="/EventLog">Event Log</a>
                <a><button className="logout-other-button" onClick={handleLogout}>Logout</button></a>
            </div>
            <div className="main-content">
                <h1>Main Ledger </h1>
                <div>
                    <label className='labelSelectAccountLedger'> Select Account</label>
                    <select className="sortBySelection" value={ledgerAccount} onChange={(e) => setLedgerAccount(e.target.value)} defaultValue="Select Account">
                        <option value="Select-Account" disabled >Select Account</option>
                        {accounts.map((accountName, index) => (
                            <option key={index} value={accountName}>{accountName}</option>
                        ))}
                    </select>
                    <button className="submitSort" onClick={(e) => { fetchJournalEntries(ledgerAccount) }}> Go</button>
                </div>
                {journals.length > 0 ? (
                    <table className="accounts-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Completed By</th>
                                <th>Post Reference</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {journals.map((journal) => (
                                <tr key={journal.accountName}>
                                    <td>{journal.dateCreated}</td>
                                    <td>{journal.status}</td>
                                    <td>{journal.completedBy}</td>
                                    <td><a href = "/AllJournalEntries" onClick={ () => {saveSelectedPostReference(journal.uniqueID)}}>{journal.uniqueID}</a></td>

                                    {checkEntryType(journal.entryType) ? (
                                        <td>${journal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    ) : (
                                        <td></td>
                                    )}
                                    {!checkEntryType(journal.entryType) ? (
                                        <td>${journal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    ) : (
                                        <td></td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p></p>
                )}
            </div>
        </div>
    );
};

export default LedgerOfAccounts;
