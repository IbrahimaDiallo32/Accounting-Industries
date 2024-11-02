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

const RejectedJournals = () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [isCalandarOpen, setIsCalandarOpen] = useState(false);
    const openCalandar = () => setIsCalandarOpen(true);
    const closeCalandar = () => setIsCalandarOpen(false);

    const [journalEntries, setJournalEntries] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/loginForm");
    };

    useEffect(() => {
        const fetchJournalEntries = async () => {
            try {
                const response = await axios.get('http://localhost:8080/journal/status/Rejected');
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


    const groupEntriesByID = (entries) => {
        const groupedEntries = entries.reduce((acc, entry) => {
            const { uniqueID, completedBy, status, fileURL, dateCreated, dateRejected, rejectedBy, reasonForRejection, journalType } = entry; // Include additional fields
            if (!acc[uniqueID]) {
                acc[uniqueID] = {
                    uniqueID,
                    completedBy,
                    status,
                    fileURL,
                    dateCreated,
                    dateRejected,
                    rejectedBy,
                    reasonForRejection,
                    debits: [],
                    credits: [],
                    journalType
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
                    <h1>Rejected Journal Entries
                        <button className='createNewAccountButton' onClick={openModal}><IoMdAdd />Create Entry</button>
                        <button className='journalCalendar' onClick={openCalandar}><CiCalendar />Calendar</button>
                        <div className='JournalTabs'>
                            <button className='jounalButtonTabs' ><a href='/AllJournalEntries'>All Entries</a></button>
                            <button className='jounalButtonTabs' ><a href='/PendingJournalEntries'>Pending Entries</a></button>
                            <button className='jounalButtonTabs' ><a href='/ApprovedJournalEntries'>Approved Entries</a></button>
                            <button className='jounalButtonTabs' ><a href='/RejectedJournals'>Rejected Entries </a></button>
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
                            journalEntries.map((entryGroup) => {
                                console.log(entryGroup); // Log each entryGroup here
                                return (
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

                                        <div className="rejected-card-footer">
                                            <div className="footer-details">
                                                <span>Completed By: {entryGroup.completedBy}</span>
                                                <a href={entryGroup.fileURL} target="_blank" rel="noopener noreferrer">
                                                    View File
                                                </a>
                                            </div>

                                            <div className="additional-details">
                                                <span>Entry type: {entryGroup.journalType}</span>
                                                <span>Created Date: {entryGroup.dateCreated}</span>
                                                <span>Date Rejected: {entryGroup.dateRejected}</span>
                                                <span>Rejected By: {entryGroup.rejectedBy}</span>
                                                <span>Reason for Rejection: {entryGroup.reasonForRejection || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No journal entries found.</p>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
};

export default RejectedJournals;
