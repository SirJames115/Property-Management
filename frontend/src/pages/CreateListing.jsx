import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUpoading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log(formData);
  const handleImageUpload = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUpoading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUpoading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mdb max per image)");
          setUpoading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUpoading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Image is ${progress}% uploaded`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  console.log(formData);

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // toast.loading("Creating listing");
      setLoading(true);
      setError(false);

      if (formData.imageUrls.length < 1) {
        return toast.error("You must upload at least one image");
      }

      if (+formData.discountPrice > +formData.regularPrice) {
        return toast.error(
          "Discounted prices cannot be more than regular price",
        );
      }

      if (+formData.discountPrice === +formData.regularPrice) {
        return toast.error(
          "Discounted prices cannot be the same as regular price",
        );
      }
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        toast.error(data.message);
      }
      {
        error ? toast.error(error) : <></>;
      }
      toast.success("Listing created successfully");
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              className="border p-3 rounded-lg"
              placeholder="Name"
              id="name"
              maxLength="70"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              className="border p-3 rounded-lg"
              placeholder="Description"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              className="border p-3 rounded-lg"
              placeholder="Address"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />
            <div className="flex flex-wrap gap-6">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-6">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="bedrooms"
                  className="border border-gray-300 rounded-lg p-3 w-14"
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <span className="">Beds</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="baths"
                  className="border border-gray-300 rounded-lg p-3 w-14"
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <span className="">Baths</span>
              </div>
              <div className="flex gap-4">
                <div className="flex gap-1ntend items-center">
                  <input
                    type="number"
                    id="regularPrice"
                    className="border border-gray-300 rounded-lg p-3 w-24"
                    required
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                  <div className="flex flex-col items-center text-center">
                    <span className="">Regular Price</span>
                    <span className="text-xs">($/Month)</span>
                  </div>
                </div>
                {/*
                 */}
                {formData.offer ? (
                  <div className="flex gap-1 items-center">
                    <input
                      type="number"
                      id="discountPrice"
                      className="border border-gray-300 rounded-lg p-3 w-24"
                      required
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                    <div className="flex flex-col items-center text-center">
                      <span className="">Discounted Price</span>
                      <span className="text-xs">($/Month)</span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {/* 

                 */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex gap-1">
            <p className="font-semibold">Images:</p>
            <span>The first image will be the cover image (max 6)</span>
          </div>
          <div className="flex gap-1">
            <input
              type="file"
              onChange={(e) => setFiles(e.target.files)}
              id="images"
              accept="image/*"
              multiple
              className="border p-3 rounded-lg"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="p-3 rounded-lg border border-green-700 text-green-700 uppercase hover:shadow-lg disabled:opacity-80">
              {uploading ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className="flex justify-between items-center">
                <img
                  key={url} // Add a unique key for each image
                  src={url}
                  alt="Listing image"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 uppercase hover:opacity-80 shadow-sm hover:shadow-lg p-3 rounded-lg">
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 uppercase rounded-lg text-white hover:opacity-95 disabled:opacity-80">
            {loading ? "Creating Listing..." : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
};
