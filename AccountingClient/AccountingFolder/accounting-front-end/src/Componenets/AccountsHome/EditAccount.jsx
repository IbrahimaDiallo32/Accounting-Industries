import React from 'react';
import './Accounts.css';
import Avatar from '../Assets/Avatar';
import { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';
import CreateAccount from './CreateAccount';

const EditAccount = ({ account }) => {

    const originalAccountNumber = account.accountNumber;
    //all variables match from MongoDB 
    const [accountName, setAccountName] = useState(account?.accountName || '');
    const [accountNumber, setAccountNumber] = useState(account?.accountNumber || '');
    const [accountDescription, setAccountDescription] = useState(account?.accountDescription || '');
    const [normalSide, setNormalSide] = useState(account?.normalSide || '');
    const [accountCategory, setAccountCategory] = useState(account?.accountCategory || '');
    const [balance, setBalance] = useState(account?.balance || '');
    const [accountSubCategory, setAccountSubCategory] = useState(account?.accountSubCategory || '');
    const [initialBalance, setInitialBalance] = useState(account?.initialBalance || '');
    const [debit, setDebit] = useState(account?.debit || '');
    const [credit, setCredit] = useState(account?.credit || '');
    const [order, setOrder] = useState(account?.order || '');
    const [statement, setStatement] = useState(account?.statement || '');
    const [comment, setComment] = useState(account?.comment || '');

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

    const handleSubmit = async (e) => {
        e.preventDefault(); // This prevents the page from reloading when the form is submitted.
        //This sends a a post with JSON formatted data to the Backend API via this URL with instructions for handling confugured in Spring boot 
        try {
            console.log("OG" + originalAccountNumber);
            console.log("reg" + accountNumber);

            console.log(order)
            const response = await axios.patch(`http://localhost:8080/account/edit/${originalAccountNumber}`, { //URL that will edit an account given the original Accountnumner 
                accountName: accountName,
                accountNumber: Number(accountNumber),
                accountDescription: accountDescription,
                normalSide: normalSide,
                order: Number(order), // Ensure this is a number
                accountCategory: accountCategory,
                accountSubCategory: accountSubCategory,
                initialBalance: parseFloat(String(initialBalance).replace(/,/g, '')),
                debit: parseFloat(String(debit).replace(/,/g, '')),
                credit: parseFloat(String(credit).replace(/,/g, '')),
                balance: parseFloat(String(balance).replace(/,/g, '')),
                statement: statement,
                comment: comment
            });
            alert("Account successfully edited!"); //notifies user successful
            clearForm(); //clears data if account successfully created
            window.location.reload(true); //refreshes the page so the chages can be realized
        } catch (error) {
            console.error('Error updating account:', error.response ? error.response.data : error.message);
        }
        try {
            const response = await axios.put(`/api/users/${userId}`, {
                username,
            
            });
            console.log(response.data); // Handle successful update
        } catch (error) {
            console.error('Update error:', error.response ? error.response.data : error);
        }

    };

    useEffect(() => {
    }, [accountDescription]); // Dependency array, triggers when accountDescription changes



    return (
        <div className='RegistrationContainer'>
            <header className='logoForRegistration'>
                <a href="/Accounts"><button className='backButtonRegistration'><IoArrowBack />BACK</button></a>
                <div className='shiftForRegis'>
                    <img src="/AIT.PNG" width={100} height={100} alt="Logo" className='shiftForRegistation' />
                    <h2 className='registerText'>Edit Account</h2>
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
                                <option value="Expense">Equity</option>
                            </select>
                        </div>
                        <div className='Field'>
                            <label>Sub-Category <sup>*</sup></label>
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
                        <button disabled={!IsFormValid()} type="submit" className='RegistrationButton'>Save Changes</button>
                    </fieldset>
                </form>
            </div>
        </div >
    );
};

export default EditAccount;
