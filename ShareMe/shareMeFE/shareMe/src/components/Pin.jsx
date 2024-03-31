import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // For routing and navigation
import { v4 as uuidv4 } from 'uuid'; // To generate unique identifiers
import { MdDownloadForOffline } from 'react-icons/md'; // Icon for downloading content
import { AiTwotoneDelete } from 'react-icons/ai'; // Icon for deleting content
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'; // Icon for external links

import { client, urlFor } from '../client'; // Importing client for interacting with Sanity CMS

const Pin = ({ pin }) => {
  // console.log(pin)

  // State variables for managing pin hover and saving state
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate(); // Hook for navigating to different routes

  const { postedBy, image, _id, destination } = pin; // Destructuring pin object

  // Retrieving user information from local storage or clearing if not available
  const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  // Function to delete a pin
  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload(); // Reloading the page after deleting the pin
      });
  };

  // Checking if the pin is already saved by the user
  let alreadySaved = pin?.save?.filter((item) => item?.postedBy?._id === user?.id);
  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  // Function to save a pin to sanity
  const savePin = (id) => {
    // If the pin is not already saved, save it
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      // Patching the pin document to add the user's save action
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{ // Inserting the save action after the last save
          _key: uuidv4(), // Generating a unique key for the save action
          userId: user?.id, // User ID who saved the pin
          postedBy: {
            _type: 'postedBy',
            _ref: user?.id,
          },
        }])
        .commit()
        .then(() => {
          window.location.reload(); // Reloading the page after saving the pin
          setSavingPost(false); // Reset saving state to false
        });
    }
  };

  return (
    <div className="m-2">
      {/* Div for rendering pin image */}
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)} // Navigate to pin detail page on click
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {/* Render pin image */}
        {image && (
          <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" />
        )}
        {/* Additional options when hovering over the pin */}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {/* Button to download pin image */}
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {/* Button to save pin */}
              {alreadySaved?.length !== 0 ? (
                <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                  {pin?.save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id); // Call savePin function on click
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length} {savingPost ? 'Saving' : 'Save'}
                </button>
              )}
            </div>


            {/* Additional actions like opening pin destination or deleting pin */}
            <div className="flex justify-between items-center gap-2 w-full">
              {/* Link to pin destination */}
              {destination?.slice(8).length > 0 ? (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination?.slice(8, 17)}...
                </a>
              ) : undefined}
              {/* Delete pin button (visible only if user is the owner of the pin) */}
              {postedBy?._id === user?.id && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id); // Call deletePin function on click
                  }}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Link to user profile */}
      <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
