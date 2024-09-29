import { Navigate } from 'react-router-dom';


const isAuthenticated = () => {
  
  return localStorage.getItem('authToken') ? true : false;
};

const ProtectedRoute = ({ element }) => {
  
  if (!isAuthenticated()) {
    
    return <Navigate to="/" replace />;
  }

  
  return element;
};

export default ProtectedRoute;
