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

    const{accountName} = useParams();

    const fetchJournalEntries = async (ledgerAccount) => {
        try{
            const responce = await axios.get(`http://localhost:8080/Journalize/account/${ledgerAccount}`); // ledgerAccount is the account you selected
            setJournals(responce.data);
        }
        catch (error){
            console.error('Error fetching options:', error);
        }
    }

    useEffect(() => {
            fetchAccountNames();
    }, []);

    const fetchAccountNames = async () => {
        try{
            const responce = await axios.get(`http://localhost:8080/account/accountName`);
            setAccounts(responce.data);
        }
        catch (error) {
            console.error('Error fetching options:', error);
        }
    }

    const checkEntryType = (journalEntryType) => {
        if (journalEntryType == "Debit"){
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

    const [ledgerAccount, setLedgerAccount] = useState('Select Account');

    return(
        <div className="homePageOutermostcontainer">
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
                <a href="/Ledger">Ledgers</a>
                <a href="/LoginForm"><button className="logout-other-button" onClick={handleLogout}>LOGOUT</button></a>
                <a>
                   <button className="helpButton" onClick={openHelp}> Help</button>
                </a>
            </div>
            <div className ="main-content">
                <h1>Ledger Main</h1>
                <div> <label> Select Account</label>
                <select className = "sortBySelection" value = {ledgerAccount} onChange={(e) => setLedgerAccount(e.target.value)} defaultValue= "Select Account">
                    {accounts.map((accountName, index) =>(
                        <option key={index} value={accountName}>{accountName}</option>
                    ))}
                </select>
                <button className ="sortBy" onClick={(e) => {fetchJournalEntries(ledgerAccount)}}> Go</button>
                </div>
                {journals.length > 0 ? (
                    <table className="accounts-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {journals.map((journal) => (
                                <tr key={journal.accountName}>
                                    <td>{journal.dateCreated}</td>
                                    <td>{journal.comment}</td>

                                    {checkEntryType(journal) ? (
                                         <td>{journal.amount}</td>
                                            ) : (
                                          <td></td>
                                            )}
                                    {!checkEntryType(journal) ? (
                                        <td>{journal.amount}</td>
                                            ) : (
                                            <td></td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No accounts found.</p>
                )}
            </div>
        </div>
        );
};

export default LedgerOfAccounts;
