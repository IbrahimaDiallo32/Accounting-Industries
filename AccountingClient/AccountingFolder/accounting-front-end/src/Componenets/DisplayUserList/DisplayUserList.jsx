import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/axiosConfiguration';
import './DisplayUserList.css';
import { IoMdAdd } from "react-icons/io";
import Avatar from '../Assets/Avatar';
import Modal from '../Modal/Modal';
import NewUserForm from './NewUserForm'
import UserListHelp from './UserListHelp'
import EditUserForm from './EditUserForm'
import { useNavigate } from 'react-router-dom';

const DisplayUserList = () => {

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Track the user to edit so that informatoin can be autopopulated later on

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null); // This resets the selected user when closing the modal component
    };

    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const openHelp = () => setIsHelpOpen(true);
    const closeHelp = () => setIsHelpOpen(false);

    const [users, setUsers] = useState([]);

    // Fetch users when the component is mounted
    useEffect(() => {
        if (!storedUser) { //if no one is logged it, it automatically navigates back to login page
            navigate("/", { replace: true });
            return;
        }

        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data); // Save users to the state
        };

        fetchUsers();
    }, []);

    const openEditModal = (user) => {
        setSelectedUser(user); // Set the user to be edited
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser"); // Clear user data
        navigate("/loginForm"); // Redirect to login
    };

    return (
        <div className="loginPageContainer">
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
                <a>
                    <button className="helpButton" onClick={openHelp}> Help</button>
                </a>
            </div>

            <Modal isOpen={isHelpOpen} onClose={closeHelp}>
                <UserListHelp />
            </Modal>

            {storedUser.accountType === 'Admin' ? (
                <div className='userListMainInfo'>
                    <h1>User List</h1>
                    <button className='createNewUserButton' onClick={openModal}><IoMdAdd />Create User</button>

                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        {selectedUser ? (
                            <EditUserForm user={selectedUser} />  // Pass the user to the EditUserForm
                        ) : (
                            <NewUserForm />
                        )}
                    </Modal>

                    {users.length > 0 ? (
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Account Creation Date</th>
                                    <th>Account Type</th>
                                    <th>Address</th>
                                    <th>Date of Birth</th>
                                    <th>Account Status</th>
                                    <th>Password Expired</th>
                                    <th>Edit User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.lastName}, {user.firstName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.username}</td>
                                        <td>{user.accountCreatedDate}</td>
                                        <td>{user.accountType}</td>
                                        <td>{user.address}</td>
                                        <td>{user.birthMonth} {user.birthDate}, {user.birthYear}</td>
                                        <td>{user.accountStatus}</td>
                                        <td>{user.passwordIsExpired ? "Yes" : "No"}</td>
                                        <td><button className='buttonForEditUserRecord' onClick={() => openEditModal(user)}>Edit</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            ) : (
                <div className='userListMainInfo'>
                    <h1>User List</h1>
                    {/* <button className='createNewUserButton' onClick={openModal}><IoMdAdd />Create User</button> */}
                    {/* deleting this loc makes the css funky and the side bar shift to the right */}
                    {users.length > 0 ? (
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Account Creation Date</th>
                                    <th>Account Type</th>
                                    <th>Address</th>
                                    <th>Date of Birth</th>
                                    <th>Account Status</th>
                                    <th>Password Expired</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.lastName}, {user.firstName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.username}</td>
                                        <td>{user.accountCreatedDate}</td>
                                        <td>{user.accountType}</td>
                                        <td>{user.address}</td>
                                        <td>{user.birthMonth} {user.birthDate}, {user.birthYear}</td>
                                        <td>{user.accountStatus}</td>
                                        <td>{user.passwordIsExpired ? "Yes" : "No"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DisplayUserList;
