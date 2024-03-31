import React from "react";

import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";

// import GoogleLogin from 'react-google-login';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
// import { googleLogout } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import { client } from "../client";


const Login = () => {

  // console.log(import.meta.env.VITE_GOOGLE_API_TOKEN)
  const navigate = useNavigate();


  const responseGoogle = (response) => {
    // console.log(response)

    ///fetch user data from google apli using user token  which we got in response
    fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: { 'Authorization': `Bearer ${response.access_token}` }
    })
      .then(response => response.json())
      .then(data => {
        // // localStorage:This is a web storage object that allows you to store key-value pairs in the browser with no expiration time. The data stored in localStorage persists even after the browser is closed and reopened.
         localStorage.setItem('user', JSON.stringify(data));
        //  console.log(data);
        const { name, id, email, picture } = data;
        const doc = {
          _id: id,
          _type: 'user',
          userName: name,
          email: email,
          image: picture,
        };
        client.createIfNotExists(doc)
          .then(() => { navigate('/', { replace: true }); })
          .catch(error => { console.error('Error creating user document->', error); });

        // console.log(doc)
      })
      .catch(error => console.error(error));
  };

  const Googlelogin = useGoogleLogin({

    onSuccess: (response) => responseGoogle(response),
    onError: (response) => responseGoogle(response),

  });

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" />
          </div>

          <div className="shadow-2xl">


            <button
              type="button"
              className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
              onClick={() => Googlelogin()}
            >
              <FcGoogle className="mr-4" /> Sign in with google
            </button>



          </div>
        </div>
      </div>
    </div>
  );


};
export default Login;


