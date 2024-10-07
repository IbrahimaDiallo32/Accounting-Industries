import './RegistrationForm.css';
import React, { useState } from 'react';
import axios from 'axios';
import { IoArrowBack } from "react-icons/io5";

function RegistrationForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [email, setEmail] = useState('');
    const [accountType, setAccountType] = useState("role");
    const [password, setPassword] = useState({
        value: "",
        isTouched: false,
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);

    const passwordHasNumber = /\d/;

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const hasSpecialCharacter = (password) => {
        const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
        return specialCharacterRegex.test(password);
    };

    const startsWithLetter = (password) => {
        const letterRegex = /^[A-Za-z]/;
        return letterRegex.test(password);
    };

    const getIsFormValid = () => {
        return (
            firstName &&
            validateEmail(email) &&
            password.value.length >= 8 &&
            passwordHasNumber.test(password.value) &&
            hasSpecialCharacter(password.value) &&
            startsWithLetter(password.value) &&
            password.value === confirmPassword &&
            accountType !== "role"
        );
    };

    const clearForm = () => {
        setFirstName("");
        setLastName("");
        setAddress("");
        setBirthDate("");
        setBirthMonth("");
        setBirthYear("");
        setEmail("");
        setPassword({
            value: "",
            isTouched: false,
        });
        setConfirmPassword('');
        setAccountType("role");
    };

    const accountStatus = () => accountType === 'Admin' ? "active" : "inactive";

    const dateToday = () => {
        const today = new Date();
        const thisMonth = today.getMonth() + 1;
        const thisDate = today.getDate();
        const thisYear = today.getFullYear();
        return `${thisMonth}/${thisDate}/${thisYear}`;
    };

    const dateForUserName = () => {
        const today = new Date();
        const thisMonth = today.getMonth() + 1;
        const thisYear = today.getFullYear();
        const twoDigitYear = thisYear % 100;
        return (thisMonth < 10 ? "0" + thisMonth : thisMonth) + twoDigitYear;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dbUserName = firstName.charAt(0) + lastName.toLowerCase() + dateForUserName();

        try {
            const response = await axios.post('http://localhost:8080/hey/create', {
                firstName,
                lastName,
                address,
                birthMonth,
                birthDate,
                birthYear,
                email,
                password: password.value,
                accountStatus: accountStatus(),
                accountType,
                username: dbUserName,
                accountCreatedDate: dateToday(),
                passwordIsExpired: false
            });
            alert("Account created! Your log in username is: " + dbUserName);
            clearForm();
        } catch (error) {
            console.error('Error creating user:', error);
        }

        try {
            await axios.post('http://localhost:8080/api/events/log', {
                dbUserName,
                action: 'User Created',
                accountCreatedDate: dateToday()
            });
        } catch (error) {
            console.error("Error logging event", error);
        }
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(password.value === e.target.value);
    };

    return (
        <div className='RegistrationContainer'>
            <header className='logoForRegistration'>
                <a href="/"><button className='backButtonRegistration'><IoArrowBack />BACK</button></a>
                <div className='shiftForRegis'>
                    <img src="/AIT.PNG" width={100} height={100} alt="Logo" className='shiftForRegistation' />
                    <h2 className='registerText'>REGISTER</h2>
                    <img src="/AIT.PNG" width={100} height={100} className='regLogo2' alt="Logo" />
                </div>
            </header>

            <hr className='solidLineRegister' />

            <div className='registrationInnerContainer'>
                <form onSubmit={handleSubmit} className='RegForm'>
                    <fieldset>
                        <div className='Field'>
                            <label>First name <sup>*</sup></label>
                            <input value={firstName} className='registrationInput'
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder='First Name' />
                        </div>
                        <div className='Field'>
                            <label>Last name <sup>*</sup></label>
                            <input value={lastName} className='registrationInput'
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder='Last Name' />
                        </div>
                        <div className='Field'>
                            <label>Address <sup>*</sup></label>
                            <input value={address} className='registrationInput'
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder='Address' />
                        </div>
                        <div className='regDateOfBirthContainer'>
                            <div className='birthField'>
                                <label className='birthDateTextField'>Birthdate<sup>*</sup></label>
                                <select name="birthMonth" className='dateOfBirthRegistration' value={birthMonth}
                                    onChange={(e) => setBirthMonth(e.target.value)}>
                                    {/* Month options */}
                                </select>
                                <select name="birthDate" className='birthDateSelect' value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)} >
                                    {/* Day options */}
                                </select>
                                <select name='birthYear' className='dateOfBirthRegistration' value={birthYear}
                                    onChange={(e) => setBirthYear(e.target.value)}>
                                    {/* Year options */}
                                </select>
                            </div>
                        </div>
                        <div className='Field'>
                            <label>Email Address <sup>*</sup></label>
                            <input value={email} className='registrationInput'
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email Address' />
                        </div>
                        <div className='passwordFieldRegistration'>
                            <label>Password <sup>*</sup></label>
                            <input value={password.value} type='password' className='registrationInput'
                                onChange={(e) => setPassword({ ...password, value: e.target.value })}
                                onBlur={() => setPassword({ ...password, isTouched: true })}
                                placeholder="Password" />
                            {/* Password validation messages */}
                        </div>
                        <div className='Field'>
                            <label>Confirm Password <sup>*</sup></label>
                            <input  
                                type='password'
                                className={`registrationInput ${passwordMatch ? "" : "input-error-border"}`}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={handleConfirmPassword}
                            />
                            {!passwordMatch && <div className="input-error">Passwords do not match</div>}
                        </div>
                        <div className='Field'>
                            <label>Role <sup>*</sup></label>
                            <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                                <option value="role" disabled>Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>
                        <button type="submit" disabled={!getIsFormValid()} className='RegistrationButton'>
                            Create Account
                        </button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default RegistrationForm;
