import React from "react";
import "./ProfileCard.css"; 
import {useState} from 'react'



function ProfileCard() {
    const [val, setVal] = useState("");
  return (
    <div className="profile-card">
      <img
        className="profile-image"
        src="https://picsum.photos/200"
        alt="Something went wrong"
      />
      <h2 className="profile-name">Aditya Raj</h2>
      <p className="profile-role">Software Engineer</p>
      <button className="profile-button" onClick={() => setVal("Welcome!")}>
        Click Here
      </button>
      <h2>{val}</h2>
    </div>
  );
}

export default ProfileCard;
