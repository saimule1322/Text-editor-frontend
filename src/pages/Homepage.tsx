import React from "react";
import { Link, Outlet } from "react-router-dom";
import {image1 } from '../assets'

const Homepage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-full max-w-screen-xl p-8 bg-white shadow-lg rounded-lg">
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to the Text Editor!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your customizable text editor where you can write, edit, and style
            your content easily.
          </p>
          <Link
            to="/Login"
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Right Image Area */}
        <div className="flex-1 flex justify-center items-center">
          <img
          src={image1}
            alt="Text Editor"
            className="w-[350px] h-auto object-contain rounded-lg shadow-md"
          />
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default Homepage;
