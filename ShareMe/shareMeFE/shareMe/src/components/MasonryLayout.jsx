import React from 'react';
import Masonry from 'react-masonry-css'; // Import Masonry component
import Pin from './Pin'; // Import Pin component

// Define breakpoint columns for responsive layout
const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

// MasonryLayout component
const MasonryLayout = ({ pins }) => (
  // Render Masonry layout with breakpoint columns and pins
  <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
    {/* Map through pins array and render Pin component for each pin */}
    {pins?.map((pin) => <Pin key={pin._id} pin={pin} className="w-max" />)}
  </Masonry>
);

export default MasonryLayout;
