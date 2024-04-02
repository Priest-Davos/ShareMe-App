import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google'; // Import Google logout function

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'; // Import data queries
import { client } from '../client'; // Import Sanity client for database interaction
import MasonryLayout from './MasonryLayout'; // Import MasonryLayout component
import Spinner from './Spinner'; // Import Spinner component

// Styles for active and inactive buttons
const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
  const [user, setUser] = useState(); // State variable for user data
  const [pins, setPins] = useState(); // State variable for user pins
  const [text, setText] = useState('Created'); // State variable for tab text
  const [activeBtn, setActiveBtn] = useState('created'); // State variable for active tab
  const navigate = useNavigate(); // Navigation hook
  const { userId } = useParams(); // Get user ID from URL params
  // const useParamobj=useParams()
  // console.log(useParamobj)

  const User = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear(); // Get user data from local storage

  // Fetch user details based on user ID
  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
      // console.log(`User Data ${data[0]}`)
    });
  }, [userId]);


  // Fetch user pins based on selected tab
  useEffect(() => {
    if (text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery).then((data) => {
        // console.log(`created Piins ${data}`)
        setPins(data);
      });
    } else {//fetch saved pins
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  // Function to handle logout
  const logout = () => {

    localStorage.clear(); // Clear local storage
    googleLogout();
    navigate('/login'); // Navigate to login page
  };

  // Render loading spinner if user data is not available
  if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            {/* Random background image */}
            <img
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            {/* User profile picture */}
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
          </div>
          {/* User profile name */}
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>

        </div>
        <div className="absolute top-0 z-1 right-0 p-2">
          {/* Logout button */}
          {userId === User.id && (

            <button
              type="button"
              className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
              onClick={() => logout()}

            >
              <AiOutlineLogout color="red" fontSize={33} />
            </button>
          )}
        </div>
        {/* Tab buttons */}
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('created');
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Saved
          </button>
        </div>

        {/* show pins according to tabs .ie "saved" || "created" */}
        {pins  && (
        <div className="px-2">
          {/* Render user pins */}
          <MasonryLayout pins={pins} />
        </div>)}

        {/* Render message if no pins found */}
        {pins?.length === 0 && (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
            No Pins Found!
          </div>
        )}
      </div>

    </div>
  );
};

export default UserProfile;
