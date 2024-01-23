import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
// import { Toast } from "react-toastify/dist/components";

function Profile() {
  const fileRef = useRef(null);

  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.user);

  // console.log(currentUser.email);
  // console.log(currentUser.username);
  // console.log(currentUser);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // Console.logs
  // console.log(file);
  // console.log(filePerc);
  // console.log(fileUploadError);
  // console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL }),
        );
      },
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success("Profile updated successfully");
      //To be removed at the end of the day
      console.log(loading);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("Res: ", res);
      console.log("Data: ", data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        toast.error(data.message);
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
      toast.error("Error showing listings!");
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId),
      );
      toast.success("Deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar || currentUser.rest.avatar}
          alt="profile-image"
          className="rounded-full h-24 w-24 self-center mt-2 object-cover cursor-pointer"
        />
        <p className="text-sm self-center ">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <p hidden className="text-center ">
              Updated Successfully
            </p>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          defaultValue={currentUser.username || currentUser.rest.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Username"
          id="username"
        />
        <input
          type="email"
          defaultValue={currentUser.email || currentUser.rest.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Email"
          id="email"
        />
        <input
          type="password"
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Password"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 rounded-lg hover:opacity-95  disabled:opacity-80 uppercase text-white p-3">
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white uppercase rounded-lg text-center p-3 hover:opacity-95">
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full hover:bg-green-700 hover:text-white transition-all delay-300 rounded-lg p-3">
        Show listings
      </button>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col">
          <h1 className="text-center text-2xl font-semibold mt-7">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4 my-1 hover:bg-sky-100 delay-75">
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase border p-1 rounded hover:bg-slate-200 hover:shadow-md delay-100">
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>

                <button className="text-green-700 uppercase border p-1 rounded hover:bg-slate-200 hover:shadow-md delay-100">
                  Edit
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
