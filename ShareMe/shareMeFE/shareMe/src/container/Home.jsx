import React, { useState, useRef, useEffect } from 'react'; // Import necessary modules from React
import logo from '../assets/logo.png'; // Import logo image
import { HiMenu } from 'react-icons/hi'; // Import HiMenu icon from react-icons/hi
import { AiFillCloseCircle } from 'react-icons/ai'; // Import AiFillCloseCircle icon from react-icons/ai
import { Link, Route, Routes } from 'react-router-dom'; // Import Link, Route, and Routes for navigation
import Sidebar from '../components/Sideber'; // Import Sidebar component
import UserProfile from '../components/UserProfile'; // Import UserProfile component
import { client } from '../client'; // Import Sanity client
import Pins from './Pins'; // Import Pins component
import { userQuery } from '../utils/data'; // Import userQuery function from utils/data


const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false); // State to toggle sidebar
  const [user, setUser] = useState(); // State to store user data
  const scrollRef = useRef(null); // Ref for scrolling to top on route change


  // Get the logged in user data from localStorage which you stored  in Login component  working
  const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  // Fetch user data from Sanity on component mount
  useEffect(() => {
    const query = userQuery(userInfo?.id); // Create query to fetch user data by ID

    client.fetch(query).then((data) => {
      // console.log('Data: ', data);
      setUser(data[0]); // stting user state from data we get from sanity

    });
  }, []);


  // Scroll to top on component mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, []); // This empty array means the effect runs only once on mount
  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">

      {/* Sidebar section */}
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>

      {/* Sidebar for mobile view */}
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          {/* Menu icon for toggling sidebar */}
          <HiMenu fontSize={47} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          {/* Link to user profile */}
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="user-pic" className="w-9 h-9 rounded-full " />
          </Link>
        </div>

        {/* Sidebar content for mobile view */}
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              {/* Close icon to close sidebar */}
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar closeToggle={setToggleSidebar} user={user && user} /> {/* Pass closeToggle and user data to Sidebar component */}
          </div>
        )}


      </div>
      {/* Main content section */}
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          {/* Route for user profile */}
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          {/* Default route for Pins */}
          <Route path="/*" element={<Pins user={user && user} />} /> {/* Pass user data to Pins component */}
        </Routes>
      </div>
    </div>
  );
};

export default Home;