import React, { useState, useEffect } from 'react';
import Avatar from '../Assets/Avatar';
import axios from 'axios';
import Modal from '../Modal/Modal';
import { useNavigate } from 'react-router-dom';
import './Statements.css';

const Statements = () => {

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;

    useEffect(() => {
        if (!storedUser) { //if no one is logged it, it automatically navigates back to login page
            navigate("/", { replace: true });
            return;
        };
        const fetchBalanceSheet = async () => {
            const balanceSheetData = await axios.get('http://localhost:8080/account/balance-sheet');
            setBalanceSheet(balanceSheetData.data); // capture the data returned from the API call 
        };

        fetchBalanceSheet();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser"); // Clear user data
        navigate("/loginForm"); // Redirect to login
    };
    const [currentStatement, setCurrentStatement] = useState("");
    const toggleStatements = (statement) => {

    }
    const[balanceSheet, setBalanceSheet] = useState([null]);

    if (!balanceSheet){
        return <div>Loading</div>;
    }

    return(
        <div className="loginPageContainer">
            <div className="sidebar">
                <div className="profile">
                    <Avatar name={fullName} />
                    <span className="spanForHome">Hello {storedUser.firstName}</span>
                </div>
                <a href="/HomePage" className='spacingHomePage'>Home</a>
                <a href="/DisplayUserList">User List</a>
                <a href="/Accounts">Accounts</a>
                <a href="/Journalize">Journalize</a>
                <a href="/EventLog">Event Log</a>
                <a href="/LedgerOfAccounts">Ledger</a>
                <a href="/LoginsdasdForm"><button className="logout-other-button" onClick={handleLogout}>LOGOUT</button></a>
                
            </div>
            <div className="balance-sheet-outer-countainer">
            <h2>Balance Sheet</h2>
            <table className="balance-sheet-table">
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Account</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                    {/* Assets Section */}
                    <tr className="section-header">
                        <td colSpan="3"><strong>Assets</strong></td>
                    </tr>
                    {balanceSheet.assets?.map(account => (
                        <tr key={account.id}>
                        <td className='no-border'></td>
                        <td>{account.accountName}</td>
                        <td>${account.balance.toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className='no-border'></td>
                        <td><strong>Total Assets</strong></td>
                        <td><strong>${balanceSheet.totalAssets?.toFixed(2)}</strong></td>
                    </tr>

                    {/* Liabilities Section */}
                    <tr className="section-header">
                        <td colSpan="3"><strong>Liabilities</strong></td>
                    </tr>
                    {balanceSheet.liabilities?.map(account => (
                        <tr key={account.id}>
                        <td className='no-border'></td>
                        <td>{account.accountName}</td>
                        <td>${account.balance.toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className='no-border'></td>
                        <td><strong>Total Liabilities</strong></td>
                        <td><strong>${balanceSheet.totalLiabilities?.toFixed(2)}</strong></td>
                    </tr>

                    {/* Equity Section */}
                    <tr className="section-header">
                        <td colSpan="3"><strong>Equity</strong></td>
                    </tr>
                    {balanceSheet.equity?.map(account => (
                        <tr key={account.id}>
                        <td className='no-border'></td>
                        <td>{account.accountName}</td>
                        <td>${account.balance.toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className='no-border'></td>
                        <td><strong>Total Equity</strong></td>
                        <td><strong>${balanceSheet.totalEquity?.toFixed(2)}</strong></td>
                    </tr>

                    {/* Total Liabilities and Equity */}
                    <tr className="section-header">
                        <td colSpan="2"><strong>Total Liabilities and Equity</strong></td>
                        <td><strong>${balanceSheet.totalLiabilitiesAndEquity?.toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    ) 
    
};

export default Statements;