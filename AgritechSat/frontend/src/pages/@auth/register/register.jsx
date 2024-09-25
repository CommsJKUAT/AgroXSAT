import { useState } from "react";
import { useNavigate } from "react-router-dom";  // to handle redirects
import Nav from "../nav";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://agroxsat.onrender.com/backend/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Redirect to login page upon successful registration
        navigate("/login");
      } else {
        setError(data.detail || "Something went wrong.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <section className="relative bg-olive 2xl:h-screen bg-hero-pattern bg-no-repeat bg-cover">
      <Nav />
      <div className="pb-8 flex flex-col justify-center items-center h-full">
        <div className="w-1/3 2xl:w-1/4">
          <h1 className="text-4xl 2xl:text-5xl mb-2 2xl:mb-14 font-semibold text-left text-white">
            Sign Up
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="w-1/3 2xl:w-1/4">
          {error && <p className="text-red-500">{error}</p>}
          <div className="my-5">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                className="text-white bg-black-olive text-sm rounded-lg focus:ring-black-olive focus:border-black-olive block w-full ps-2.5 p-3.5 placeholder-white"
                placeholder="John Doe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="my-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="text-white bg-black-olive text-sm rounded-lg focus:ring-black-olive focus:border-black-olive block w-full ps-2.5 p-3.5 placeholder-white"
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="my-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
              Your password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="text-white bg-black-olive text-sm rounded-lg focus:ring-black-olive focus:border-black-olive block w-full ps-2.5 p-3.5 placeholder-white"
                placeholder="•••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="my-5">
            <label htmlFor="password2" className="block mb-2 text-sm font-medium text-white">
              Repeat password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password2"
                className="text-white bg-black-olive text-sm rounded-lg focus:ring-black-olive focus:border-black-olive block w-full ps-2.5 p-3.5 placeholder-white"
                placeholder="•••••••••"
                value={formData.password2}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-gray-900 bg-white border-2 hover:bg-olive-1 hover:text-white border-white focus:ring-4 focus:outline-none focus:ring-olive font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;
