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

const ApprovedJournalEntries = () => {
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
                const response = await axios.get('http://localhost:8080/journal/status/Approved');
                const entries = Array.isArray(response.data) ? response.data : [];
                const grouped = groupEntriesByID(entries);
                console.log(response)
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
            const { uniqueID, completedBy, status, fileURL, comments, dateApproved, dateCreated, journalType } = entry;
            if (!acc[uniqueID]) {
                acc[uniqueID] = {
                    uniqueID,
                    completedBy,
                    status,
                    fileURL,
                    debits: [],
                    credits: [],
                    comments,
                    dateApproved,
                    dateCreated,
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
                    <a href="/AllJournalEntries">Journalize</a>
                    <a href="/LedgerOfAccounts">Ledger</a>
                    <a href="/Statements">Statements</a>
                    <a href="/EventLog">Event Log</a>
                    <a><button className="logout-other-button" onClick={handleLogout}>Logout</button></a>
                </div>
                <div className="main-content">
                    <h1>All Journal Entries
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
                                                    <p key={index}>{debit.accountName}: ${debit.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                ))}
                                            </div>
                                            <div className="credits-section">
                                                <h3>Credits</h3>
                                                {entryGroup.credits.map((credit, index) => (
                                                    <p key={index}>{credit.accountName}: ${credit.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">

                                        <span>Completed By: {entryGroup.completedBy}</span>
                                        <a href={entryGroup.fileURL} target="_blank" rel="noopener noreferrer">
                                            View File
                                        </a>
                                    </div>
                                    <div className='additional-details'>
                                        <span>Entry Type: {entryGroup.journalType} </span>
                                        <span>Date Created: {entryGroup.dateCreated} </span>
                                        <span>Date Approved: {entryGroup.dateApproved} </span>
                                        <span>Description/Comments: {entryGroup.comments} </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No journal entries found.</p>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
};

export default ApprovedJournalEntries;
