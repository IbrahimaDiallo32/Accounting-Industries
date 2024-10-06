import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/axiosConfiguration';
import './DisplayUserList.css';
import { IoArrowBack } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import Modal from '../Modal/Modal';
import NewUserForm from './NewUserForm'
import EditUserForm from './EditUserForm'

const DisplayUserList = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Track the user to edit so that informatoin can be autopopulated later on

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null); // This resets the selected user when closing the modal component
    };

    const [users, setUsers] = useState([]);

    // Fetch users when the component is mounted
    useEffect(() => {
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

    return (
        <div className="loginPageContainer">
            <a href="/HomePage"><button className='backButtonRegistration'><IoArrowBack />BACK</button></a>
            <button className='createNewUserButton' onClick={openModal}><IoMdAdd />Create User</button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedUser ? (
                    <EditUserForm user={selectedUser} />  // Pass the user to the EditUserForm
                ) : (
                    <NewUserForm />
                )}
            </Modal>
            <h1>User List </h1>
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
    );
};

export default DisplayUserList;
