import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client'; // Import Sanity client
import { feedQuery, searchQuery } from '../utils/data'; // Import query functions
import MasonryLayout from './MasonryLayout'; // Import MasonryLayout component
import Spinner from './Spinner'; // Import Spinner component

const Feed = () => {
  // State variables to store pins and loading state
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);

  const { categoryId } = useParams();  // Get the categoryId from URL params
  // console.log(categoryId)

  // -> Fetch pins based on categoryId or default feed
  useEffect(() => {
    setLoading(true); // Set loading state to true

    // -> Define the query based on whether categoryId exists
    const query = categoryId ? searchQuery(categoryId) : feedQuery;

    // Fetch pins using Sanity client
    client.fetch(query)
      .then((data) => {
        setPins(data);  // Set pins state with fetched data
        setLoading(false); // Set loading state to false
      })
      .catch((error) => {
        console.error('Error fetching pins:', error);
        setLoading(false);  // Set loading state to false in case of error
      });
  }, [categoryId]); // Re-run effect when categoryId changes


  // -> Render loading spinner while fetching pins
  if (loading) {
    return <Spinner message={`We are adding ${categoryId || 'new'} ideas to your feed!`} />;
  }

  // Render MasonryLayout component if pins exist
  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  );
};

export default Feed;
