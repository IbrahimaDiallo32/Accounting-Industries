import './Journalize.css';
import Avatar from '../../Assets/Avatar.jsx';
import 'reactjs-popup/dist/index.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCalendar } from "react-icons/ci";
import CalandarPopUp from '../../Modal/CalandarPopUp.jsx';
import Modal from '../../Modal/Modal.jsx';
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5';
import { FaMinusCircle } from "react-icons/fa";

const NewJournalEntry = () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const username = storedUser.username;
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [description, setDescription] = useState([]);
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState("");
    const [journalType, setJournaType] = useState("Regular Entry");
    const initialEntryState = [{ account: 'NULL', amount: '0.00' }];
    const [files, setFiles] = useState([]);
    const [debitEntries, setDebitEntries] = useState([{ account: 'NULL', amount: '0.00' }]);
    const [creditEntries, setCreditEntries] = useState([{ account: 'NULL', amount: '0.00' }]);

    const [existingIds, setExistingIds] = useState(new Set());
    const [errorMessage, setErrorMessage] = useState('');

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
        setDebitEntries(initialEntryState); // Reset debit entries to initial state
        setCreditEntries(initialEntryState); // Reset credit entries to initial state
        // setAccounts(fetchAccounts()); // Clear selected accounts
        setErrorMessage(''); // Clear error message
        setDescription('');
    };

    const handleRemoveEntry = (type, index) => {
        if (type === 'debit') {
            setDebitEntries(debitEntries.filter((_, i) => i !== index));
        } else if (type === 'credit') {
            setCreditEntries(creditEntries.filter((_, i) => i !== index));
        }
    };

    const handleDebitChange = (index, field, value) => {
        const newEntries = [...debitEntries];
        newEntries[index][field] = value.replace(/,/g, ''); // Store value without commas
        setDebitEntries(newEntries);
    };

    const handleCreditChange = (index, field, value) => {
        const newEntries = [...creditEntries];
        newEntries[index][field] = value.replace(/,/g, ''); // Store value without commas
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
        // const updatedDebitAccounts = debitEntries.filter(entry => entry.account !== accountNameToRemove);
        // setAccounts(updatedDebitAccounts);

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

    const calculateSum = (entries) => {
        return entries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0);
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const dateToday = () => {
        const today = new Date();
        const thisMonth = today.getMonth() + 1;
        const thisDate = today.getDate();
        const thisYear = today.getFullYear();
        return `${thisMonth}/${thisDate}/${thisYear}`;
    };
    const date = dateToday();

    const creditEqualDebit = () => {
        const debitSum = calculateSum(debitEntries);
        const creditSum = calculateSum(creditEntries);
        return debitSum === creditSum;
    };

    const handleSubmitEntry = async (e) => {

        e.preventDefault(); // Prevent page reload on form submission

        const debitSum = calculateSum(debitEntries);
        const creditSum = calculateSum(creditEntries);

        if (debitEntries.some((entry) => entry.account === 'NULL' || entry.amount === '0.00' || entry.amount === '') || creditEntries.some((entry) => entry.account === 'NULL' || entry.amount === '0.00' || entry.amount === '')) {
            alert('One of your entries is empty. Please fill in order to submit.')
            return;
        }

        if (!creditEqualDebit()) {
            alert('Credits and debits must be equal!')
            setErrorMessage('Credits and debits must be equal');
            console.log(errorMessage);
            return false; // Stop submission if credits and debits are not equal
        }

        const journalEntries = [
            ...debitEntries.map(entry => ({
                ...entry, entryType: 'Debit', amount: parseFloat(entry.amount).toFixed(2)
            })),
            ...creditEntries.map(entry => ({
                ...entry, entryType: 'Credit', amount: parseFloat(entry.amount).toFixed(2)
            }))
        ];


        setErrorMessage(''); // Clear any existing error message

        // Combine debit and credit entries into one array

        try {
            // Loop through each journal entry and post individually
            for (const entry of journalEntries) {
                await axios.post('http://localhost:8080/journal/create', {
                    accountName: entry.account,
                    amount: entry.amount,
                    entryType: entry.entryType,
                    dateCreated: date,
                    completedBy: fullName,
                    uniqueID: uniqueID,
                    status: "Pending",
                    description: description,
                    journalType: journalType
                });
            }

            alert("Journal entries successfully posted!"); // Notify user on success
        } catch (error) {
            console.error('Error creating journal entries:', error);
            setErrorMessage('An error occurred while creating journal entries.');
        }
        const newEventID = generateEventId();
        const afterChangeString = fullName + " (" + username + ") created a new journal entry ID: " + uniqueID;
        try {
            const response2 = await axios.post('http://localhost:8080/api/create', {
                username: username,
                modifiedBy: fullName,
                eventType: 'New Journal Entry',
                dateAndTime: dateAndTimeToday(),
                beforeChange: "~",
                afterChange: afterChangeString,
                eventID: newEventID
            });
        } catch (error) {
            console.error("Error logging event", error);
        }
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

    const generateEventId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let eventId;

        do {
            eventId = Array.from({ length: 5 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        } while (existingIds.has(eventId)); // Check uniqueness

        return eventId;
    };

    const getSelectedAccounts = () => {
        // Collect all selected accounts from both debits and credits
        return [
            ...debitEntries.map(entry => entry.account),
            ...creditEntries.map(entry => entry.account)
        ];
    };

    const getNextAvailableId = () => {
        let currentId = localStorage.getItem('journalIdCounter');
        const exceededCounter = 0;

        if (!currentId) {
            currentId = 1; // Start at 1 for the first entry if it doesnt exisit
        } else {
            currentId = parseInt(currentId, 10); // Parse ID from localStorage
        }

        // Making sure the ID doesnt exceed 5 digits in length 
        const maxId = 99999;
        let uniqueId = currentId;
        let hasWrapped = false;
        while (entries.find(entry => entry.id === uniqueId)) {
            uniqueId++;

            // Reset to a counter starting at 1 if maxId is exceeded in order to continue searching
            if (uniqueId > maxId) {
                if (hasWrapped) {
                    console.warn("All possible IDs are taken. Consider clearing old entries.");
                    exceededCounter++;
                    break;
                }
                uniqueId = exceededCounter;
                hasWrapped = true; // Indicate we've wrapped around once
            }
        }

        // Save the next ID in localStorage for future entries
        localStorage.setItem('journalIdCounter', uniqueId + 1);
        return uniqueId;
    };


    const uniqueID = getNextAvailableId();

    useEffect(() => {
        console.log(date);
        const fetchAccounts = async () => {
            const accountsData = await axios.get('http://localhost:8080/account');
            setAccounts(accountsData.data);
            return accountsData.data;
        };
        fetchAccounts();
    }, []);

    return (
        <div className='RegistrationContainer'>
            <header className='logoForRegistration'>
                <button className='backButtonRegistration'><IoArrowBack /><a href="/Journalize">BACK</a></button>
                <div className='shiftForRegis'>
                    <img src="/AIT.PNG" width={100} height={100} alt="Logo" className='shiftForRegistation' />
                    <h2 className='registerText'>Journal Entry</h2>
                    <img src="/AIT.PNG" width={100} height={100} className='regLogo2' alt="Logo" />
                </div>
            </header>
            <hr className='solidLineRegister' />
            <div className="registrationInnerContainer">
                <form className='RegForm'>
                    <div className='inlineHeaderElements'>
                        <button type="button" className='journalCalendar' onClick={handleClearForm}>Clear Entries</button>
                        {/* <label className='entryLabel'>Type of Entry:</label> */}
                        Entry Type<select className='typeOfEntry' onChange={(e) => setJournaType(e.target.value)}>Journal Type
                            <option>Regular Entry</option>
                            <option>Adjusting Entry</option>
                        </select>
                    </div>

                    <h3>Debits:</h3>
                    {debitEntries.map((entry, index) => (
                        <div key={index}>
                            <select
                                value={entry.account}
                                onChange={(e) => handleDebitChange(index, 'account', e.target.value)}
                            >
                                <option value="">Select Account</option>
                                {accounts
                                    .filter(account =>
                                        !getSelectedAccounts().includes(account.accountName) ||
                                        account.accountName === entry.account // Ensure selected account remains visible
                                    )
                                    .map((account, i) => (
                                        <option key={i} value={account.accountName}>
                                            {account.accountName}
                                        </option>
                                    ))}
                            </select>
                            $ <input
                                type="text"
                                value={entry.amount}
                                // onChange={(e) => handleDebitChange(index, 'amount', e.target.value)}
                                onChange={(e) => handleDebitChange(index, 'amount', e.target.value)}
                                onBlur={(e) => {

                                    let value = parseFloat(e.target.value.replace(/,/g, '')).toFixed(2); // Remove commas and ensure 2 decimals

                                    if (!isNaN(value)) {

                                        const updatedEntries = [...debitEntries];

                                        updatedEntries[index].amount = value; // Set formatted value in the state

                                        setDebitEntries(updatedEntries);

                                    }

                                }}



                                onFocus={(e) => {

                                    e.target.value = e.target.value.replace(/,/g, ''); // Remove commas for editing

                                }}
                            />

                            {index > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveEntry('debit', index)}
                                    className="removeEntryButton"
                                >
                                    <FaMinusCircle />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="removeEntryPlaceholder"
                                    aria-hidden="true"
                                ><FaMinusCircle /></button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddDebitEntry} className='addEntryButton'>Add Entry</button>

                    <h3>Credits:</h3>
                    {creditEntries.map((entry, index) => (
                        <div key={index} className="journalizeField">
                            <select
                                className="registrationInput"
                                value={entry.account}
                                onChange={(e) => handleCreditChange(index, 'account', e.target.value)}
                            >
                                <option value="">Select Account</option>
                                {accounts
                                    .filter(account =>
                                        !getSelectedAccounts().includes(account.accountName) ||
                                        account.accountName === entry.account // Ensure selected account remains visible
                                    )
                                    .map((account, i) => (
                                        <option key={i} value={account.accountName}>
                                            {account.accountName}
                                        </option>
                                    ))}
                            </select>
                            $ <input
                                placeholder='Amount' value={entry.amount}
                                onChange={(e) => handleCreditChange(index, 'amount', e.target.value)}
                                onBlur={(e) => {
                                    let value = parseFloat(e.target.value.replace(/,/g, '')).toFixed(2); // Remove commas and ensure 2 decimals
                                    if (!isNaN(value)) {
                                        const updatedEntries = [...creditEntries];
                                        updatedEntries[index].amount = value; // Set formatted value in the state
                                        setCreditEntries(updatedEntries);
                                    }
                                }}
                                onFocus={(e) => { e.target.value = e.target.value.replace(/,/g, ''); }}
                            />
                            {index > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveEntry('credit', index)}
                                    className="removeEntryButton"
                                >
                                    <FaMinusCircle />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="removeEntryPlaceholder"
                                    aria-hidden="true"
                                ><FaMinusCircle /></button>
                            )}
                        </div>
                    ))}
                    <button type="button" className='addEntryButton' onClick={handleAddCreditEntry}>Add Entry</button>
                    <div>
                        <h5 className='space'>Description/Comments</h5>
                        <input type='text' className='journalCommentBox' onChange={(e) => setDescription(e.target.value)}></input>
                    </div>
                    <div>
                        <input className='insertDouments' type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png" multiple onChange={handleFileChange} />
                    </div>
                    <div>
                        <button type="button" className='CreateNewJournalButton' onClick={handleSubmitEntry}>Submit entry</button>
                        {errorMessage && (
                            <p style={{ color: 'red' }}>{errorMessage}</p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewJournalEntry;
