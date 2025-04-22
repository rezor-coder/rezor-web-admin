import axios from "axios";
import { Link } from "react-router-dom";
import useLoginStore from "../../store/useLoginStore";
import { API_BASE_URL } from "../../config";
import rezor_white from "../../Assets/Logo/rsz_2rezor_white.png";

function Sidebar() {
  const { logout } = useLoginStore();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/V1/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        logout();
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="bg-[#000b5a] text-white fixed left-0 w-[17rem] min-h-screen px-[2rem] flex flex-col justify-between">
      {/* Logo Section */}
      <div className="pt-[2rem] flex flex-col items-center">
        <Link to="/">
          <img className="w-3/4 mb-[2rem]" src={rezor_white} alt="logo" />
        </Link>
        <ul className="text-lg font-semibold space-y-6 w-full tracking-wide">
          <li className="w-full">
            <Link to="/" className="block w-full">
              <h1>All Blogs</h1>
            </Link>
          </li>
          <li className="w-full">
            <Link to="/allNews" className="block w-full">
              <h1>All News</h1>
            </Link>
          </li>
          <li className="w-full">
            <Link to="/Category" className="block w-full">
              <h1>Blog Category</h1>
            </Link>
          </li>
          <li className="w-full">
            <Link to="/newsCategory" className="block w-full">
              <h1>News Category</h1>
            </Link>
          </li>
        </ul>
      </div>

      {/* Logout Button */}
      <div className="mb-8 flex justify-center">
        <button
          type="button"
          onClick={handleLogout}
          className="bg-[#1c1c84] text-white py-2 px-6 rounded-lg text-lg font-semibold hover:bg-[#2929a0] transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
