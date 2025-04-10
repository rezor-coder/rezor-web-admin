import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginPage/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/SIdebar/Sidebar";
import AllBlogs from "./Components/AllBlogs/AllBlogs";
import Category from "./Components/Category/Category";
import AddBlogs from "./Components/AllBlogs/AddBlogs";
import AddCategory from "./Components/Category/AddCategory";
import useLoginStore from "./store/useLoginStore";

function App() {
  const { isLoggedIn } = useLoginStore();
  console.log('v2');

  return (
    <Router>
      <ToastContainer className="!z-[999999]" />
      {isLoggedIn && <Sidebar />}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="/" element={<AllBlogs />} />
            <Route path="/addBlog" element={<AddBlogs Title="Create" />} />
            <Route path="/addBlog/:id" element={<AddBlogs Title="Edit" />} />
            <Route path="/Category" element={<Category />} />
            <Route path="/addCategory" element={<AddCategory />} />
            <Route path="/addCategory/:id" element={<AddCategory />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
