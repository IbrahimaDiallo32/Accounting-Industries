import React, { useState, useEffect } from 'react';
import './EventLog.css'
import Avatar from '../Assets/Avatar'
import axios from 'axios';
//import { FaCalendar } from "react-icons/fa";
//import PopUpCal from '../PopUpCal/PopUpCal';
import HomePage from '../home/HomePage';

const EventLog = () => {

        const [logs, setLogs] = useState([]);
      
        useEffect(() => {
          const fetchLogs = async () => {
            try {
              const response = await axios.get('http://localhost:5000/api/get-event-logs');
              setLogs(response.data);
            } catch (error) {
              console.error('Error fetching logs:', error);
            }
          };
      
          fetchLogs();
        }, []);

    return (
        <div className='outerContainers'>
            <form action="">
                {/* <h1>This is the home page.. more incoming</h1> */}
                {/* <a href="/DisplayUserList">Click here to see the Full User List</a> */}
                {/* <a href="/#">Click here to edit users?</a> */}
                {/* alex was here */}
            </form>

            <div className="homePageOutermostcontainer">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="profile">
                        <Avatar name="NAME" />
                        <span className="spanForHome"><button class="profilebtn">Hello Alex</button></span>
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
                
            <table className="event-log-table">
                <thead>
                    <tr>
                        <th>Event ID</th>
                        <th>User ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Before Image</th>
                        <th>After Image</th>
                    </tr>
                </thead>
                <tbody>
                {logs.map((log) => (
                    <tr key={log._id}>
                    <td>{log.userId}</td>
                    <td>{log.eventType}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                ))}
                     </tbody>
            </table>
                </div>
            
            </div>
        </div>
    );
}
export default EventLog;