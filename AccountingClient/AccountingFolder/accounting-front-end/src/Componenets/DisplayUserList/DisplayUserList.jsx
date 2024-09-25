import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/axiosConfiguration';
import './DisplayUserList.css';
import { IoArrowBack } from "react-icons/io5";


const DisplayUserList = () => {
    const [users, setUsers] = useState([]);

    // Fetch users when the component is mounted
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data); // Save users to the state
        };

        fetchUsers();
    }, []);

    return (
        <div className="loginPageContainer">
            <a href="/HomePage"><button className='backButtonRegistration'><IoArrowBack />BACK</button></a>
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
    );
};

export default DisplayUserList;
