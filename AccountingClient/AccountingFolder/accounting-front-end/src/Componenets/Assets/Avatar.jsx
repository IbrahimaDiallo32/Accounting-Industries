import React from 'react'
import './Avatar.css'

const Avatar = ({ name }) => {
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
    const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";

    return (
        <span className="user-profile-image">
            {firstNameInitial}
            {lastNameInitial}
        </span>
    );
};

export default Avatar;