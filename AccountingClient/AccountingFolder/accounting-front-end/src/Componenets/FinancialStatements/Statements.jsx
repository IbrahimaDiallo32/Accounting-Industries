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
        
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser"); // Clear user data
        navigate("/loginForm"); // Redirect to login
    };
    const [currentStatement, setCurrentStatement] = useState("select-option"); //Keeps the user from viewing all statements at once

    const balanceTarget = "balance-sheet"
    const trialTarget = "trial-balance"
    const incomeTarget = "income-statement"
    const reatinedTarget = "retained-earnings"

    const toggleStatements = (Statement) => {
        
        if(Statement === balanceTarget) {
            fetchBalanceSheet();
            setCurrentStatement("balance-sheet");
        }
        else if(Statement === trialTarget) {
            fetchTrialBalance();
            setCurrentStatement("trial-balance");
        }

        else if(Statement === incomeTarget){
            fetchIncomeStatement();
            setCurrentStatement("income-statement");
        }
        else if(Statement === reatinedTarget) {
            fetchIncomeStatement();
            setCurrentStatement("retained-earnings");
        }
    };
    const fetchBalanceSheet = async () => {
        const balanceSheetData = await axios.get('http://localhost:8080/account/balance-sheet');
        setBalanceSheet(balanceSheetData.data); // capture the data returned from the API call 
    };

    const fetchTrialBalance = async () => {
        const trialBalanceData = await axios.get('http://localhost:8080/account/trial-balance')
        setTrialBalance(trialBalanceData.data);
    }

    const fetchIncomeStatement = async () => {
        const incomeStatementData = await axios.get('http://localhost:8080/account/income-statement');
        setIncomeStatement(incomeStatementData.data);
    }

    const correctDisplay = (Statement) =>{
        return Statement === currentStatement
    };

    const[balanceSheet, setBalanceSheet] = useState([]);
    const[trialBalance, setTrialBalance] = useState([]);
    const[incomeStatement, setIncomeStatement] = useState([]);

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

            <div className ="statement-selector">
            <select className="select-statement-options" value={currentStatement} onChange={(event) => toggleStatements(event.target.value)}>
                <option value="select-option" disabled>Select Statement</option>
                <option value="balance-sheet">Balance Sheet</option>
                <option value="trial-balance">Trial Balance</option>
                <option value="income-statement">Income Statement</option>
                <option value="retained-earnings">Retained Earnings Statement</option>
            </select>

            {correctDisplay("balance-sheet") && (                                 //Start of Blance Sheet

                <div className="statement-outer-container">
                    <h2>Balance Sheet</h2> 
                    <table className="statement-table">
                        <thead>
                        <tr>
                            <th>Category</th>
                            <th>Account</th>
                            <th>Debit</th>
                            <th>Credit</th>
                        </tr>
                        </thead>
                        <tbody>
                            {/* Assets Section */}
                            <tr className="section-header">
                                <td colSpan="4"><strong>Assets</strong></td>
                            </tr>
                            {balanceSheet.assets?.map(account => (
                                <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className='no-border'></td>
                                </tr>
                            ))}
                            <tr>
                                <td className='no-border'></td>
                                <td className='indent'><strong>Total Assets</strong></td>
                                <td><strong>${balanceSheet.totalAssets?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                                <td className='no-border'></td>
                            </tr>

                            {/* Liabilities Section */}
                            <tr className="section-header">
                                <td colSpan="4"><strong>Liabilities</strong></td>
                            </tr>
                            {balanceSheet.liabilities?.map(account => (
                                <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td className='no-border'></td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className='no-border'></td>
                                <td className='indent'><strong>Total Liabilities</strong></td>
                                <td className='no-border'></td>
                                <td><strong>${balanceSheet.totalLiabilities?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                            </tr>

                            {/* Equity Section */}
                            <tr className="section-header">
                                <td colSpan="4"><strong>Equity</strong></td>
                            </tr>
                            {balanceSheet.equity?.map(account => (
                                <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td className='no-border'></td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className='no-border'></td>
                                <td className='indent'><strong>Total Equity</strong></td>
                                <td className='no-border'></td>
                                <td><strong>${balanceSheet.totalEquity?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                            </tr>

                            {/* Total Liabilities and Equity */}
                            <tr className="section-header">
                                <td colSpan="3"><strong>Total Liabilities and Equity</strong></td>
                                <td><strong>${balanceSheet.totalLiabilitiesAndEquity?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>                                      //End of Balance Sheet
            )}    
            {correctDisplay("trial-balance") && (                               //Start of Trial Balance
                <div className="statement-outer-container">
                <h2>Trial Balance</h2>
                <table className="statement-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Account</th>
                            <th>Debit</th>
                            <th>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Assets Section */}
                        <tr className="section-header">
                            <td colSpan="4"><strong>Assets</strong></td>
                        </tr>
                        {trialBalance.assets?.map(account => (
                            <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className='no-border'></td>
                            </tr>
                        ))}
                        <tr>
                            <td className='no-border'></td>
                            <td className='indent'><strong>Total Assets</strong></td>
                            <td><strong>${trialBalance.totalAssets?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                            <td className='no-border'></td>
                        </tr>
            
                        {/* Liabilities Section */}
                        <tr className="section-header">
                            <td colSpan="4"><strong>Liabilities</strong></td>
                        </tr>
                        {trialBalance.liabilities?.map(account => (
                            <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td className='no-border'></td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                        <tr>
                            <td className='no-border'></td>
                            <td className='indent'><strong>Total Liabilities</strong></td>
                            <td className='no-border'></td>
                            <td><strong>${trialBalance.totalLiabilities?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        </tr>
            
                        {/* Equity Section */}
                        <tr className="section-header">
                            <td colSpan="4"><strong>Equity</strong></td>
                        </tr>
                        {trialBalance.equity?.map(account => (
                            <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td className='no-border'></td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                        <tr>
                            <td className='no-border'></td>
                            <td className='indent'><strong>Total Equity</strong></td>
                            <td className='no-border'></td>
                            <td><strong>${trialBalance.totalEquity?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        </tr>
            
                        {/* Revenue Section */}
                        <tr className="section-header">
                            <td colSpan="4"><strong>Revenue</strong></td>
                        </tr>
                        {trialBalance.revenue?.map(account => (
                            <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td className='no-border'></td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                        <tr>
                            <td className='no-border'></td>
                            <td className='indent'><strong>Total Revenue</strong></td>
                            <td className='no-border'></td>
                            <td><strong>${trialBalance.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        </tr>
            
                        {/* Expenses Section */}
                        <tr className="section-header">
                            <td colSpan="4"><strong>Expenses</strong></td>
                        </tr>
                        {trialBalance.expense?.map(account => (
                            <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className='no-border'></td>
                            </tr>
                        ))}
                        <tr>
                            <td className='no-border'></td>
                            <td className='indent'><strong>Total Expenses</strong></td>
                            <td><strong>${trialBalance.totalExpense?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                            <td className='no-border'></td>
                        </tr>
            
                        {/* Total Debits and Credits */}
                        <tr className="section-header">
                            <td colSpan="3"><strong>Total Debits</strong></td>
                            <td><strong>${trialBalance.totalDebit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        </tr>
                        <tr className="section-header">
                            <td colSpan="3"><strong>Total Credits</strong></td>
                            <td><strong>${trialBalance.totalCredit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            )}     
            {correctDisplay("income-statement") && (                            //Start of Income Statement
                <div className="statement-outer-container">
                <h2>Income Statement</h2>
                <table className="statement-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Account</th>
                            <th>Debit</th>
                            <th>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Revenue Section */}
                        <tr className="section-header">
                            <td colSpan="4"><strong>Revenue</strong></td>
                        </tr>
                        {incomeStatement.revenue?.map(account => (
                            <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td className='no-border'></td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                        <tr>
                            <td className='no-border'></td>
                            <td className='indent'><strong>Total Revenue</strong></td>
                            <td className='no-border'></td>
                            <td><strong>${incomeStatement.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        </tr>
            
                        {/* Expenses Section */}
                        <tr className="section-header">
                            <td colSpan="4"><strong>Expenses</strong></td>
                        </tr>
                        {incomeStatement.expense?.map(account => (
                            <tr key={account.id}>
                                <td className='no-border'></td>
                                <td>{account.accountName}</td>
                                <td>${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className='no-border'></td>
                            </tr>
                        ))}
                        <tr>
                            <td className='no-border'></td>
                            <td className='indent'><strong>Total Expenses</strong></td>
                            <td><strong>${incomeStatement.totalExpense?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                            <td className='no-border'></td>
                        </tr>
            
                        {/* Net Income */}
                        <tr className="section-header">
                            <td colSpan="3"><strong>Net Income</strong></td>
                            <td>
                                <strong>
                                    ${(
                                        (incomeStatement.totalRevenue || 0) - 
                                        (incomeStatement.totalExpense || 0)
                                    ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            )}        
            {correctDisplay("retained-earnings") && (                           //Start of Retained Earnings
                <div className="statement-outer-container">
                <h2>Retained Earnings Statement</h2>
                <table className="statement-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Beginning Retained Earnings</strong></td>
                            <td>${(0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td> 
                        </tr>
                        <tr>
                            <td><strong>Net Income</strong></td>
                            <td>
                                <strong>
                                    ${(
                                        (incomeStatement.totalRevenue || 0) - 
                                        (incomeStatement.totalExpense || 0)
                                    ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Total Retained Earnings</strong></td>
                            <td>
                                <strong>
                                    ${(
                                        (0) + // Starting retained earnings
                                        ((incomeStatement.totalRevenue || 0) - (incomeStatement.totalExpense || 0))
                                    ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            )}                                              
            </div>
        </div>
    ) 
};

export default Statements;