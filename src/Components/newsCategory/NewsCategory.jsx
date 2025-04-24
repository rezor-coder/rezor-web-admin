import React, { useEffect, useRef, useState } from "react";
import { HiDotsVertical, HiPencilAlt, HiPlus, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const ActionPopup = ({ id, onEdit, onDelete, onClose }) => {
  const popupRef = useRef(null);

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
      className="absolute z-50 w-40 py-1 mt-2 rounded-md shadow-xl right-48 bg-slate-50 "
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

function NewsCategory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopupId, setShowPopupId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);

  const handleAddNew = () => {
    navigate("/addNewsCategory");
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
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/V1/getNewsCategories`, {
          withCredentials: true,
        });
        
        if (response.status === 200) {
          setCategories(response.data.data);
        } else {
          console.error("Failed to fetch categories:", response.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const deleteCategory = async (id) => {
    if(confirm('Are you sure want to delete')){
    try {
      const response = await fetch(`${API_BASE_URL}/V1/deleteNewsCategory/${id}`, {
        method: "DELETE",
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        toast.success("Category deleted successfully");
        setCategories(categories.filter((category) => category.id !== id));
      } else {
        toast.error("Failed to delete category");
        console.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("Error deleting category:", error);
    }
  }
  };


  const editCategory = (categoryId) => {
    navigate(`/addNewsCategory/${categoryId}`);
  };

  const filteredCategory = categories.filter((category) =>
    category?.Name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategory.length / ITEMS_PER_PAGE);
  const indexOfLastCategory = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCategory = indexOfLastCategory - ITEMS_PER_PAGE;
  const currentCategories = filteredCategory.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  return (
    <div className="max-w-7xl ml-[22rem] pt-[3.7rem] mr-[5rem] ">
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold text-[#1b00ff]">All News Category</h1>
        <div className="">
          <button
            type="button"
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
          <select className="ml-2 border ">
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
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.length > 0 ? (
              currentCategories.map((category, index) => (
                <tr
                  key={category.id}
                  className="text-center transition duration-200 hover:bg-gray-100"
                >
                  <td className="px-4 py-2 border ">
                    {" "}
                    {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}.
                  </td>
                  <td className="px-4 py-2 border">{category.Name}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`text-white text-sm font-semibold py-1 px-2 rounded-md ${category.Active ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                      {category.Active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="relative translate-x-1/2 border">
                    <HiDotsVertical
                      className="cursor-pointer"
                      onClick={() => togglePopup(category.id)}
                    />
                    {showPopupId === category.id && (
                      <ActionPopup
                        id={category.id}
                        onEdit={editCategory}
                        onDelete={deleteCategory}
                        onClose={onClose}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center">
                  No categories found.
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

export default NewsCategory;
