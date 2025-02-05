import React, { useEffect, useState } from "react";
import { getName } from "../utils/getName";
import axios from "axios";
import supabase from "../services/supabase";
import toast from "react-hot-toast";

const Profile = () => {
  const { decoded } = getName();
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState(
    decoded?.userName ? decoded?.userName.split(" ")[0] : ""
  );
  const [lastName, setLastName] = useState(
    decoded?.userName ? decoded?.userName.split(" ")[1] : ""
  );
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState(decoded?.email ? decoded?.email : "");
  const [headline, setHeadline] = useState("");
  const [biography, setBiography] = useState("");
  const [fileObj, setFileObj] = useState({});

  useEffect(() => {
    if (
      userData &&
      userData.headline &&
      userData.biography &&
      userData.userName &&
      userData.email &&
      userData.imageUrl
    ) {
      setHeadline(userData.headline);
      setBiography(userData.biography);
      setFirstName(userData.userName.split(" ")[0]);
      setLastName(userData.userName.split(" ")[1]);
      setEmail(userData.email);
      setImage(userData.imageUrl);
    }
  }, [userData]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileObj(file);
    if (file) {
      // Check file size (e.g., max 1MB)
      if (file.size > 1024 * 1024) {
        alert("File size exceeds 1MB. Please choose a smaller file.");
        return;
      }

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set the base64 encoded image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateUser = async () => {
    try {
      let imageUrl = null;

      // Check if an image file is selected
      if (fileObj) {
        const fileName = `${Date.now()}-${fileObj.name}`;

        // Upload the image to Supabase
        const { data, error } = await supabase.storage
          .from("profile-image")
          .upload(fileName, fileObj, {
            contentType: fileObj.type, // Ensure correct content type
          });

        if (error) {
          console.error("Error uploading image:", error);
          alert(`Failed to upload the image: ${fileObj.name}`);
          return; // Exit if the upload fails
        }

        // Retrieve the public URL of the uploaded image
        const { data: publicURLData, error: urlError } = supabase.storage
          .from("profile-image")
          .getPublicUrl(fileName);

        if (urlError) {
          console.error("Error getting public URL:", urlError);
          alert(`Failed to get public URL for: ${fileObj.name}`);
          return; // Exit if URL retrieval fails
        }

        imageUrl = publicURLData.publicUrl; // Store the public URL
        setImage(imageUrl); // Update the state with the new image URL
      }

      // Now, update user data in MongoDB

      const response = await axios.patch(
        `http://localhost:8080/api/users/${decoded.id}`, // Ensure the correct API endpoint
        {
          userName: `${firstName} ${lastName}`,
          headline,
          biography,
          imageUrl, // Include the image URL in the data
        }
      );
      if (response.status === 200) {
        toast.success("Your account has been successfully updated!");
      } else {
        alert("Failed to update user");
      }
    } catch (err) {
      toast.error(
        "An error occurred while updating your account. Please try again!"
      );
    }
  };

  useEffect(() => {
    async function getUserById() {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/users/${decoded.id}`
        );
        setUserData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserById();
  }, [decoded.id]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={image ? image : "../../public/default.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          </div>
          <label className="mt-2 text-sm font-medium text-gray-600">
            JPG, GIF, or PNG. Max 1 MB
          </label>
          <input
            type="file"
            accept="image/*"
            className="mt-2 text-sm"
            onChange={handleImage}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full border-b-2 border-black outline-none"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full border-b-2 border-black outline-none"
              placeholder="Last Name"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="headline"
              value={email}
              className="mt-1 block w-full border-b-2 border-black outline-none"
              placeholder="Email"
              disabled
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="mt-1 block w-full border-b-2 border-black outline-none"
              placeholder="Headline"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Biography
            </label>
            <textarea
              name="biography"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              rows="4"
              className="mt-1 block w-full border-b-2 border-black outline-none"
              placeholder="Write something about yourself..."
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-[#BD74F4] text-white px-4 py-2 rounded-md hover:bg-[#BD74F9]"
            onClick={handleUpdateUser}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
