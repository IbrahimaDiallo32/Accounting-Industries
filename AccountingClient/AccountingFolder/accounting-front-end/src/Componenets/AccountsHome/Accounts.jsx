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
import { Dropdown } from 'bootstrap';
import { Link } from 'react-router-dom';


const Accounts = () => {
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

    useEffect(() => {
        const fetchAccounts = async () => {
            const accountsData = await axios.get('http://localhost:8080/account');
            setAccounts(accountsData.data); // capture the data returned from the API call into 'accounts'
        };

        fetchAccounts();
    }, []);

    const username = "Ibrahima Diallo";

    return (
        <div className="homePageOutermostcontainer">
            <div className="sidebar">
                <div className="profile">
                    <Avatar name={username} />
                    <span className="spanForHome">Hello Alexa</span>
                </div>
                <a href="/DisplayUserList" className='spacingHomePage'>User List</a>
                <a href="/Accounts">Accounts</a>
                <a href="#module3">Event Log</a>

                <a href="/LoginForm"><button className="logout-other-button">LOGOUT</button></a>
                <a> 
                        <button className = "helpButton" onClick={openHelp}> Help</button>
                </a>
            </div>

            <Modal isOpen={isHelpOpen} onClose={closeHelp}>
                <AccountsHelp />
            </Modal>

            <div className="main-content">
                <h1>Accounts
                    <button className='createNewAccountButton' onClick={openModal}><IoMdAdd />Account</button>
                </h1>

                {/* //Conditionally renders either Create or Edit Account */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    {selectedAccount ? (
                        <EditAccount account={selectedAccount} /> // Pass the account to the EditAccount component
                    ) : (
                        <CreateAccount /> // Render CreateAccount when no account is selected
                    )}
                </Modal>

                <div className='sortByContainer'>
                    <div className='sortBy'>
                        <label className='sortByTextField'>Sort By</label>
                        <select name="Sort By" className='sortBySelection' value={sortByType} onChange={(e) => setSortByType(e.target.value)}>
                            <option value="sort" disabled>Select Sort by Type</option>
                            <option value="accountNumber">Account Number</option>
                            <option value="accountName">Account Name</option>
                            <option value="order">Order Number</option>
                            <option value="balance">Current Balance</option>
                            <option value="accountCategory">Account Category</option>
                            <option value="accountSubCategory">Account Sub Category</option>
                        </select>
                        <select name="Order" className='orderSelect' value={order} onChange={(e) => setOrder(e.target.value)} >
                            <option value="order" disabled>Select Order Direction</option>
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                        <button className='submitSort toolTip' onClick={sortedAccount}>Sort</button>
                    </div>
                </div>

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
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => (
                                <tr key={account.accountNumber}>
                                    <td>{account.order}</td>
                                    <td>{account.accountNumber}</td>
                                    <td>
                                    <Link to="/LedgerOfAccounts"  className='linkToLedger'>{account.accountName}</Link></td>
                                    <td>{account.accountCategory}</td>
                                    <td>{account.accountSubCategory}</td>
                                    <td>{account.balance}</td>
                                    <td>{account.debit}</td>
                                    <td>{account.credit}</td>
                                    <td>{account.accountDescription}</td>
                                    <td>
                                        <button className='buttonForEditUserRecord ' onClick={() => openEditModal(account)}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No accounts found.</p>
                )}
            </div>
        </div>
    );
};

export default Accounts;
