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
    }, []);

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

    const updateAccountBalance = async (entry, isDebit) => {
        try {
            // Get the current account information
            const accountResponse = await axios.get(`http://localhost:8080/account/GetByAccountName/${entry.accountName}`);
            const account = accountResponse.data;
            console.log("this the accoiunt data: " + account)

            // Calculate the new balance based on the account's normal side
            let newBalance;
            let debitTotal;
            let creditTotal;

            if (account.normalSide === "left") {
                newBalance = account.balance + (isDebit ? entry.amount : -entry.amount);
                debitTotal = account.debit + (isDebit ? entry.amount : 0);
                creditTotal = account.credit + (isDebit ? 0 : entry.amount); // Maintain the existing credit total
            } else {
                newBalance = account.balance + (isDebit ? -entry.amount : entry.amount);
                creditTotal = account.credit + (isDebit ? 0 : entry.amount);
                debitTotal = account.debit + (isDebit ? entry.amount : 0); // Maintain the existing debit total
            }

            console.log("everything before teh API call??")
            // Patch the account with the updated balance, debit, and credit values
            await axios.patch(`http://localhost:8080/account/edit/${account.accountNumber}`, {
                balance: newBalance,
                debit: debitTotal,
                credit: creditTotal
            });

            console.log(`Account ${entry.accountName} updated successfully`);
        } catch (error) {
            console.error("Error updating account balance:", error);
        }
    };

    const handleApproveEntry = async (uniqueID) => {
        try {
            const response = await axios.patch(`http://localhost:8080/journal/updateStatus/${uniqueID}`, { //URL that will create a new account
                status: "Approved",
                dateApproved: dateToday()
            });
            // window.location.reload();

            alert("Journal entries successfully approved!"); // Notify user on success
        } catch (error) {
            console.error('Error approving journal entries:', error);
            setErrorMessage('An error occurred while approving journal entry.');
        }


        const entriesToApprove = journalEntries.filter(entry => entry.uniqueID === uniqueID);

        console.log("Entries to approve:", entriesToApprove);
        if (entriesToApprove.length > 0) {
            // Loop through each entry and handle debits and credits
            for (const entry of entriesToApprove) {
                // Process debits
                for (const debit of entry.debits) {
                    await updateAccountBalance(debit, true);
                }

                // Process credits
                for (const credit of entry.credits) {
                    await updateAccountBalance(credit, false);
                }
            }

            // // Update the state to reflect the approved status
            // const updatedEntries = journalEntries.map(entry =>
            //     entriesToApprove.includes(entry)
            //         ? { ...entry, status: 'approved' } // Mark the status as approved
            //         : entry
            // );
            // setJournalEntries(updatedEntries);

            console.log("Entries approved successfully");
        } else {
            console.error("No entries found for approval with the given uniqueID");
        }



        // Fetch journal entry details to access its debits and credits
        // const response = await axios.get(`http://localhost:8080/journal/getEntry/${uniqueID}`);
        // const journalEntry = response.data;

        // // Loop through debits and credits and update respective accounts
        // const updateAccountBalance = async (entry, isDebit) => {
        //     // Get the current account info
        //     const accountResponse = await axios.get(`http://localhost:8080/account/GetByAccountName/${entry.accountName}`);
        //     const account = accountResponse.data;

        //     // Calculate the new balance based on the account's normal side
        //     let newBalance;
        //     let debitTotal;
        //     let creditTotal;
        //     if (account.normalSide === "Debit") {
        //         newBalance = account.balance + (isDebit ? entry.amount : -entry.amount);
        //         debitTotal = account.debit + entry.amount;
        //     } else {
        //         newBalance = account.balance + (isDebit ? -entry.amount : entry.amount);
        //         creditTotal = account.credit + entry.amount;
        //     }

        //     // Patch the account with the updated balance
        //     await axios.patch(`http://localhost:8080/account/edit/${account.accountNumber}`, {
        //         balance: newBalance,
        //         debit: debitTotal,
        //         credit: creditTotal
        //     });
        // };

        // // Process debits
        // for (const debit of journalEntry.debits) {
        //     await updateAccountBalance(debit, true);
        // }

        // // Process credits
        // for (const credit of journalEntry.credits) {
        //     await updateAccountBalance(credit, false);
        // }

        // // e.preventDefault(); // This prevents the page from reloading when the form is submitted.
        // // //This sends a a post with JSON formatted data to the Backend API via this URL with instructions for handling confugured in Spring boot 
        // // try {
        // //     const response = await axios.patch(`http://localhost:8080/account/edit/${originalAccountNumber}`, { //URL that will edit an account given the original Accountnumner 
        // //         accountName: accountName,
        // //         accountNumber: Number(accountNumber),
        // //         initialBalance: parseFloat(String(initialBalance).replace(/,/g, '')),
        // //         debit: parseFloat(String(debit).replace(/,/g, '')),
        // //         credit: parseFloat(String(credit).replace(/,/g, '')),
        // //         balance: parseFloat(String(balance).replace(/,/g, ''))
        // //     });
        // //     alert("Account successfully edited!"); //notifies user successful
        // //     window.location.reload(true); //refreshes the page so the chages can be realized
        // // } catch (error) {
        // //     console.error('Error updating account:', error.response ? error.response.data : error.message);
        // // }
        console.log("eveything but event log")

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

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/journal/filter-pending?query=${searchTerm}`);
            const entries = Array.isArray(response.data) ? response.data : [];
            const grouped = groupEntriesByID(entries);
            setJournalEntries(grouped);
        } catch (error) {
            setErrorMessage('Failed to fetch journal entries');
            console.error(error);
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
                    {storedUser.accountType === 'Admin' || storedUser.accountType === 'Manager' ? (
                        <a href="/EventLog">Event Log</a>
                    ) : ""}
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
                            <span className='searchJournals' >
                                <input className='journalSearch' onChange={(e) => setSearchTerm(e.target.value)}></input>
                                <button className='jounalButtonTabs' onClick={handleSearch}>Search</button>
                            </span>
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
