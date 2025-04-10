import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiSend } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../config";
import Select from "react-select";
import useLoginStore from "../../store/useLoginStore";

function AddBlogs({Title}) {
  const { logout } = useLoginStore();

  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    Name: "",
    slug: "",
    Date: "",
    Photo: "",
    Thumbnail: "",
    MetaTitle: "Meta title",
    MetaDescription: "",
    MetaKey: "Meta key",
    Detail: "",
    Tag: [],
    Active: false,
  });
  const [quillContent, setQuillContent] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    if (type === "file") {
      setFormValues({ ...formValues, [name]: files[0] });
    } else {
      setFormValues({ ...formValues, [name]: inputValue });
    }
  };
  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        console.error("No file selected.");
        return;
      }


      const type = event.target.name;
      

      
      
      const formData = new FormData();
      formData.append("image", file);

      // Omitting headers as axios handles multipart/form-data automatically
      const response = await axios.post(
        `${API_BASE_URL}/V1/uploadImage`,
        formData,
        {
          withCredentials: true,
        }
      );

      const newImageUrl = response.data.url;
      if (newImageUrl) {
        toast.success(`${type} uploaded successfully`);
        setFormValues((prevValues) => ({
          ...prevValues,
          [type]: newImageUrl,
        }));
      } else {
        console.error(
          "Failed to upload image. No URL returned from the server."
        );
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      toast.error("Failed to upload image");
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const tagNames = selectedOptions.map((option) => option.label);
    setFormValues({ ...formValues, Tag: tagNames });
  };

  const selectOptions = categories.map((category) => ({
    value: category.id,
    label: category.Name,
  }));

  const handleQuillChange = (value) => {
    setQuillContent(value);
  };

  function generateSlug(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/^-+|-+$/g, '') 
      .replace(/-+/g, '-');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = generateSlug(formValues.slug)
    const updatedFormValues = { ...formValues, Detail: quillContent, slug };
    const API_URL = id
      ? `${API_BASE_URL}/V1/updateBlog/${id}`
      : `${API_BASE_URL}/V1/addBlog`;
    const method = id ? "PUT" : "POST";
    console.log('------form data', JSON.stringify(updatedFormValues))
    try {
      const response = await fetch(API_URL, {
        method: method,
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormValues),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${id ? "Blog updated" : "Blog created"}:`, data);
        navigate("/");
      } else {
        console.log(`Received status code: ${response.status}`);
        if (response.status === 401 || response.status === 400) {
          toast.error(
            "Session expired or invalid credentials. Please log in again."
          );
          // logout();
          // sessionStorage.clear();
          // navigate("/Login");
          
        } else {
          toast.error(
            `Failed to ${id ? "update" : "create"} blog: ${data.message}`
          );
        }
      }
    } catch (error) {
      console.error("hello" + JSON.stringify(error));
      toast.error(
        error.message
      );
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/V1/getCategories`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
          },
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

  useEffect(() => {
    const fetchBlogData = async () => {
      if (id) {
        try {
          const response = await fetch(`${API_BASE_URL}/V1/getBlogById/${id}`, {
            method: "GET",
            withCredentials: true,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.status === 200) {
            const data = await response.json();
            setFormValues(data.data);
            setQuillContent(data.data.Detail);
          } else {
            console.error("Failed to load blog data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching blog data:", error);
        }
      }
    };

    fetchBlogData();
  }, [id]);

  return (
    <div className="max-w-7xl ml-[22rem] pt-[3.7rem] mr-[5rem] ">
      <h1 className="text-2xl font-bold text-[#1b00ff]">{Title} Blog</h1>

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
          <div>
            <label
              htmlFor="tag"
              className="block text-sm font-medium text-gray-700"
            >
              Select Tag <span className="text-[red]">*</span>
            </label>
            <Select
              id="tag"
              isMulti
              name="Tag"
              value={selectOptions.filter((option) =>
                formValues.Tag.includes(option.label)
              )}
              onChange={handleSelectChange}
              options={selectOptions}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label
              htmlFor="postDate"
              className="block text-sm font-medium text-gray-700"
            >
              Post Date <span className="text-[red]">*</span>
            </label>
            <input
              id="postDate"
              required
              className="w-full p-2 mt-1 border rounded-md"
              type="date"
              name="Date"
              value={formValues.Date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="Thumbnail"
              className="block text-sm font-medium text-gray-700"
            >
              Thumbnail
            </label>
            <div className="flex items-center">
              <label className="relative block w-full p-2 text-center bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-100">
                {formValues.Thumbnail ? (
                  <img
                    src={formValues.Thumbnail}
                    alt="Uploaded"
                    className="object-cover h-20 mx-auto"
                  />
                ) : (
                  <span className="mt-2 text-base leading-normal">
                    Select a file
                  </span>
                )}
                <input
                  type="file"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  name="Thumbnail"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          <div>
            <label
              htmlFor="Photo"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <div className="flex items-center">
              <label className="relative block w-full p-2 text-center bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-100">
                {formValues.Photo ? (
                  <img
                    src={formValues.Photo}
                    alt="Uploaded"
                    className="object-cover h-20 mx-auto"
                  />
                ) : (
                  <span className="mt-2 text-base leading-normal">
                    Select a file
                  </span>
                )}
                <input
                  type="file"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  name="Photo"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug <span className="text-[red]">*</span>
              </label>
              <input
                id="slug"
                required
                className="w-full p-2 mt-1 border rounded-md"
                placeholder="Enter Slug"
                name="slug"
                value={formValues.slug}
                onChange={handleChange}
              />
            </div>
        </div>
        <div>
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Meta Description
          </label>
          <input
            className="w-full p-2 mt-1 border rounded-md"
            placeholder="Enter Meta Description"
            name="MetaDescription"
            value={formValues.MetaDescription}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="detail"
            className="block text-sm font-medium text-gray-700"
          >
            Detail
          </label>
          <ReactQuill
            id="Detail"
            name="Detail"
            value={quillContent}
            onChange={handleQuillChange}
            className="h-48 mt-1 mb-16"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
              ],
            }}
          />
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

export default AddBlogs;
