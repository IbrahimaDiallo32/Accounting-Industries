import './Journalize.css';
import Avatar from '../../Assets/Avatar.jsx';
import 'reactjs-popup/dist/index.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCalendar } from "react-icons/ci";
import CalandarPopUp from '../../Modal/CalandarPopUp.jsx';
import Modal from '../../Modal/Modal.jsx'
import axios from 'axios';
import NewJournalEntry from './NewJournalEntry.jsx'
import { IoMdAdd } from 'react-icons/io';

const Journalize = () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [isCalandarOpen, setIsCalandarOpen] = useState(false);
    const openCalandar = () => setIsCalandarOpen(true);
    const closeCalandar = () => setIsCalandarOpen(false);

    const toggleCalendar = () => {
        setIsCalandarOpen(!isCalandarOpen);
    };


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

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/loginForm");
    };

    useEffect(() => {
        const fetchJournalEntries = async () => {
            try {
                const response = await axios.get('http://localhost:8080/journal/status/Pending');
                const entries = Array.isArray(response.data) ? response.data : [];
                const grouped = groupEntriesByID(entries);
                setJournalEntries(grouped);
            } catch (error) {
                setErrorMessage('Failed to fetch journal entries');
                console.error(error);
            }
        };
        fetchJournalEntries();

        if (!storedUser) {
            navigate("/", { replace: true });
        }
    }, [storedUser, navigate]);

    const dateToday = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        const currentDate = month + "/" + date + "/" + year;
        return currentDate;
    };


    const groupEntriesByID = (entries) => {
        const groupedEntries = entries.reduce((acc, entry) => {
            const { uniqueID, completedBy, status, fileURL } = entry;
            if (!acc[uniqueID]) {
                acc[uniqueID] = {
                    uniqueID,
                    completedBy,
                    status,
                    fileURL,
                    debits: [],
                    credits: []
                };
            }
            if (entry.entryType === 'Debit') {
                acc[uniqueID].debits.push(entry);
            } else if (entry.entryType === 'Credit') {
                acc[uniqueID].credits.push(entry);
            }
            return acc;
        }, {});
        return Object.values(groupedEntries);
    };

    const handleApproveEntry = async (uniqueID) => {

        console.log(uniqueID)

        try {
            const response = await axios.patch(`http://localhost:8080/journal/updateStatus/${uniqueID}`, { //URL that will create a new account
                status: "Approved",
                dateApproved: dateToday()
            });
            window.location.reload();

            alert("Journal entries successfully approved!"); // Notify user on success
        } catch (error) {
            console.error('Error approving journal entries:', error);
            setErrorMessage('An error occurred while approving journal entry.');
        }
    }

    const handleDenyEntry = async (uniqueID) => {

        //e.preventDefault(); // Prevent page reload on form submission
        console.log(uniqueID)

        try {
            const response = await axios.patch(`http://localhost:8080/journal/updateStatus/${uniqueID}`, { //URL that will create a new account
                status: "Rejected",
                dateRejected: dateToday()
            });
            window.location.reload();

            alert("Journal entries successfully rejected!"); // Notify user on success
        } catch (error) {
            console.error('Error rejecting journal entries:', error);
            setErrorMessage('An error occurred while rejecting journal entry.');
        }
    }

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
                    <a href="/LedgerOfAccounts">Ledger</a>
                    <a href="/EventLog">Event Log</a>
                    <a><button className="logout-other-button" onClick={handleLogout}>Logout</button></a>
                </div>
                <div className="main-content">
                    <h1>Journal Entries
                        <button className='createNewAccountButton' onClick={openModal}><IoMdAdd />Create Entry</button>
                        <button className='journalCalendar' onClick={openCalandar}><CiCalendar />Calendar</button>
                        <div className='JournalTabs'>
                            <button className='jounalButtonTabs' onClick={openCalandar}>All Entries</button>
                            <button className='jounalButtonTabs' onClick={openCalandar}>Pending Entries</button>
                            <button className='jounalButtonTabs' onClick={openCalandar}>Approved Entries</button>
                            <button className='jounalButtonTabs'><a href='/RejectedJournals'>Rejected Entries </a></button>
                        </div>
                    </h1>
                    <Modal isOpen={isCalandarOpen} onClose={closeCalandar}>
                        <CalandarPopUp />
                    </Modal>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <NewJournalEntry />
                    </Modal>


                    <div className="journal-entry-cards">
                        {journalEntries && journalEntries.length > 0 ? (
                            journalEntries.map((entryGroup) => (
                                <div key={entryGroup.uniqueID} className="journal-card">
                                    <div className="card-header">
                                        <span>Entry ID: {entryGroup.uniqueID}</span>
                                        <span>Status: {entryGroup.status}</span>
                                    </div>
                                    <div className="card-content">
                                        <div className="debits-credits-container">
                                            <div className="debits-section">
                                                <h3>Debits</h3>
                                                {entryGroup.debits.map((debit, index) => (
                                                    <p key={index}>{debit.accountName}: ${debit.amount}</p>
                                                ))}
                                            </div>
                                            <div className="credits-section">
                                                <h3>Credits</h3>
                                                {entryGroup.credits.map((credit, index) => (
                                                    <p key={index}>{credit.accountName}: ${credit.amount}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="action-buttons">
                                            <button className="approveJournalEntry" onClick={(e) => handleApproveEntry(entryGroup.uniqueID)}>Approve</button>
                                            <button className='denyJournalEntry' onClick={(e) => handleDenyEntry(entryGroup.uniqueID)}>Deny</button>
                                        </div>
                                        <span>Completed By: {entryGroup.completedBy}</span>
                                        <a href={entryGroup.fileURL} target="_blank" rel="noopener noreferrer">
                                            View File
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No journal entries found.</p>
                        )}
                    </div>




                    {/* <div>
                        {error && <p>{error}</p>}

                        <table className='user-table'>
                            <thead>
                                <tr>
                                    <th>Completed By</th>
                                    <th>Account Name</th>
                                    <th>Amount</th>
                                    <th>Account Type</th>
                                    <th>Entry ID</th>
                                    <th>Status</th>
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
                                            <td>{entry.status}</td>
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
                    </div> */}
                </div >
            </div >
        </div >
    );
};

export default Journalize;