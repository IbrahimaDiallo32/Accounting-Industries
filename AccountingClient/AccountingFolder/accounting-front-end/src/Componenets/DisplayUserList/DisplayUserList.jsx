import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/axiosConfiguration';
import './DisplayUserList.css';


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
        <div className='outermostContainer'>
            <h1>User List</h1>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id}>
                            Name: {user.lastName}, {user.firstName}
                            <ul>
                                <li>Email: {user.email}</li>
                                <li>Username: {user.userName}</li>
                                <li>Account Creation Date: {user.accountCreatedDate}</li>
                                <li>Account type: {user.accountType}</li>
                                <li>Address: {user.address}</li>
                                <li>Date of Birth: {user.birthMonth} {user.birthDate}, {user.birthYear}</li>
                                <li>Account Status: {user.accountStatus}</li>
                                <li>Password is Expired: {user.passwordIsExpired}</li>
                            </ul>


                        </li>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </ul>
        </div>
    );
};

export default DisplayUserList;
