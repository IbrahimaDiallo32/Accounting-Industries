import React, { useState, useEffect } from 'react';
import './EventLog.css';
import { getAllUsers } from '../../api/axiosConfiguration';
import Avatar from '../Assets/Avatar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventLog = () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser"); // Clear user data
        navigate("/loginForm"); // Redirect to login
    };

    useEffect(() => {
        // Fetch both logs and users
        const fetchData = async () => {
            try {
                // Fetch event logs 
                const logResponse = await axios.get('http://localhost:8080/api/event-logs');
                console.log('Fetched logs:', logResponse.data);
                setLogs(logResponse.data);

                // Fetch users from API
                const userResponse = await getAllUsers();
                setUsers(userResponse);
            } catch (error) {
                console.error('Error fetching data:', error.response.data);
            }
        };

        fetchData();
    }, []);


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
                <a href="/EventLog">Event Log</a>
                <a href="#module4">MODULE 4</a>
                <a href="/LoginForm"><button className="logout-other-button" onClick={handleLogout}>LOGOUT</button></a>
                <a>
                    <button className="helpButton"> Help</button>
                </a>
            </div>

            <div className="event-log-container">
                <h1>Event Log</h1>
                {logs.length > 0 ? (
                    <table className="event-log-table">
                        <thead>
                            <tr>
                                <th>Event ID</th>
                                <th>Event Type</th>
                                <th>User ID</th>
                                <th>Modified By</th>
                                <th>Date/Time</th>
                                <th>Before Image</th>
                                <th>After Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td>{log._id = crypto.randomUUID()}</td>
                                    <td>{log.eventType}</td>
                                    <td>{log.userId}</td>
                                    <td>{log.modifiedBy}</td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>
                                        <pre>{JSON.stringify(log.beforeChange, null, 2)}</pre>
                                    </td>
                                    <td>
                                        <pre>{JSON.stringify(log.afterChange, null, 2)}</pre>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No logs available.</p>
                )}
            </div>
        </div>
    );
};

export default EventLog;
