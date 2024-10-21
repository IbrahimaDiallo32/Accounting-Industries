import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewUserForm.css'
import { IoArrowBack } from 'react-icons/io5';

function EditUserForm({ user }) {
    const originalUsername = user.username;
    // This autopopulates the fields with the user data
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [accountType, setAccountType] = useState(user?.accountType || '');
    const [address, setAddress] = useState(user?.address || '');

    // Validate email format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Check if the form is valid
    const getIsFormValid = () => {
        return (
            firstName &&
            validateEmail(email) &&
            accountType !== "role"
        );
    };

    // Clear the form fields
    const clearForm = () => {
        setFirstName("");
        setLastName("");
        setAddress("");
        setEmail("");
        setAccountType("role");
    };

    // Use effect to reset form fields when user changes
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setAccountType(user.accountType);
            setAddress(user.address);
        }
    }, [user]);

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Capture the before state of the user
        const beforeChange = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accountType: user.accountType,
            address: user.address,
        };

        try {
            // Update the user information
            const response = await axios.patch(`http://localhost:8080/hey/edit/${originalUsername}`, {
                firstName,
                lastName,
                address,
                email,
                accountType
            });
            alert("Account updated!"); // Notify user of success

              // Prepare the after state of the user
              const afterChange = {
                firstName,
                lastName,
                email,
                accountType,
                address,
            };

            // Determine what has changed
            const changes = [];
            for (const [key, beforeValue] of Object.entries(beforeChange)) {
                const afterValue = afterChange[key];
                if (beforeValue !== afterValue) {
                    changes.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${beforeValue} → ${afterValue}`);
                }
            }
            const changeDescription = changes.join(', ');
    
            // Log the user modification event
            await axios.post('http://localhost:8080/api/modify', {
                username: originalUsername,
                action:"User Modified", 
                beforeChange,
                afterChange,
                changeDescription
            });

            clearForm(); //clears data if account successfully created
            window.location.reload(true); 
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

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
                        <button type="submit" disabled={!getIsFormValid()} className='RegistrationButton'>Update Account</button>
                        {/* button disabled until form is valid */}
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default EditUserForm;
