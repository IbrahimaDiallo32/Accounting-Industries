import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewUserForm.css'
import { IoArrowBack } from 'react-icons/io5';

function EditUserForm({ user }) {
    const originalUsername = user.username;
    //this autopopulates the fields with the user data
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [accountType, setAccountType] = useState(user?.accountType || '');
    const [address, setAddress] = useState(user?.address || '');
    const [accountStatus, setAccountStatus] = useState(user?.accountStatus);


    const validateEmail = (email) => { //This method makes sure the email is valid
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const getIsFormValid = () => {
        return (
            firstName &&
            validateEmail(email) &&
            accountType !== "role"
        );
    };

    const clearForm = () => {
        setFirstName("");
        setLastName("");
        setAddress("");
        setEmail("");
        setAccountType("role");
    };

    useEffect(() => {
        // You can re-initialize form fields when user changes
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setAccountType(user.accountType);
            setAddress(user.address);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // This prevents the page from reloading when the form is submitted.
        //This sensda a post with JSON formatted data to the Backend API via this URL with instructions for handling confugured in Spring boot 

        try {
            //patches the user information 
            const response = await axios.patch(`http://localhost:8080/hey/edit/${originalUsername}`, {
                firstName,
                lastName,
                address,
                email,
                accountType,
                accountStatus: accountStatus
            });
            alert("User successfully edited!"); //notifies user edit was successful
            window.location.reload(true); //refreshes the page so the chages can be realized
        } catch (error) {
            console.error('Error creating user:', error);
        }

    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [id]: value
        }));
    }


    return (
        <div className='RegistrationContainer'>
            <header className='logoForRegistration'>
                <button className='backButtonRegistration'><IoArrowBack /><a href="/DisplayUserList">BACK</a></button>
                <div className='shiftForRegis'>
                    <img src="/AIT.PNG" width={100} height={100} alt="Logo" className='shiftForRegistation' />
                    <h2 className='registerText'>EDIT USER</h2>
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
                        <div className='Field'>
                            <label>Email Address <sup>*</sup></label>
                            <input value={email} className='registrationInput'
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email Address' />
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
                        <div className='Field'>
                            <label>User Status <sup>*</sup></label>
                            <select value={accountStatus} onChange={(e) => setAccountStatus(e.target.value)}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <button type="submit" disabled={!getIsFormValid()} className='RegistrationButton'>Update Account</button>
                        {/* button disabled until form is valid */}
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default EditUserForm;
