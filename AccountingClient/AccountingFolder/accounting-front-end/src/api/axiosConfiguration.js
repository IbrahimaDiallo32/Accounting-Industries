import axios from 'axios';


const API_URL = "http://localhost:8080/hey";
const API_URLS = "http://localhost:8080/";
const API_URL2 = "http://localhost:8080/hey/create";

// Fetch all users
export const getAllUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching users", error);
    }
};

//Fetch user based on the username given 
export const getUserByUsername = async () => {
    try {
        const response = await axios.get(API_URLS);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching users", error);
    }
};



// Add a new user
export const addUser = async (user) => {
    try {
        console.log("yipee it worked")
        const response = await axios.post(API_URL2, user);
        console.log("yipee it worked")
        return response.data;
    } catch (error) {
        console.log("Adding user didnt work sad face");
        console.error("Error adding user", error);
    }
};
