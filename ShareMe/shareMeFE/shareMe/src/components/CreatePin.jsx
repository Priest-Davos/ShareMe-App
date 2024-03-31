import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai'; // Cloud upload icon
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import { MdDelete } from 'react-icons/md'; // Delete icon

import { categories } from '../utils/data'; // Predefined categories for pins
import { client } from '../client'; // Sanity client for database interactions
import Spinner from './Spinner'; // Component to display loading spinner

const CreatePin = ({ user }) => {
  console.log(user)
  // State variables for managing pin creation form
  const [title, setTitle] = useState(''); // Title of the pin
  const [about, setAbout] = useState(''); // Description of the pin
  const [loading, setLoading] = useState(false); // Loading state
  const [destination, setDestination] = useState(''); // Destination URL
  const [fields, setFields] = useState(false); // State to indicate missing fields
  const [category, setCategory] = useState(''); // Category of the pin
  const [imageAsset, setImageAsset] = useState(null); // Uploaded image asset
  const [wrongImageType, setWrongImageType] = useState(false); // State for wrong image type
  const [uploadError, setUploadError] = useState('');
  
  const navigate = useNavigate(); // Navigation hook

  // Function to handle image upload
  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];

     // Check if the selected file is an allowed image type
     const validTypes = ['image/png', 'image/svg', 'image/jpeg', 'image/gif', 'image/tiff'];
     if (selectedFile && validTypes.includes(selectedFile.type)) {
       setWrongImageType(false);
       setLoading(true);

      client.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
          setImageAsset(document); // Set uploaded image asset
          setLoading(false); // Reset loading state
        })
        .catch((error) => {
          console.log('Upload failed:', error.message); // Log upload failure
          setUploadError('Upload failed, please try again.');//
          setLoading(false); // Reset loading state
        });
    } else {
      setLoading(false);
      setWrongImageType(true); // Set state to indicate wrong image type
    }
  };

  // Function to save the pin
  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      
      // Check if all required fields are filled
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user._id, // Reference to the user who created the pin
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      };
      // Create the pin document in the database
      client.create(doc).then(() => {
        navigate('/'); // Navigate to the home page after saving
      });
    } 
    else {
      setFields(true); // Indicate missing fields
      setTimeout(() => {
        setFields(false); // Reset field check after 2 seconds
      }, 2000);
    }
  };

  // Component render
  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">

      {/* Notification for missing fields */}
      {fields && <p className="text-red-500 mb-5 text-xl transition-all duration-199 ease-in ">Please add all fields.</p>}

      {uploadError && <p className="text-red-500 mb-5 text-xl">{uploadError}</p>}

      {/* Pin creation form */}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">

        {/* Image upload section */}
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
         
        {/* Container for uploading or displaying the selected image */}
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {/* Display loading spinner if uploading */}
            {loading && <Spinner />}
            {/* Notification for wrong file type */}
            {wrongImageType && <p>It's the wrong file type.</p>}
            {/* Render upload input if no image is selected */}
            {!imageAsset ? (
              // Upload label and input
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">Recommendation: Use high-quality images less than 20MB</p>
                </div>
                <input type="file" name="upload-image" onChange={uploadImage} className="w-0 h-0" />
              </label>
            ) 
            : (
              // Render uploaded image
              <div className="relative h-full">
                <img src={imageAsset?.url} alt="uploaded-pic" className="h-full w-full" />
                {/* Button to delete the uploaded image */}
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>


        { /* Form section for pin details */}
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          
          {/* Display user avatar and name */}
          {user && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
              <img src={user.image} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          {/* Description of pin */}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone what your Pin is about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {/* Destination of pin */}
          <input
            type="url"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {/* Dropdown to select pin category */}
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Category</p>
              <select
                onChange={(e) => {setCategory(e.target.value); }}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Select Category</option>
                {/* Map through categories and render options */}
                {categories.map((item) => (
                  <option key={item.name} className="text-base border-0 outline-none capitalize bg-white text-black " value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Button to save the pin */}
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default CreatePin;
