import React from 'react';
import './Accounts.css';
import { RxAvatar } from "react-icons/rx";
import Avatar from '../Assets/Avatar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateAccount from './CreateAccount';
import Modal from '../Modal/Modal';
import { IoMdAdd } from 'react-icons/io';
import { Dropdown } from 'bootstrap';


const Accounts = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [sortByType, setSortByType] = useState('sort');
    const [order, setOrder] = useState('order');

    const [accounts, setAccounts] = useState([]);

    const sortedAccount = async () => {
        try {
            console.log(sortByType);
            console.log(order);
            const response = await axios.get(`http://localhost:8080/account/${sortByType}${order}`);
            console.log(response.data);
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    }
    //const sortData = async () await axios.get(`http://localhost:8080/account/${SortByType}${Order}`)
    // Fetch all the acounts present in the databse when the component is mounted
    useEffect(() => {
        const fetchAccounts = async () => {
            const accountsData = await axios.get('http://localhost:8080/account');
            setAccounts(accountsData.data); // capture the data returned from the API call into 'accounts'
        };

        fetchAccounts();
    }, []);

    
    //this is creating the User that will be used throughout the entire application

    const username = "Ibrahima Diallo"
    return (
        <div className="homePageOutermostcontainer">
            <div className="sidebar">
                <div className="profile">

                    {/* <RxAvatar className='avatarHomePage' /> */}
                    {/* <img src="https://via.placeholder.com/40" alt="Profile Picture" /> */}
                    <Avatar name={username} />
                    <span className="spanForHome">Hello Alexa</span>
                </div>
                <a href="/DisplayUserList" className='spacingHomePage'>USER LIST</a>
                <a href="#module2">Chart of Accounts</a>
                <a href="#module3">Accounts</a>
                <a href="#module4">MODULE 4</a>
                <a href="#module5">MODULE 5</a>
                <a href="/LoginForm"><button className="logout-other-button">LOGOUT</button></a>
            </div>
            
            <div className="main-content">
                <h1>Accounts<button className='createNewAccountButton' onClick={openModal}><IoMdAdd />Account</button></h1>
                <div className='SortByContainer'>
                            <div className='SortBy'>
                                <label className='SortByTextField'>Sort By</label>
                                <select name="Sort By" className='SortBySelection' value={sortByType} // Sort the data by variable
                                    onChange={(e) => setSortByType(e.target.value)}>
                                    <option value="sort" disabled>Select Sort by Type</option>
                                    <option value="accountNumber">Account Number</option>
                                    <option value="accountName">Account Name</option>
                                    <option value="order">Order Number</option>
                                    <option value="balance">Current Balance</option>
                                </select>
                                <select name="Order" className='OrderSelect' value={order} //Asending or Descending Order
                                    onChange={(e) => setOrder(e.target.value)} >
                                    <option value="order" disabled>Select Order Direction</option>
                                    <option value="ASC">Ascending</option>
                                    <option value="DES">Descending</option>
                                </select>
                                <input placeholder='' hidden></input>
                                <button className='SubmitSort' onClick={(e) => {sortedAccount()}}>
                                    Sort
                                </button>
                            </div>
                        </div>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <CreateAccount /> {/* This is the content to be displayed inside the modal */}
                </Modal>
                {accounts.length > 0 ? (
                    <table className="user-table">
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
                                    <td>{account.accountName}</td>
                                    <td>{account.accountCategory}</td>
                                    <td>{account.accountSubCategory}</td>
                                    <td>{account.balance}</td>
                                    <td>{account.debit}</td>
                                    <td>{account.credit}</td>
                                    <td>{account.accountDescription}</td>
                                    <td><a href="/">Edit</a></td>
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
