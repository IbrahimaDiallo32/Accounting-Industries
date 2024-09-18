import api from './api/axiosConfiguration'
import { useState, useEffect } from 'react';
import { getAllUsers, addUser } from './api/axiosConfiguration'
import './App.css';
//import { Routes, Route } from 'react-router-dom'
import LoginForm from './Componenets/LoginForm/LoginForm';


function App() {


  const [users, setUsers] = useState([]);
  useEffect(() => {
    // Fetch users when the component mounts
    getAllUsers().then((data) => setUsers(data));
    console.log("this that fetch users");
  }, []);

  const handleAddUser = () => {
    const newUser = { firstName: "John", lastName: "Doe", email: "john@example.com" };
    addUser(newUser).then(() => {
      // Refresh the list after adding a new user
      getAllUsers().then((data) => setUsers(data));
      console.log("this the add new user");
    });
  };


  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default App;
