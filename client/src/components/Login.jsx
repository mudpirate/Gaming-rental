import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const { setShowLogin, axios, setToken } = useAppContext();
  const navigate = useNavigate();
  const [mode, setMode] = useState("register"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only for register

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const payload =
      mode === "register" ? { name, email, password } : { email, password };

    try {
      const { data } = await axios.post(`/api/user/${mode}`, payload);

      if (data.success) {
        // Store token
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`; // ✅ immediate header set

        // UI feedback and redirect
        toast.success("Logged In Successfully");
        setShowLogin(false);
        navigate("/");
      } else {
        if (
          data.message === "User not found" ||
          data.message === "Email not registered"
        ) {
          toast.error("This email is not registered. Please sign up first.");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={() => setShowLogin(false)}
    >
      <form
        className="max-w-md w-full text-center border border-gray-700 rounded-2xl px-8 bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
      >
        <h1 className="text-black text-3xl mt-10 font-bold">
          {mode === "login" ? "Login" : "Register"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {mode === "login"
            ? "Please sign in to rent your favorite games"
            : "Create an account to start renting games"}
        </p>

        {mode === "register" && (
          <div className="flex items-center w-full mt-8 bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="text"
              placeholder="Full Name"
              className="bg-transparent text-black placeholder-gray-500 outline-none text-sm w-full h-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div
          className={`flex items-center w-full ${
            mode === "register" ? "mt-4" : "mt-10"
          } bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2`}
        >
          <svg
            width="16"
            height="11"
            viewBox="0 0 16 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
              fill="#6B7280"
            />
          </svg>
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent text-black placeholder-gray-500 outline-none text-sm w-full h-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <svg
            width="13"
            height="17"
            viewBox="0 0 13 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
              fill="#6B7280"
            />
          </svg>
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-black placeholder-gray-500 outline-none text-sm w-full h-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {mode === "login" && (
          <div className="mt-5 text-left">
            <a className="text-sm text-black hover:underline" href="#">
              Forgot password?
            </a>
          </div>
        )}

        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-black hover:bg-gray-800 transition"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-11">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-black font-semibold hover:underline"
                onClick={() => setMode("register")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-black font-semibold hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
