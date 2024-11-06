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
    const [existingIds, setExistingIds] = useState(new Set());
    const [errorMessage, setErrorMessage] = useState('');
    const [isCalandarOpen, setIsCalandarOpen] = useState(false);
    const openCalandar = () => setIsCalandarOpen(true);
    const closeCalandar = () => setIsCalandarOpen(false);
    const [denyReason, setDenyReason] = useState("");
    const [showDenyBox, setShowDenyBox] = useState(null); // Track which entry's text box is visible


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

    const generateEventId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let eventId;

        do {
            eventId = Array.from({ length: 5 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        } while (existingIds.has(eventId)); // Check uniqueness

        return eventId;
    };

    const dateAndTimeToday = () => {
        const today = new Date();
        const thisMonth = today.getMonth() + 1;
        const thisDate = today.getDate();
        const thisYear = today.getFullYear();
        const date = `${thisMonth}/${thisDate}/${thisYear}`;
        const currentTime = today.toLocaleTimeString("en-US", {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        return date + ", " + currentTime;
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

        const fetchEventLogs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/getAll');
                const ids = response.data.map(event => event.eventID); // Extract event IDs
                setExistingIds(new Set(ids)); // Store IDs in a Set for quick lookup
            } catch (error) {
                console.error('Error fetching event logs:', error);
            }
        };
        fetchEventLogs();

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
            const { uniqueID, completedBy, status, fileURL, comments, journalType } = entry;
            if (!acc[uniqueID]) {
                acc[uniqueID] = {
                    uniqueID,
                    completedBy,
                    status,
                    fileURL,
                    debits: [],
                    credits: [],
                    comments,
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

        try {
            // Log the login event
            const response2 = await axios.post('http://localhost:8080/api/create', {
                username: storedUser.username,
                modifiedBy: fullName,
                eventType: 'Journal Entry Approved',
                dateAndTime: dateAndTimeToday(),
                beforeChange: "Journal Entry was pending",
                afterChange: "Journal Entry is now approved",
                eventID: generateEventId()
            });
        } catch (error) {
            console.error("Error logging event", error);
        }

    }

    const handleDenyEntry = async (uniqueID) => {
        if (!denyReason) {
            alert("Please provide a reason for denying the entry.");
            return;
        }

        //e.preventDefault(); // Prevent page reload on form submission
        console.log(uniqueID)

        try {
            const response = await axios.patch(`http://localhost:8080/journal/updateStatus/${uniqueID}`, { //URL that will create a new account
                status: "Rejected",
                dateRejected: dateToday(),
                reasonForRejection: denyReason,
                rejectedBy: fullName
            });
            window.location.reload();

            alert("Journal entries successfully rejected!"); // Notify user on success
        } catch (error) {
            console.error('Error rejecting journal entries:', error);
            setErrorMessage('An error occurred while rejecting journal entry.');
        }

        try {
            // Log the login event
            const response2 = await axios.post('http://localhost:8080/api/create', {
                username: storedUser.username,
                modifiedBy: fullName,
                eventType: 'Journal Entry Rejected',
                dateAndTime: dateAndTimeToday(),
                beforeChange: "Journal Entry was pending",
                afterChange: "Journal Entry is now rejected",
                eventID: generateEventId()
            });
        } catch (error) {
            console.error("Error logging event", error);
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
                    <a href="/AllJournalEntries">Journalize</a>
                    <a href="/LedgerOfAccounts">Ledger</a>
                    <a href="/Statements">Statements</a>
                    <a href="/EventLog">Event Log</a>
                    <a><button className="logout-other-button" onClick={handleLogout}>Logout</button></a>
                </div>
                <div className="main-content">
                    <h1>Pending Journal Entries
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
                                        <div className="action-buttons">
                                            <button className="approveJournalEntry" onClick={(e) => handleApproveEntry(entryGroup.uniqueID)}>Approve</button>
                                            <button className='denyJournalEntry' onClick={() => setShowDenyBox(entryGroup.uniqueID)}>Deny</button>
                                        </div>
                                        <span>Completed By: {entryGroup.completedBy}</span>
                                        {showDenyBox === entryGroup.uniqueID && (
                                            <div className="deny-reason-box">
                                                <input
                                                    type="text"
                                                    placeholder="Enter reason for denial"
                                                    value={denyReason}
                                                    onChange={(e) => setDenyReason(e.target.value)}
                                                />
                                                <button class='buttonForRejection' onClick={() => handleDenyEntry(entryGroup.uniqueID)}>Submit Reason</button>
                                            </div>
                                        )}
                                        <a href={entryGroup.fileURL} target="_blank" rel="noopener noreferrer">
                                            View File
                                        </a>
                                    </div>
                                    <div className='additional-details'>
                                        <span>Entry Type: {entryGroup.journalType} </span>
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

export default Journalize;
