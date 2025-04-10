import { useState } from "react";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useLoginStore from "../../store/useLoginStore";
import rezor_white from "../../Assets/Logo/rsz_2rezor_white.png";

import { useNavigate, useParams } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses =
    "w-full p-3 pl-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";

  async function Loginfunction() {
    try {
      const config = {
        method: "POST",
        mode: "cors",
        url: `${API_BASE_URL}/V1/LoginUser`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: email,
          password: password,
        },
        withCredentials: true,
      };
      const response = await axios(config);
      

      if (response.status === 200) {
        sessionStorage.setItem("token", response.data.accessToken);
        useLoginStore.getState().login();
        toast.success("User logged in successfully");
        navigate("/")
      } else {
        toast.error("Something went wrong");
      }
    } catch (e) {
      console.log("Error:", e.message);
      toast.error("Something went wrong");
    }
  }
  return (
    <>
      <ToastContainer position="top-center" />
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: "linear-gradient(to right, #10004e, #32011c)" }}
      >
        <div>
          <div className="flex justify-center mb-8">
            <img src={rezor_white} alt="logo" />
          </div>
          <div className="px-5 py-8 w-[20rem] bg-white rounded-xl shadow-md">
            <h2 className="mb-6 text-2xl font-bold text-center text-[#1b00ff]">
              Login To Admin Panel
            </h2>
            <div onSubmit={Loginfunction}>
              <div className="relative mb-4">
                <input
                  required
                  type="text"
                  className={inputClasses}
                  placeholder="Username"
                  // value={username}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <HiOutlineUser
                  size={20}
                  className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2"
                />
              </div>
              <div className="relative mb-6">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className={inputClasses}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute text-gray-500 transform -translate-y-1/2 cursor-pointer right-10 top-1/2"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={18} />
                  ) : (
                    <AiOutlineEye size={18} />
                  )}
                </div>
                <HiOutlineLockClosed
                  size={20}
                  className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2"
                />
              </div>
              <button
                onClick={Loginfunction}
                type="submit"
                className="w-full px-4 py-2 text-white bg-[#1b00ff] rounded-md hover:bg-[#1502bd] focus:outline-none"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
