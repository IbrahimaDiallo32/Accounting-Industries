import React, { useState, useEffect } from 'react';
import './EventLog.css';
import { getAllUsers } from '../../api/axiosConfiguration';
import Avatar from '../Assets/Avatar';
import axios from 'axios';

const EventLog = () => {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);

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
        <div className='outerContainers'>
            <form action="">
                {/* Placeholder for form */}
            </form>

            <div className="homePageOutermostcontainer">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="profile">
                        <Avatar name="NAME" />
                        <span className="spanForHome"><button className="profilebtn">Hello Alex</button></span>
                    </div>
                    <a href="/DisplayUserList" className='spacingHomePage'>USER LIST</a>
                    <a href="#module2">EXPIRED PASSWORDS</a>
                    <a href="#module3">MODULE 3</a>
                    <a href="#module4">MODULE 4</a>
                    <a href="#module5">MODULE 5</a>
                </div>

                {/* Main Content */}
                <div className="event-log-container">
                    <h1>Event Log</h1>
                    {logs.length > 0 ? (
                        <table className="event-log-table">
                            <thead>
                                <tr>
                                    <th>Event ID</th>
                                    <th>User ID</th>
                                    <th>L</th>
                                    <th>Date/Time</th>
                                    <th>Before Image</th>
                                    <th>After Image</th>
                                </tr>
                            </thead>
                            <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>{log._id}</td>
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
        </div>
    );
};

export default EventLog;
