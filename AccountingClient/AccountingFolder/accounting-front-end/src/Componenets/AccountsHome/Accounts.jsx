import React from 'react';
import './Accounts.css';
import { RxAvatar } from "react-icons/rx";
import Avatar from '../Assets/Avatar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateAccount from './CreateAccount';
import AccountsHelp from './AccountsHelp'
import Modal from '../Modal/Modal';
import { IoMdAdd } from 'react-icons/io';
import EditAccount from './EditAccount';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Accounts = () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();
    const [selectedAccount, setSelectedAccount] = useState(null); // Track the user to edit so that informatoin can be autopopulated later on
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [sortByType, setSortByType] = useState('sort');
    const [order, setOrder] = useState('order');
    const [accounts, setAccounts] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAccount(null); // This resets the selected account when closing the modal component
    };

    const openHelp = () => setIsHelpOpen(true);
    const closeHelp = () => setIsHelpOpen(false);

    const openEditModal = (account) => {
        setSelectedAccount(account); // Set the account to be edited
        setIsModalOpen(true);
    };

    const sortedAccount = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/account/${sortByType}${order}`);
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching accounts", error);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {  //filtering for the search term
        try {
            const response = await axios.get(`http://localhost:8080/account/filter?query=${searchTerm}`);
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching search results', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser"); // Clear user data
        navigate("/loginForm"); // Redirect to login
    };


    useEffect(() => {
        if (!storedUser) { //if no one is logged it, it automatically navigates back to login page
            navigate("/", { replace: true });
        }

        const fetchAccounts = async () => {
            const accountsData = await axios.get('http://localhost:8080/account');
            setAccounts(accountsData.data); // capture the data returned from the API call into 'accounts'
        };

        fetchAccounts();
    }, []);
    const saveSelectedAccount = (account) => {
        console.log("Saving to localStorage:", account); // Log to confirm saving
        localStorage.setItem("currentAccount", account);
    }

    const username = "Ibrahima Diallo";

    return (
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
                <a>
                    <button className="helpButton" onClick={openHelp}> Help</button>
                </a>
                <a><button className="logout-other-button" onClick={handleLogout}>Logout</button></a>
            </div>


            <Modal isOpen={isHelpOpen} onClose={closeHelp}>
                <AccountsHelp />
            </Modal>
            <div className="main-content">
                <h1>Chart Of Accounts
                    {storedUser.accountType == 'Admin' || storedUser.accountType == 'Manager' ? (
                        <button className='createNewAccountButton' onClick={openModal} title="Create a new Account"><IoMdAdd />Account</button>
                    ) : (
                        <h1 />
                    )}
                </h1>
                <div className='sortByContainer'>
                    <div className='sortBy'>
                        <label className='sortByTextField'>Sort By</label>
                        <select name="Sort By" className='sortBySelection' value={sortByType} // Sort the data by variable
                            onChange={(e) => setSortByType(e.target.value)}>
                            <option value="sort" disabled>Select Sort by Type</option>
                            <option value="accountNumber">Account Number</option>
                            <option value="accountName">Account Name</option>
                            <option value="order">Order Number</option>
                            <option value="balance">Current Balance</option>
                            <option value="accountCategory">Account Category</option>
                            <option value="accountSubCategory">Account Sub Category</option>
                        </select>
                        <select name="Order" className='orderSelect' value={order} //Asending or Descending Order
                            onChange={(e) => setOrder(e.target.value)} >
                            <option value="order" disabled>Select Order Direction</option>
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                        <input placeholder='' hidden></input>
                        <button className='submitSort' onClick={(e) => { sortedAccount() }} title="Sort Accounts">Sort</button>
                        <div>
                            <input className="searchByText" onChange={(e) => setSearchTerm(e.target.value)} placeholder='Filter'></input>
                            <button className='submitSort' onClick={handleSearch} title="Search Accounts">Search</button>
                        </div>
                    </div>
                </div>

                {/* <button className='createNewAccountButton' onClick={openModal}><IoMdAdd />Account</button>*/}
                {/*</h1>*/}

                {/* //Conditionally renders either Create or Edit Account */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    {selectedAccount ? (
                        <EditAccount account={selectedAccount} /> // Pass the account to the EditAccount component
                    ) : (
                        <CreateAccount /> // Render CreateAccount when no account is selected
                    )}
                </Modal>
                {accounts.length > 0 ? (
                    <table className="accounts-table">
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Account Number</th>
                                <th>Account Name</th>
                                <th>Account Category</th>
                                <th>Sub-Category</th>
                                <th>Balance</th>
                                <th>Debit</th>
                                <th>Credit</th>
                                <th>Account Description</th>
                                {storedUser.accountType == 'Admin' ? (
                                    <th>Edit</th>

                                ) : (
                                    <h1></h1>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => (
                                <tr key={account.accountNumber}>
                                    <td>{account.order}</td>
                                    <td><Link to={`/LedgerOfAccounts`} onClick={() => { saveSelectedAccount(account.accountName) }} title="Link to Ledger">{account.accountNumber}</Link></td>
                                    <td>
                                        <Link to={`/LedgerOfAccounts`} className='linkToLedger' onClick={() => { saveSelectedAccount(account.accountName) }} title="Link to Ledger">{account.accountName} </Link>
                                    </td>
                                    <td>{account.accountCategory}</td>
                                    <td>{account.accountSubCategory}</td>
                                    <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>${account.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>${account.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{account.accountDescription}</td>
                                    {storedUser.accountType == 'Admin' ? (
                                        < td >
                                            <button className='buttonForEditUserRecord ' onClick={() => openEditModal(account)} title="Edit Account">Edit</button>
                                        </td>
                                    ) : (
                                        <h1></h1>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No accounts found.</p>
                )}
            </div>
        </div >
    );
};

export default Accounts;
