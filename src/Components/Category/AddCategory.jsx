import React, { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { API_BASE_URL } from "../../config";
import 'react-toastify/dist/ReactToastify.css';

import useLoginStore from "../../store/useLoginStore"; 

function AddCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    Name: "",
    Active: false,
  }); 
  
  const { logout } = useLoginStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setFormValues({ ...formValues, [name]: inputValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = id
      ? `${API_BASE_URL}/V1/updateCategory/${id}`
      : `${API_BASE_URL}/V1/addCategory`;
    const method = id ? "PUT" : "POST";

    try {
      // const token = sessionStorage.getItem("token");
      const response = await fetch(API_URL, {
        method: method,
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(formValues),
        
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${id ? "Category updated" : "Category created"} successfully.`); navigate("/Category");
      } else {
        if (response.status === 401 || response.status === 400) {
          toast.error("Session expired or invalid credentials. Please log in again.");
          // logout();
          // sessionStorage.clear();
          // navigate("/Login");
        } else {
          toast.error(
            `Failed to ${id ? "update" : "create"} blog: ${data.message}`)
        }
      }
    } catch (error) {
      console.error(`Error ${id ? "updating" : "creating"} category:`, error);
    }
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (id) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/V1/getCategoryById/${id}`,
            {
              withCredentials: true,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setFormValues(data.data);
          } else {
            console.error("Failed to load category data");
          }
        } catch (error) {
          console.error("Error fetching category data:", error);
        }
      }
    };

    fetchCategoryData();
  }, [id]);

  return (
    <div className="max-w-7xl ml-[22rem] pt-[3.7rem] mr-[5rem] ">
      <h1 className="text-2xl font-bold text-[#1b00ff]">Create New Category</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name <span className="text-[red]">*</span>
            </label>
            <input
              id="name"
              required
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Name"
              name="Name"
              value={formValues.Name}
              onChange={handleChange}
            />
          </div>
        </div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="Active"
            checked={formValues.Active}
            onChange={(e) =>
              setFormValues({ ...formValues, Active: e.target.checked })
            }
          />
          <span>Active</span>
        </label>
        <button
          type="submit"
          className="bg-[#00aff0] hover:bg-[#44cdff] flex items-center text-white text-md px-6 py-2 rounded-md"
        >
          <FiSend size={20} className="mr-2" />
          Save
        </button>
      </form>
    </div>
  );
}

export default AddCategory;
