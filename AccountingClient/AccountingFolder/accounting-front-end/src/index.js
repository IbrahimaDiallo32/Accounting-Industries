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
import Accounts from './Componenets/AccountsHome/Accounts';
import NewUserForm from './Componenets/DisplayUserList/NewUserForm'
import LedgerOfAccounts from './Componenets/Ledger/LedgerOfAccounts';


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
        <Route path="/Accounts" element={<Accounts />} />
        <Route path="/NewUserForm" element={<NewUserForm />} />
        <Route path="/LedgerOfAccounts" element={<LedgerOfAccounts />} />
        {/* <Route path="/handleFetchUsers" element={<handleFetchUsers />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

