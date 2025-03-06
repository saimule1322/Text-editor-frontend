import React, { useState } from 'react'
import customfetch from '../Utils/Customfetch.ts'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../store/authStore"; // Import Zustand store

const LoginPage :React.FC= () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading , setisLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Use navigate for redirection
  const setUser = useAuthStore((state) => state.setUser); // Access Zustand setter


  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

 

  const Handlelogin =async  (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setisLoading(true)
    if (!email ) {
      setError('Please fill in both fields.');
      return;
    }
    const response = await customfetch.post('/login', { email });

    console.log("response",response)
    setUser(response.data); // Store user data globally in Zustand
    setisLoading(false)

    navigate('/Editor')
    return response.data;

  };
    

  return (
    
    <div className="flex justify-center items-center h-screen bg-gray-50">
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Welcome </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <form className="mt-4 space-y-4" onSubmit={Handlelogin}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
           Don't have an account?
            </p>
        </div>

        <div className="text-center">
          <button
             onClick={loginWithGoogle}
            className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {/* <img src={''} alt='google'></img> */}
            Sign up with Google
          </button>
          
        </div>
      </div>
    </div>
   

    </div>
  )
}

export default LoginPage
