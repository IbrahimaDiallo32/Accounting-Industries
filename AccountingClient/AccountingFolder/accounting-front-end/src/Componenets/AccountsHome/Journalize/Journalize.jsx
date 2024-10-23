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
import NewJournalEntry from './NewJournalEntry.jsx'
import { IoMdAdd } from 'react-icons/io';

const Journalize = () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [files, setFiles] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');
    const [isCalandarOpen, setIsCalandarOpen] = useState(false);
    const openCalandar = () => setIsCalandarOpen(true);
    const closeCalandar = () => setIsCalandarOpen(false);

    const [journalEntries, setJournalEntries] = useState([]);
    const [error, setError] = useState('');


    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchJournalEntries = async () => {
        try {
            const response = await axios.get('http://localhost:8080/journal/getAll');
            setJournalEntries(response.data);
        } catch (error) {
            setErrorMessage('Failed to fetch journal entries');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchJournalEntries();
        if (!storedUser) {
            navigate("/", { replace: true });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/loginForm");
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            const accountsData = await axios.get('http://localhost:8080/account');
            setAccounts(accountsData.data);
            return accountsData.data;
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
                    <h1>Journal Entries
                        <button className='createNewAccountButton' onClick={openModal}><IoMdAdd />Create Entry</button>
                        <button className='journalCalendar' onClick={openCalandar}><CiCalendar />Calendar</button>
                    </h1>
                    <Modal isOpen={isCalandarOpen} onClose={closeCalandar}>
                        <CalandarPopUp />
                    </Modal>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <NewJournalEntry />
                    </Modal>
                    <div>
                        {error && <p>{error}</p>}

                        <table className='user-table'>
                            <thead>
                                <tr>
                                    <th>Completed By</th>
                                    <th>Account Name</th>
                                    <th>Amount</th>
                                    <th>Account Type</th>
                                    <th>Entry ID</th>
                                    <th>File URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {journalEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">No journal entries found</td>
                                    </tr>
                                ) : (
                                    journalEntries.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.completedBy}</td>
                                            <td>{entry.accountName}</td>
                                            <td>{entry.amount}</td>
                                            <td>{entry.entryType}</td>
                                            <td>{entry.uniqueID}</td>
                                            <td>
                                                <a href={entry.fileURL} target="_blank" rel="noopener noreferrer">
                                                    View File
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Journalize;
