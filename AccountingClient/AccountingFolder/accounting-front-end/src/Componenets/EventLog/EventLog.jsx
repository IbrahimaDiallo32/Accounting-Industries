import React, { useState, useEffect } from 'react';
import './EventLog.css'; 
import { getAllUsers } from '../../api/axiosConfiguration';
import Avatar from '../Assets/Avatar';
import axios from 'axios';

const generateUniqueId = () => {
    return Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit unique ID
};

const EventLog = () => {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const logResponse = await axios.get('http://localhost:8080/api/events');  
                setLogs(logResponse.data);
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
            <div className="homePageOutermostcontainer">
                <div className="sidebar">
                    <div className="profile">
                        <Avatar name="NAME" />
                        <span className="spanForHome"><button className="profilebtn">Hello Alex</button></span>
                    </div>
                    <a href="/DisplayUserList" className='spacingHomePage'>User List</a>
                    <a href="/Accounts">Accounts</a>
                    <a href="/EventLog">Event Log</a>
                    <a href="/#">Module 4</a>
                    <a href="#">Module 5</a>
                    <a href="/LoginForm"><button className="logout-other-button">Logout</button></a>
                </div>

                <div className="event-log-container">
                    <h1>Event Log</h1>
                    {logs.length > 0 ? (
                        <ul className="responsive-table">
                            <li className="table-header">
                                <div className="col col-1">Event ID</div>
                                <div className="col col-2">Event Type</div>
                                <div className="col col-3">User ID</div>
                                <div className="col col-4">Modified By</div>
                                <div className="col col-5">Date/Time</div>
                                <div className="col col-6">Before Image</div>
                                <div className="col col-7">After Image</div>
                            </li>
                            {logs.map((log) => (
                                <li key={log._id} className="table-row">
                                    <div className="col col-1">{generateUniqueId()}</div>
                                    <div className="col col-2">{log.eventType}</div>
                                    <div className="col col-3">{log.userId}</div>
                                    <div className="col col-4">{log.modifiedBy}</div>
                                    <div className="col col-5">{new Date(log.timestamp).toLocaleString()}</div>
                                    <div className="col col-6">
                                        <pre>{JSON.stringify(log.beforeChange, null, 2)}</pre>
                                    </div>
                                    <div className="col col-7">
                                        <pre>{JSON.stringify(log.afterChange, null, 2)}</pre>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No logs available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventLog;
