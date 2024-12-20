import React from 'react';
import './Accounts.css';
import Avatar from '../Assets/Avatar';
import { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';


const CreateAccount = () => {

    //all variables match from MongoDB 
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const storedUsername = storedUser.username;
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountDescription, setAccountDescription] = useState('');
    const [normalSide, setNormalSide] = useState('');
    const [accountCategory, setAccountCategory] = useState('');
    const [balance, setBalance] = useState('');
    const [accountSubCategory, setAccountSubCategory] = useState('');
    const [initialBalance, setInitialBalance] = useState('');
    const [debit, setDebit] = useState('');
    const [credit, setCredit] = useState('');
    const [order, setOrder] = useState('');
    const [statement, setStatement] = useState('');
    const [comment, setComment] = useState('');
    const [existingAccounts, setExistingAccounts] = useState([]);
    const [existingIds, setExistingIds] = useState(new Set());

    const clearForm = () => {
        setAccountName('');
        setAccountNumber('');
        setAccountDescription('');
        setNormalSide('');
        setAccountCategory('');
        setBalance('');
        setAccountSubCategory('');
        setInitialBalance('');
        setDebit('');
        setCredit('');
        setOrder('');
        setStatement('');
        setComment('');
    };

    const IsFormValid = () => {
        return (
            accountCategory &&
            accountDescription && accountName && accountNumber
            && accountSubCategory && debit && credit && initialBalance
            && balance
        );
    };
    useEffect(() => {
        // Fetch existing accounts when the component mounts to capture all data 
        const fetchAccounts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/account'); // Adjust URL as necessary
                setExistingAccounts(response.data);
                console.log('Existing accounts:', response.data); // Add this line
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };
        fetchAccounts();

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
    }, []);

    //Responsible for checking to see if there is either a duplicate Name or Number before the account is created
    const isDuplicate = (name, number) => {
        return existingAccounts.some(account =>
            account.accountName.trim() === name.trim() ||
            String(account.accountNumber).trim() === String(number).trim()
        );
    };
    //added trim so that no leading spaces interfere with the values for proper checking

    const handleSubmit = async (e) => {
        e.preventDefault(); // This prevents the page from reloading when the form is submitted.
        //This sends a a post with JSON formatted data to the Backend API via this URL with instructions for handling confugured in Spring boot 
        console.log("the form submitted")
        console.log("initial balance:" + initialBalance)
        console.log("balance" + balance);
        console.log("debit" + debit);
        console.log("credit" + credit);

        if (isDuplicate(accountName, accountNumber)) {
            alert('Duplicate account name or number detected. Please use unique values.');
            return; // Exit early if duplicate is found
        }
        console.log('Existing accounts:', existingAccounts);
        try {
            const response = await axios.post('http://localhost:8080/account/create', { //URL that will create a new account
                accountName,
                accountNumber: Number(accountNumber),
                accountDescription,
                normalSide,
                order,
                accountCategory,
                accountSubCategory,
                statement,
                initialBalance: parseFloat(initialBalance.replace(/,/g, '')), //parses to float because this is what the databse is expecting
                debit: parseFloat(debit.replace(/,/g, '')), //these were originally strings for easier formatting with automatic commas and decimals
                credit: parseFloat(credit.replace(/,/g, '')),
                balance: parseFloat(balance.replace(/,/g, '')),
                comment
            });
            alert("Account created!"); //notifies user successful
            clearForm(); //clears data if account successfully created
        } catch (error) {
            console.error('Error creating account:', error);
        }

        const afterChangeString = fullName + " (" + storedUsername + ") created a new account with the Account name of: " + accountName;
        try {
            // Log the user creation event
            const response2 = await axios.post('http://localhost:8080/api/create', {
                username: storedUsername,
                modifiedBy: fullName,
                eventType: 'Account Created',
                dateAndTime: dateAndTimeToday(),
                beforeChange: "~",
                afterChange: afterChangeString,
                eventID: generateEventId()
            });
        } catch (error) {
            console.error("Error logging event", error);
        }
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

    return (
        <div className='RegistrationContainer'>
            <header className='logoForRegistration'>
                <a href="/Accounts"><button className='backButtonRegistration'><IoArrowBack />BACK</button></a>
                <div className='shiftForRegis'>
                    <img src="/AIT.PNG" width={100} height={100} alt="Logo" className='shiftForRegistation' />
                    <h2 className='registerText'>New Account</h2>
                    <img src="/AIT.PNG" width={100} height={100} className='regLogo2' alt="Logo" />
                </div>
            </header>

            <hr className='solidLineRegister' />

            <div className='registrationInnerContainer'>
                <form onSubmit={handleSubmit} className='RegForm'>
                    <fieldset>
                        <div className='Field'>
                            <label>Account name<sup>*</sup></label>
                            <input value={accountName} className='registrationInput'
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder='e.g (Cash)' />
                        </div>
                        <div className='Field'>
                            <label>Account Number <sup>*</sup></label>
                            <input value={accountNumber} className='registrationInput'
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder='e.g (1001)' type='number' onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }} />
                        </div>
                        <div className='Field'>
                            <label>Account Description <sup>*</sup></label>
                            <input value={accountDescription} className='registrationInput'
                                onChange={(e) => setAccountDescription(e.target.value)}
                                placeholder='Account Description e.g (Main cash account)' />
                        </div>
                        <div className='Field'>
                            <label>Normal Side <sup>*</sup></label>
                            <select className='dateOfBirthRegistration' value={normalSide}
                                onChange={(e) => setNormalSide(e.target.value)}>
                                <option value="Left">Left</option>
                                <option value="Right">Right</option>
                            </select>
                        </div>
                        <div className='Field'>
                            <label>Order<sup>*</sup></label>
                            <input value={order} className='registrationInput'
                                onChange={(e) => setOrder(e.target.value)}
                                placeholder='Order # (e.g cash can be 01)' type='number' />

                        </div>
                        <div className='Field'>
                            <label className='birthDateTextField'>Account Category<sup>*</sup></label>
                            <select className='dateOfBirthRegistration' value={accountCategory}
                                onChange={(e) => setAccountCategory(e.target.value)}>
                                <option value="Asset">Asset</option>
                                <option value="Liability">Liability</option>
                                <option value="Equity">Equity</option>
                                <option value="Expense">Expense</option>
                                <option value="Revenue">Revenue</option>
                            </select>
                        </div>
                        <div className='Field'>
                            <label>Sub-Category<sup>*</sup></label>
                            <select className='registrationInput' value={accountSubCategory}
                                onChange={(e) => setAccountSubCategory(e.target.value)} placeholder='e.g (current assets)'>
                                <option value="Current Asset">Current Asset</option>
                                <option value="Long-Term Asset">Long-Term Asset</option>
                                <option value="Current Liability">Current Liability</option>
                                <option value="Long-Term Asset">Long-Term Asset</option>
                            </select>
                        </div>
                        <div className='Field'>
                            <label className='birthDateTextField'>Statement<sup>*</sup></label>
                            <select name="birthDate" className='dateOfBirthRegistration' value={statement}
                                onChange={(e) => setStatement(e.target.value)} >
                                <option value="Income statement">Income statement</option>
                                <option value="Balance sheet">Balance sheet</option>
                                <option value="Retained Earnings statement">Retained Earnings statement</option>
                            </select>
                            <input placeholder='' hidden></input>
                        </div>
                        <div className='Field'>
                            <label>Initial Balance<sup>*</sup></label>
                            <input value={initialBalance} className='registrationInput'
                                placeholder='0.00' type='text'
                                onChange={(e) => {
                                    setInitialBalance(e.target.value.replace(/,/g, '')); // This removes commas to save the number in the database accurately
                                }}
                                onBlur={(e) => { //OnBlur activates the code when the user leaves the input box
                                    let value = parseFloat(e.target.value).toFixed(2); // Format to two decimal places when the user leaves the input box 
                                    if (!isNaN(value)) {
                                        // Add commas and ensure two decimal places are shown
                                        value = new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(value);
                                        setInitialBalance(value); // Set formatted value with commas and two decimals
                                    }
                                }}
                                onFocus={(e) => { //onFocus activates the code when the user is actively present in the component/input box
                                    setInitialBalance(e.target.value.replace(/,/g, '')); // This removes commas when the user is typing
                                }}
                            />
                        </div>
                        <div className='passwordFieldRegistration'>
                            <label>Debit<sup>*</sup></label>
                            <input value={debit} className='registrationInput'
                                placeholder="0.00" type='text' onChange={(e) => {
                                    setDebit(e.target.value.replace(/,/g, ''));
                                }}
                                onBlur={(e) => {
                                    let value = parseFloat(e.target.value).toFixed(2);
                                    if (!isNaN(value)) {
                                        value = new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(value);
                                        setDebit(value);
                                    }
                                }}
                                onFocus={(e) => {
                                    setDebit(e.target.value.replace(/,/g, ''));
                                }} />
                        </div>
                        <div className='Field'>
                            <label>Credit<sup>*</sup></label>
                            <input className="registrationInput" placeholder="0.00" type='text'
                                value={credit} onChange={(e) => {
                                    setCredit(e.target.value.replace(/,/g, ''));
                                }}
                                onBlur={(e) => {
                                    let value = parseFloat(e.target.value).toFixed(2);
                                    if (!isNaN(value)) {
                                        value = new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(value);
                                        setCredit(value);
                                    }
                                }}
                                onFocus={(e) => {
                                    setCredit(e.target.value.replace(/,/g, ''));
                                }} />
                        </div>
                        <div className='Field'>
                            <label>Balance <sup>*</sup></label>
                            <input className="registrationInput" value={balance} placeholder='0.00' type='text'
                                onChange={(e) => {
                                    setBalance(e.target.value.replace(/,/g, ''));
                                }}
                                onBlur={(e) => {
                                    let value = parseFloat(e.target.value).toFixed(2);
                                    if (!isNaN(value)) {
                                        value = new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(value);
                                        setBalance(value);
                                    }
                                }}
                                onFocus={(e) => {
                                    setBalance(e.target.value.replace(/,/g, ''));
                                }} />
                        </div>
                        <div className='Field'>
                            <label>Comment</label>
                            <input className="registrationInput" value={comment}
                                onChange={(e) => setComment(e.target.value)} placeholder='Comment' />
                        </div>
                        <button disabled={!IsFormValid()} type="submit" className='RegistrationButton'>Create Account</button>
                    </fieldset>
                </form>
            </div>
        </div >
    );
};

export default CreateAccount;
