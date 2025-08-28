import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MainLayout from './Pages/MainLayout/MainLayout'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'

import CounterContextProvider from './Context/CounterContext'
import Posts from './Pages/Posts/Posts'
import ProtectedRoutes from './Components/PortectedRoutes/ProtectedRoutes'
import { AuthContextProvider } from './Context/AuthContext'
import PostDetails from './Pages/PostDetails/PostDetails'
import { Toaster } from 'react-hot-toast'
import { Navigate } from 'react-router-dom'
import {
 
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Profile from './Pages/Profile/Profile'
function App() {
  const routs = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element:   <Posts />},
          {path:'/register', element: <Register /> },
        { path: '/login', element: <Login /> },
        
        { path: '/profile', element: <Profile /> },
        {
          path: '/Posts',
          element: (
            <ProtectedRoutes>
              <Posts />
            </ProtectedRoutes>
          ),
        },
        {
          path: 'Postdetails/:postid',
          element: (
            <ProtectedRoutes>
              <PostDetails />
            </ProtectedRoutes>
          ),
        },
      ],
    },
  ])
const queryClient = new QueryClient()

  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
      <CounterContextProvider>
        <RouterProvider router={routs} />
       
        <Toaster position="top-center" reverseOrder={false} />
      </CounterContextProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  )
}

export default App
