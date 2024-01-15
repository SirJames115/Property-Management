import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUpoading] = useState(false);
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
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
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
            />
            <textarea
              type="text"
              className="border p-3 rounded-lg"
              placeholder="Description"
              id="description"
              required
            />
            <input
              type="text"
              className="border p-3 rounded-lg"
              placeholder="Address"
              id="address"
              required
            />
            <div className="flex flex-wrap gap-6">
              <div className="flex gap-2">
                <input type="checkbox" id="sell" className="w-5" />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className="w-5" />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="parking" className="w-5" />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="furnished" className="w-5" />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="offer" className="w-5" />
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
                />
                <span className="">Beds</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="baths"
                  className="border border-gray-300 rounded-lg p-3 w-14"
                  required
                />
                <span className="">Baths</span>
              </div>
              <div className="flex gap-4">
                <div className="flex gap-1 items-center">
                  <input
                    type="number"
                    id="regularPrice"
                    className="border border-gray-300 rounded-lg p-3 w-24"
                    required
                  />
                  <div className="flex flex-col items-center text-center">
                    <span className="">Regular Price</span>
                    <span className="text-xs">($/Month)</span>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <input
                    type="number"
                    id="discountPrice"
                    className="border border-gray-300 rounded-lg p-3 w-24"
                    required
                  />
                  <div className="flex flex-col items-center text-center">
                    <span className="">Discounted Price</span>
                    <span className="text-xs">($/Month)</span>
                  </div>
                </div>
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

          <button className="p-3 bg-slate-700 uppercase rounded-lg text-white hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};
