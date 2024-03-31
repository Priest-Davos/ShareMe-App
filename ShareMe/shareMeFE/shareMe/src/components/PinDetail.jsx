import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md'; // Download icon
import { Link, useParams } from 'react-router-dom'; // useParams hook for accessing URL parameters
import { v4 as uuidv4 } from 'uuid'; // UUID generator

import { client, urlFor } from '../client'; // Sanity client and urlFor function for fetching and displaying images
import MasonryLayout from './MasonryLayout'; // MasonryLayout component for displaying pins in a grid layout
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'; // Queries for fetching pin details and related pins
import Spinner from './Spinner'; // Spinner component for showing loading state

const PinDetail = ({ user }) => {
  const { pinId } = useParams(); // Get pinId from URL params
  const [pins, setPins] = useState(); // State for storing related pins
  const [pinDetail, setPinDetail] = useState(); // State for storing pin details
  const [comment, setComment] = useState(''); // State for storing new comment
  const [addingComment, setAddingComment] = useState(false); // State for indicating comment addition process

  // Function to fetch pin details and related pins
  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId); // Construct query to fetch pin details

    if (query) {
      // Fetch pin details
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]); // Set pin details state
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]); // Construct query to fetch related pins
          // Fetch related pins
          client.fetch(query1).then((res) => {
            setPins(res); // Set related pins state
          });
        }
      });
    }
  };
  // -> Fetch pin details and related pins on component mount and pinId change
  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  // Function to add comment to pin
  const addComment = () => {
    if (comment) {
      setAddingComment(true); // Set addingComment state to true to indicate comment addition process

      // Patch operation to add comment to pin document
      client
        .patch(pinId)
        .setIfMissing({ comments: [] }) // Set comments array if not present
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetails(); // Refetch pin details to update comments
          setComment(''); // Clear comment input field
          setAddingComment(false); // Reset addingComment state
        });
    }
  };

  //-> Render loading spinner while fetching pin details
  if (!pinDetail) {
    return (
      <Spinner message="Showing pin" />
    );
  }

  return (
    <>
      {/* Render pin details */}
      {pinDetail && (
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={(pinDetail?.image && urlFor(pinDetail?.image).url())} // Render pin image
              alt="user-post"
            />
          </div>

          <div className="w-full p-5 flex-1 xl:min-w-620">
            {/* Render pin details */}
            <div className="flex items-center justify-between">
              {/* Download pin image */}
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {/*console.log(pinDetail.destination)*/}
                {pinDetail.destination}
              </a>
            </div>

            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>

            {/* Link to user profile */}
            <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
              <img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>

            {/* Render comments */}
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item,i) => (
                <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
                  <img
                    src={item.postedBy?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add comment section */}
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {/* Button to add/post comment */}
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Posting in process...' : 'Post'}
              </button>
            </div>


          </div>
        </div>
      )}


      {/* Render related pins */}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {/* Render MasonryLayout for related pins */}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}

      
    </>
  );
};

export default PinDetail;
