import Nav from "../nav";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Submitted');
        try {
            console.log('Sending Request');
            const response = await fetch('https://agroxsat.onrender.com/backend/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });
            console.log('Response Status:', response.status);
            const contentType = response.headers.get('Content-Type');
            const responseBody = await response.text();
            if (response.ok) {
                const { access, refresh } = JSON.parse(responseBody);
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                navigate('/dashboard'); // Redirect to homepage
            } else {
                let errorMessage = 'Error logging in';
                if (contentType && contentType.includes('application/json')) {
                    const result = JSON.parse(responseBody);
                    errorMessage = result.error || errorMessage;
                }
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            setError('Error logging in');
        }
    };
  return (
    <section className="relative bg-olive 2xl:h-screen bg-hero-pattern bg-no-repeat bg-cover">
      <Nav />
      <div className=" px-8 md:px-0 pb-8 flex flex-col justify-center items-center h-full">
        <div className="w-full md:w-1/3 2xl:w-1/4">
          <h1 className="text-5xl mb-14 font-semibold text-left text-white">
            Sign In
          </h1>
        </div>
        <form className="w-full md:w-1/3 2xl:w-1/4 " onSubmit={handleSubmit}>
          <label
            htmlFor="username-icon"
            className="block mb-2 text-sm font-medium text-white"
          >
            Your Username
          </label>
          <div className="relative">
            <input
              type="text"
              id="username-icon"
              
              className="text-white bg-black-olive text-sm rounded-lg focus:ring-black-olive focus:border-black-olive block w-full ps-2.5 p-3.5 placeholder-ash-gray"
              placeholder="John Doe"
            />
            <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="my-5">
            <label
              for="password"
              className="block mb-2 text-sm font-medium text-white"
            >
              Your password
            </label>
            <div class="relative">
              <input
                type="password"
                id="password"
                className="text-white bg-black-olive text-sm rounded-lg focus:ring-black-olive focus:border-black-olive block w-full ps-2.5 p-3.5 placeholder-ash-gray"
                placeholder="•••••••••"
                required
              />
              <div class="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
                <svg
                  class="w-5 h-5 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
         
          <button
            type="submit"
            className="mb-4 text-white bg-giants-orange hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign In
          </button>
          
        </form>
      </div>
    </section>
  );
}
export default Login;