import { useState, useEffect } from 'react';
import { getAllUsers, addUser } from './api/axiosConfiguration'
import './App.css';
import LoginForm from './Componenets/LoginForm/LoginForm';


function App() {


  const [users, setUsers] = useState([]);
  useEffect(() => {
    // Fetch users when the component mounts
    getAllUsers().then((data) => setUsers(data));
    console.log("this that fetch userssss");
  }, []);

  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default App;
