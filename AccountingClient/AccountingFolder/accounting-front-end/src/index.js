import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ForgotPassword from './Componenets/ForgotPassword/ForgotPassword';
import HomePage from './Componenets/home/HomePage';
import DisplayUserList from './Componenets/DisplayUserList/DisplayUserList'
import RegistrationForm from './Componenets/RegistrationForm/RegistrationForm';
import LoginForm from './Componenets/LoginForm/LoginForm';
import ResetPassword from './Componenets/ResetPassword/ResetPassword';
import EventLog from './Componenets/EventLog/EventLog';
import Accounts from './Componenets/AccountsHome/Accounts';
import LedgerOfAccounts from './Componenets/Ledger/LedgerOfAccounts';
import NewUserForm from './Componenets/DisplayUserList/NewUserForm';
import EditUserForm from './Componenets/DisplayUserList/EditUserForm'
import EditAccount from './Componenets/AccountsHome/EditAccount';
import Journalize from './Componenets/AccountsHome/Journalize/Journalize';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/DisplayUserList" element={<DisplayUserList />} />
        <Route path="/RegistrationForm" element={<RegistrationForm />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/EventLog" element={<EventLog />} />
        <Route path="/Accounts" element={<Accounts />} />
        <Route path="/NewUserForm" element={<NewUserForm />} />
        <Route path="/LedgerOfAccounts" element={<LedgerOfAccounts />} />
        <Route path="/EditUserForm" element={<EditUserForm />} />
        <Route path="/EditAccount" element={<EditAccount />} />
        <Route path="/Journalize" element={<Journalize />} />
        {/* <Route path="/handleFetchUsers" element={<handleFetchUsers />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

