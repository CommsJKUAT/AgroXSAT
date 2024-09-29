import { Navigate } from 'react-router-dom';

// Function to check if the user is authenticated
const isAuthenticated = () => {
  // Check if the accessToken is present in localStorage
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken;  // Return true if accessToken exists, false otherwise
};

const ProtectedRoute = ({ element }) => {
  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;  // Redirect to login if not authenticated
  }

  // If authenticated, render the element (protected component)
  return element;
};

export default ProtectedRoute;
