import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewUserForm.css'
import { IoArrowBack } from 'react-icons/io5';

function RegistrationForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [email, setEmail] = useState('');
    const [existingIds, setExistingIds] = useState(new Set()); // Track existing IDs
    const [newEventId, setNewEventId] = useState(''); // Store generated ID  

    const [accountType, setAccountType] = useState("role");


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
        setBirthDate("");
        setBirthMonth("");
        setBirthYear("");
        setEmail("");
        setAccountType("role");
    };


    const accountStatus = () => {
        if (accountType == 'Admin') {
            return "active";
        }
        return "inactive";
    };


    const dateToday = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        const currentDate = month + "/" + date + "/" + year;
        return currentDate;
    };

    useEffect(() => {
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
    }, []);

    const generateEventId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let eventId;

        do {
            eventId = Array.from({ length: 5 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        } while (existingIds.has(eventId)); // Check uniqueness

        return eventId;
    };

    const dateForUserName = () => {
        const today = new Date();
        const thisMonth = today.getMonth() + 1;
        const thisYear = today.getFullYear();
        const twoDigitYear = thisYear % 100;

        if (thisMonth < 10) {
            return `0${thisMonth}${twoDigitYear}`;
        }
        return `${thisMonth}${twoDigitYear}`;
    };

    const handleSubmit = async (e) => {
        const today = new Date();
        const currentTime = today.toLocaleTimeString("en-US", {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        generateEventId();
        const dbUserName = firstName.charAt(0) + lastName.toLowerCase() + dateForUserName();
        const fullName = firstName + lastName;
        const dateTime = dateToday() + ", " + currentTime;
        e.preventDefault(); // This prevents the page from reloading when the form is submitted.
        //This sensda a post with JSON formatted data to the Backend API via this URL with instructions for handling confugured in Spring boot 
        try {

            const response = await axios.post('http://localhost:8080/hey/create', {
                firstName,
                lastName,
                address,
                birthMonth,
                birthDate,
                birthYear,
                email,
                accountStatus: accountStatus(),
                accountType,
                userName: dbUserName,
                accountCreatedDate: dateToday()
            });
            alert("Account created!"); //notifies user successful
            clearForm(); //clears data if account successfully created
            // const response2 = await axios.get('http://localhost:8080/hey/create')
        } catch (error) {
            console.error('Error creating user:', error);
        }

        try {
            // Log the user creation event
            const response2 = await axios.post('http://localhost:8080/api/create', {
                username: dbUserName,
                modifiedBy: fullName,
                eventType: 'User Created',
                dateAndTime: dateTime,
                beforeChange: "~",
                afterChange: "User is created",
                eventID: newEventId
            });
        } catch (error) {
            console.error("Error logging event", error);
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
                    <h2 className='registerText'>NEW USER</h2>
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
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                                <select name="birthDate" className='birthDateSelect' value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)} >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                </select>
                                <select name='birthYear' className='dateOfBirthRegistration' value={birthYear}
                                    onChange={(e) => setBirthYear(e.target.value)}>
                                    <option value="1920">1920</option>
                                    <option value="1921">1921</option>
                                    <option value="1922">1922</option>
                                    <option value="1923">1923</option>
                                    <option value="1924">1924</option>
                                    <option value="1925">1925</option>
                                    <option value="1926">1926</option>
                                    <option value="1927">1927</option>
                                    <option value="1928">1928</option>
                                    <option value="1929">1929</option>
                                    <option value="1930">1930</option>
                                    <option value="1931">1931</option>
                                    <option value="1932">1932</option>
                                    <option value="1933">1933</option>
                                    <option value="1934">1934</option>
                                    <option value="1935">1935</option>
                                    <option value="1936">1936</option>
                                    <option value="1937">1937</option>
                                    <option value="1938">1938</option>
                                    <option value="1939">1939</option>
                                    <option value="1940">1940</option>
                                    <option value="1941">1941</option>
                                    <option value="1942">1942</option>
                                    <option value="1943">1943</option>
                                    <option value="1944">1944</option>
                                    <option value="1945">1945</option>
                                    <option value="1946">1946</option>
                                    <option value="1947">1947</option>
                                    <option value="1948">1948</option>
                                    <option value="1949">1949</option>
                                    <option value="1950">1950</option>
                                    <option value="1951">1951</option>
                                    <option value="1952">1952</option>
                                    <option value="1953">1953</option>
                                    <option value="1954">1954</option>
                                    <option value="1955">1955</option>
                                    <option value="1956">1956</option>
                                    <option value="1957">1957</option>
                                    <option value="1958">1958</option>
                                    <option value="1959">1959</option>
                                    <option value="1960">1960</option>
                                    <option value="1961">1961</option>
                                    <option value="1962">1962</option>
                                    <option value="1963">1963</option>
                                    <option value="1964">1964</option>
                                    <option value="1965">1965</option>
                                    <option value="1966">1966</option>
                                    <option value="1967">1967</option>
                                    <option value="1968">1968</option>
                                    <option value="1969">1969</option>
                                    <option value="1970">1970</option>
                                    <option value="1971">1971</option>
                                    <option value="1972">1972</option>
                                    <option value="1973">1973</option>
                                    <option value="1974">1974</option>
                                    <option value="1975">1975</option>
                                    <option value="1976">1976</option>
                                    <option value="1977">1977</option>
                                    <option value="1978">1978</option>
                                    <option value="1979">1979</option>
                                    <option value="1980">1980</option>
                                    <option value="1981">1981</option>
                                    <option value="1982">1982</option>
                                    <option value="1983">1983</option>
                                    <option value="1984">1984</option>
                                    <option value="1985">1985</option>
                                    <option value="1986">1986</option>
                                    <option value="1987">1987</option>
                                    <option value="1988">1988</option>
                                    <option value="1989">1989</option>
                                    <option value="1990">1990</option>
                                    <option value="1991">1991</option>
                                    <option value="1992">1992</option>
                                    <option value="1993">1993</option>
                                    <option value="1994">1994</option>
                                    <option value="1995">1995</option>
                                    <option value="1996">1996</option>
                                    <option value="1997">1997</option>
                                    <option value="1998">1998</option>
                                    <option value="1999">1999</option>
                                    <option value="2000">2000</option>
                                    <option value="2001">2001</option>
                                    <option value="2002">2002</option>
                                    <option value="2003">2003</option>
                                    <option value="2004">2004</option>
                                    <option value="2005">2005</option>
                                    <option value="2006">2006</option>
                                    <option value="2007">2007</option>
                                    <option value="2008">2008</option>
                                    <option value="2009">2009</option>
                                    <option value="2010">2010</option>
                                    <option value="2011">2011</option>
                                    <option value="2012">2012</option>
                                </select>
                                <input placeholder='' hidden></input>
                                {/* <input value={birthMonth} className='registrationInput'
                                onChange={(e) => setBirthMonth(e.target.value)}
                                placeholder='Date of Birth' /> */}
                            </div>
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
                        <button type="submit" disabled={!getIsFormValid()} className='RegistrationButton'>Create User</button>
                        {/* button disabled until form is valid */}
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default RegistrationForm;
