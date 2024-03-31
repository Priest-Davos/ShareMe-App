import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Import NavLink and Link for navigation
import { RiHomeFill } from 'react-icons/ri'; // Import RiHomeFill icon from react-icons/ri
import { IoIosArrowForward } from 'react-icons/io'; // Import IoIosArrowForward icon from react-icons/io
import logo from '../assets/logo.png'; // Import logo image
import { categories } from '../utils/data'; // Import categories data from utils/data

// Define styles for active and inactive NavLink components
const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({ closeToggle, user }) => {
  // Function to close the sidebar. This is particularly useful in mobile or smaller screens.
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };


  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        {/* Logo and link to home */}
        <Link to="/" className="flex px-5 gap-2 my-6 pt-1 w-190 items-center" onClick={handleCloseSidebar}>
          <img src={logo} alt="logo" className="w-full" />
        </Link>

        {/* Navigation links */}
        <div className="flex flex-col gap-5">
          <NavLink to="/" className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)} onClick={handleCloseSidebar}>
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover cateogries</h3>

          {/* Dynamically generate category links */}
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img src={category.image} className="w-8 h-8 rounded-full shadow-sm" />
              {category.name}
            </NavLink>
          ))}
        </div>

      </div>

      {/* User profile link, shown if user is logged in */}
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <img src={user.image} className="w-10 h-10 rounded-full" alt="user-profile" />
          <p>{user.userName}</p>
          <IoIosArrowForward />
        </Link>
      )}

    </div>
  );
};

export default Sidebar;