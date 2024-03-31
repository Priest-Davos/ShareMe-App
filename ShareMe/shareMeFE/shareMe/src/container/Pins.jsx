import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import necessary components from '../components'
import Navbar from '../components/Navbar';
import Feed from '../components/Feed';
import PinDetail from '../components/PinDetail';
import CreatePin from '../components/CreatePin';
import Search from '../components/Search';

// Pins Component
const Pins = ({ user }) => {
  // State for managing search term
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="px-2 md:px-5">

      {/* Navbar component for navigation and search */}
      <div className="bg-gray-50">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user && user} />
      </div>

      {/* Main content area */}
      <div className="h-full">
        {/* Routes for different URLs */}
        <Routes>
          {/* Route for home page and category pages */}
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />

          {/* Route for displaying pin details */}
          <Route path="/pin-detail/:pinId" element={<PinDetail user={user && user} />} />

          {/* Route for creating a new pin */}
          <Route path="/create-pin" element={<CreatePin user={user && user} />} />

          {/* Route for searching pins */}
          <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        </Routes>
      </div>
      
    </div>
  );
};

export default Pins;





// Imports: Import necessary components from the ../components directory.
// Pins Component: Define the Pins functional component that takes a user prop.
// State: Initialize state for managing the search term entered by the user.
// Render Method: Render the Navbar component for navigation and search.
// Render the main content area using a div with a class of h-full.
// Use the Routes component to define routes for different URLs and their corresponding components.
// Each Route specifies a path attribute for the URL pattern and an element attribute for the component to render when the URL matches the pattern.
// Export: Export the Pins component as the default export.