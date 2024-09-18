import './RegistrationForm.css'
import HomePage from '../home/HomePage';
import React, { useState } from 'react';

const PasswordLengthErrorMessage = () => {
    return (
        <p className='FieldError'> Password should have at least 8 charcters</p>
    );
};

const PasswordNumberErrorMessage = () => {
    return (
        <p className='FieldError'> Password should have at least 1 Number</p>
    );
};

function RegistrationForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState({
        value: " ",
        isTouched: false,
    });
    const [role, setRole] = useState("role");

    const getIsFormValid = () => {
        return (
            firstName &&
            // validateEmail(email) &&
            password.value.length >= 8 &&
            role !== "role"
        );
    };
    const clearForm = () => {
        setFirstName("");
        setLastName("");
        setAddress("");
        setDob("");
        setEmail("");
        setPassword({
            value: "",
            isTouched: false,
        });
        setRole("role");
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Account created!")
        clearForm();
    };
    const passwordHasNumber = /\d/;

    return (
        <div className='RegistrationContainer'>
            <header>
                <img src="/AIT.PNG" width={100} height={100}></img>
                <h2>Sign Up</h2>
            </header>

            <div className='registration'>
                <form onSubmit={handleSubmit} className='RegForm'>
                    <fieldset>
                        <div className='Field'>
                            <label>First name <sup>*</sup> </label>
                            <input value={firstName} className='registrationInput'
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                }}
                                placeholder='First Name' />
                        </div>
                        <div className='Field'>
                            <label>Last name <sup>*</sup></label>
                            <input value={lastName} className='registrationInput'
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                }}
                                placeholder='Last Name' />
                        </div>
                        <div className='Field'>
                            <label>Address <sup>*</sup></label>
                            <input value={address} className='registrationInput'
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                }}
                                placeholder='Address' />
                        </div>
                        <div className='Field'>
                            <label>Date of Birth <sup>*</sup></label>
                            <input value={dob} className='registrationInput'
                                onChange={(e) => {
                                    setDob(e.target.value);
                                }}
                                placeholder='Date of Birth' />
                        </div>
                        <div className='Field'>
                            <label>
                                Email Address <sup>*</sup>
                            </label>
                            <input
                                value={email} className='registrationInput'
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                placeholder='Email Address' />
                        </div>
                        <div className='Field'>
                            <label>
                                Password <sup>*</sup>
                            </label>
                            <input value={password.value} type='password' className='registrationInput'
                                onChange={(e) => {
                                    setPassword({ ...password, value: e.target.value });
                                }}
                                onBlur={() => {
                                    setPassword({ ...password, isTouched: true });
                                }}
                                placeholder="Password" />
                            {password.isTouched && password.value.length < 8 ? (
                                <PasswordLengthErrorMessage />
                            ) : null}
                            {password.isTouched && passwordHasNumber.test(password.value) ? (
                                <PasswordNumberErrorMessage />
                            ) : null}
                        </div>
                        <div className='Field'>
                            <label> Role <sup>*</sup></label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="admin">Admin</option>
                                <option value="acountant">Accountant</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                        <button type="submit" disabled={!getIsFormValid()} className='RegistrationButton'>Create Account</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}
export default RegistrationForm;  