import React from 'react';
import {Bars as Loader} from 'react-loader-spinner'; // Import Loader component from react-loader-spinner

// Spinner component
const Spinner=({ message })=> {
  return (

    // Container div with flexbox to center content vertically and horizontally
    <div className="flex flex-col justify-center items-center w-full h-full">
       
    {/* Loader component */}
      <Loader
        type="Ball Triangle" // Loader type (you can choose different types)
        color="#00BFFF" // Loader color
        height={70} // Loader height
        width={100} // Loader width
        ariaLabel="loading"
        className="m-5" // Additional CSS classes for styling
        wrapperStyle
        wrapperClass
      />

      {/* Message to display below the loader */}
      <p className="text-lg text-center px-2">{message}</p>
    
      </div>
  );
}

export default Spinner;
