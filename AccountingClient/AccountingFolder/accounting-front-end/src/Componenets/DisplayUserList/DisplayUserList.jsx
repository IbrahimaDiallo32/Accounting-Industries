import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/axiosConfiguration';
import './DisplayUserList.css';
import { IoArrowBack } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import Avatar from '../Assets/Avatar';
import Modal from '../Modal/Modal';
import NewUserForm from './NewUserForm'
import UserListHelp from './UserListHelp'
import EditUserForm from './EditUserForm'


const DisplayUserList = () => {

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
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data); // Save users to the state
        };

        fetchUsers();
    }, []);


    const username = "Ibrahima Diallo"

    const openEditModal = (user) => {
        setSelectedUser(user); // Set the user to be edited
        setIsModalOpen(true);
    };


    return (
        <div className="loginPageContainer">
            <div className="sidebar">
                <div className="profile">
                    {/* <RxAvatar className='avatarHomePage' /> */}
                    {/* <img src="https://via.placeholder.com/40" alt="Profile Picture" /> */}
                    <Avatar name={username} />
                    <span className="spanForHome">Hello Alexa</span>
                </div>
                <a href="/DisplayUserList" className='spacingHomePage'>USER LIST</a>
                <a href="/Accounts">Chart of Accounts</a>
                <a href="#module3">Accounts</a>
                <a href="#module4">MODULE 4</a>
                <a href="#module5">MODULE 5</a>
                <a href="/LoginForm"><button className="logout-other-button">LOGOUT</button></a>
                <a> 
                        <button className = "helpButton" onClick={openHelp}> Help</button>
                </a>
            </div>

            <Modal isOpen={isHelpOpen} onClose={closeHelp}>
                    <UserListHelp />
                </Modal>

            <div className='useListMainInfo'>
            <h1>User List </h1>
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
        </div>
    );
};

export default DisplayUserList;
