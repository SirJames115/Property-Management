import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../component/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({});

  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error("Please check your internet connection ");
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
      toast.success(data.message);
      // console.log(data);
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      {/* <p className="hidden">{toast.error(error)}</p> */}
      <h1 className="text-center text-3xl font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          type="text"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="gap-2">
        <p>
          {`Don't have an account?`}{" "}
          <Link className="text-blue-700 text-center" to="/sign-up">
            sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
