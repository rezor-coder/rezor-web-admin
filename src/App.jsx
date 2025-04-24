import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginPage/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/SIdebar/Sidebar";
import AllBlogs from "./Components/AllBlogs/AllBlogs";
import AllNews from "./Components/AllNews/AllNews";
import Category from "./Components/Category/Category";
import NewsCategory from "./Components/newsCategory/NewsCategory";
import AddBlogs from "./Components/AllBlogs/AddBlogs";
import AddNews from "./Components/AllNews/AddNews";
import AddCategory from "./Components/Category/AddCategory";
import AddNewsCategory from "./Components/newsCategory/AddNewsCategory";
import useLoginStore from "./store/useLoginStore";

function App() {
  const { isLoggedIn } = useLoginStore();
  console.log('v3');

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
            <Route path="/allNews" element={<AllNews />} />
            <Route path="/addNews" element={<AddNews Title="Create" />} />
            <Route path="/addNews/:id" element={<AddNews Title="Edit" />} />
            <Route path="/newsCategory" element={<NewsCategory />} />
            <Route path="/addNewsCategory" element={<AddNewsCategory />} />
            <Route path="/addNewsCategory/:id" element={<AddNewsCategory />} />
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
