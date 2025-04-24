import React, { useState, useEffect, useRef } from "react";
import { HiDotsVertical, HiPencilAlt, HiPlus, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../config";
import axios from "axios";
// import useLoginStore from "../../store/useLoginStore";

const ActionPopup = ({ id, onEdit, onDelete, onClose }) => {
  const popupRef = useRef(null);
  // const logout = useLoginStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute w-40 py-1 mt-2 rounded-md shadow-xl right-40 bg-slate-50 popup "
    >
      <button
        onClick={() => onEdit(id)}
        className="w-full px-4 py-2 text-left text-gray-700 text-md hover:bg-slate-100"
      >
        <HiPencilAlt size={20} className="inline mr-3 text-[green]" />
        Edit
      </button>
      <button
        onClick={() => onDelete(id)}
        className="w-full px-4 py-2 text-left text-gray-700 text-md hover:bg-slate-100"
      >
        <HiTrash size={20} className="inline mr-3 text-[red] " />
        Delete
      </button>
    </div>
  );
};

const ITEMS_PER_PAGE = 10;

function AllNews() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopupId, setShowPopupId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 


  const [news, setNews] = useState([]);

  console.log("news", news);

  const handleAddNew = () => {
    navigate("/addNews");
  };

  const togglePopup = (id) => {
    setShowPopupId(showPopupId === id ? null : id);
  };

  const onClose = () => {
    setShowPopupId(null);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    setCurrentPage((prevCurrent) =>
      prevCurrent < totalPages ? prevCurrent + 1 : prevCurrent
    );
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevCurrent) =>
      prevCurrent > 1 ? prevCurrent - 1 : prevCurrent
    );
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/V1/getNews`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
          },
          withCredentials: true,
        });

        console.log("responseee", response);
        // if (response.status === 400 || response.status === 401) {
        //   sessionStorage.clear();
        //   location.href = "/";
        // }
        if (response.status === 200) {
          setNews(response.data.data || []);
        } else {
          console.error("Failed to fetch News:", response.status);
        }
      } catch (error) {
        console.log("errrr", error);
        // if (error.response && error.response.status >= 400) {
        //   sessionStorage.clear();
        //   location.href = "/";
        // }
      }
    };

    fetchNews();
  }, []);

  const deleteNews = async (id) => {
    if(confirm('Are you sure want to delete')){
    try {
      const response = await fetch(`${API_BASE_URL}/V1/DeleteNews/${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("response");
      console.log(response);
      
      if (!response.ok) throw new Error("Failed to delete the news.");

      setNews(news.filter((nes) =>  nes.id !== id));

      toast.success("News deleted successfully");
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error(`Error deleting news: ${error.message}`, {
        style: { backgroundColor: "red", color: "white" },
      });
    }
  }
  };

  const editNews = (newsId) => {
    navigate(`/addNews/${newsId}`);
  };

  const filteredNews = news.filter((nes) =>
    nes?.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const indexOfLastNews = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstNews = indexOfLastNews - ITEMS_PER_PAGE;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

  return (
    <div className="max-w-7xl ml-[22rem] pt-[3.7rem] mr-[5rem] ">
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold text-[#1b00ff]">All News</h1>
        <div className="">
          <button
            onClick={handleAddNew}
            className="flex items-center bg-[#F46F30] text-white px-3 py-2 rounded-md hover:bg-[#ff8952] transition duration-300"
          >
            <HiPlus size={20} className="mr-2" /> Add New
          </button>
        </div>
      </div>
      <div className="flex items-center justify-end mb-5">
        {/* <div>
          <label>Show</label>
          <select className="ml-2 border">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <label className="ml-2">entries</label>
        </div> */}

        <div>
          <input
            type="text"
            className="p-2 border rounded-md"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-hidden">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentNews.length > 0 ? (
              currentNews.map((news, index) => (
                <tr
                  key={news.id}
                  className="text-center transition duration-200 hover:bg-gray-100"
                >
                  <td className="border ">
                    {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}.
                  </td>
                  <td className="flex justify-center px-0 py-2 border">
                    <img
                      src={news.Photo}
                      alt={news.Name}
                      className="object-contain w-20 h-20 rounded"
                    />
                  </td>
                  <td className="border ">{news.Name}</td>
                  <td className="border">
                    <span
                      className={`text-white text-sm font-semibold py-1 px-2 rounded-md ${news.Active ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                      {news.Active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border ">
                    {new Date(news.createdAt).toLocaleDateString()}
                  </td>
                  <td className="relative translate-x-1/2 border">
                    <HiDotsVertical
                      className="cursor-pointer"
                      onClick={() => togglePopup(news.id)}
                    />
                    {showPopupId === news.id && (
                      <ActionPopup
                        id={news.id}
                        onEdit={editNews}
                        onDelete={deleteNews}
                        onClose={onClose}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center">
                  No news found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center my-20">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 transition-colors duration-300 transform rounded-md ${currentPage === 1
              ? "text-gray-500 dark:bg-gray-800  cursor-not-allowed"
              : "dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-500 hover:text-white"
              }`}
          >
            Previous
          </button>

          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              className={`px-4 py-2 mx-1 transition-colors duration-300 transform rounded-md ${currentPage === number + 1
                ? "bg-blue-500 text-white"
                : "dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-500 hover:text-white"
                }`}
              onClick={() => handlePageClick(number + 1)}
            >
              {number + 1}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-1 transition-colors duration-300 transform rounded-md ${currentPage === totalPages
              ? "text-gray-500 dark:bg-gray-800  cursor-not-allowed"
              : "dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-500 hover:text-white"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllNews;
