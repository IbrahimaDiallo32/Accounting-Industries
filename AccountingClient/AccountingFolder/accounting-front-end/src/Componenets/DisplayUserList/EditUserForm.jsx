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
    const [existingIds, setExistingIds] = useState(new Set());

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        accountType: user?.accountType || '',
        address: user?.address || '',
        accountStatus: user?.accountStatus || '',
    });

    const originalData = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        accountType: user?.accountType,
        address: user?.address,
        accountStatus: user?.accountStatus,
    };

    const getChangeStrings = () => {
        let beforeChanges = '';
        let afterChanges = '';

        const fields = ['firstName', 'lastName', 'email', 'accountType', 'address', 'accountStatus'];
        fields.forEach((field) => {
            if (formData[field] !== originalData[field]) {
                beforeChanges += `${field}: ${originalData[field] || 'N/A'}. `;
                afterChanges += `${field}: ${formData[field]}.  `;
            }
        });

        console.log("Before Changes:", beforeChanges);
        console.log("After Changes:", afterChanges);
        return { beforeChanges, afterChanges };
    };

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

    useEffect(() => {
        // You can re-initialize form fields when user changes
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setAccountType(user.accountType);
            setAddress(user.address);
        }

        const fetchEventLogs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/getAll');
                const ids = response.data.map(event => event.eventID); // Extract event IDs
                setExistingIds(new Set(ids)); // Store IDs in a Set for quick lookup
            } catch (error) {
                console.error('Error fetching event logs:', error);
            }
        };
        fetchEventLogs();

    }, [user]);

    const checkme = () => {

        const { beforeChanges, afterChanges } = getChangeStrings();
        console.log(beforeChanges)
        console.log(afterChanges)
    }

    const generateEventId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let eventId;

        do {
            eventId = Array.from({ length: 5 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        } while (existingIds.has(eventId)); // Check uniqueness

        return eventId;
    };

    const dateAndTimeToday = () => {
        const today = new Date();
        const thisMonth = today.getMonth() + 1;
        const thisDate = today.getDate();
        const thisYear = today.getFullYear();
        const date = `${thisMonth}/${thisDate}/${thisYear}`;
        const currentTime = today.toLocaleTimeString("en-US", {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        return date + ", " + currentTime;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // This prevents the page from reloading when the form is submitted.
        //This sensda a post with JSON formatted data to the Backend API via this URL with instructions for handling confugured in Spring boot 

        try {
            //patches the user information 
            const response = await axios.patch(`http://localhost:8080/hey/edit/${originalUsername}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                email: formData.email,
                accountType: formData.accountType,
                accountStatus: formData.accountStatus
            });
            alert("User successfully edited!"); //notifies user edit was successful
            window.location.reload(true); //refreshes the page so the chages can be realized
        } catch (error) {
            console.error('Error creating user:', error);
        }
        try {
            // Log the edit event
            const { beforeChanges, afterChanges } = getChangeStrings();
            const storedUser = JSON.parse(localStorage.getItem("currentUser"));
            const fullName = storedUser.firstName + " " + storedUser.lastName;
            const response2 = await axios.post('http://localhost:8080/api/create', {
                username: storedUser.username,
                modifiedBy: fullName,
                eventType: 'User Edited',
                dateAndTime: dateAndTimeToday(),
                beforeChange: beforeChanges,
                afterChange: afterChanges,
                eventID: generateEventId()
            });
        } catch (error) {
            console.error("Error logging event", error);
        }

    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
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
                            <input value={formData.firstName} id="firstName" className='registrationInput'
                                onChange={handleChange} placeholder='First Name' />
                        </div>
                        <div className='Field'>
                            <label>Last name <sup>*</sup></label>
                            <input value={formData.lastName} id="lastName" className='registrationInput'
                                onChange={handleChange} placeholder='Last Name' />
                        </div>
                        <div className='Field'>
                            <label>Address <sup>*</sup></label>
                            <input value={formData.address} id="address" className='registrationInput'
                                onChange={handleChange} placeholder='Address' />
                        </div>
                        <div className='Field'>
                            <label>Email Address <sup>*</sup></label>
                            <input value={formData.email} id="email" className='registrationInput'
                                onChange={handleChange} placeholder='Email Address' />
                        </div>
                        <div className='Field'>
                            <label>Role <sup>*</sup></label>
                            <select value={formData.accountType} id="accountType" onChange={handleChange}>
                                <option value="role" disabled>Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>
                        <div className='Field'>
                            <label>User Status <sup>*</sup></label>
                            <select value={formData.accountStatus} id="accountStatus" onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <button type="submit" disabled={!getIsFormValid()} className='RegistrationButton'>Update User</button>
                    </fieldset>
                </form>
            </div>
            <button onClick={checkme}>dsf</button>
        </div>
    );
}

export default EditUserForm;
