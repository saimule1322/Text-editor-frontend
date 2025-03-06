import React from 'react';
// import { BrowserRouter as Router, Route, } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './LoginPage';
import NotFoundPage from './NotFoundPage';   
import Homepage from './Homepage';
import TexteditorPage from './TexteditorPage';

const routing = createBrowserRouter([
    {
      path:'/',
      errorElement:<NotFoundPage />,
      children:[
        {
          index:true,
          element:<Homepage />,
       },
        {
           path:'Home',
           element:<Homepage />,
        },
        {
           path: 'Login',
           element:<LoginPage />,
        },
        {
            path: 'Editor',
            element:<TexteditorPage />,
         }
    ]
    }
])

const RouterPage: React.FC = () => {
  return (
    <RouterProvider router={routing} >
    </RouterProvider>
  );
};

export default RouterPage;
