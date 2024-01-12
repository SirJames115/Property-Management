import React from "react";

export const CreateListing = () => {
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
              <div className="flex gap-2 items-center">
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
              <div className="flex gap-2 items-center">
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
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex gap-1">
            <p className="font-semibold">Images:</p>
            <span>The first image will be the cover image (max 6)</span>
          </div>
          <div className="flex gap-1">
            <input type="file" id="images" className="border p-3 rounded-lg" />
            <button className="p-3 rounded-lg border border-green-700 text-green-700 uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 uppercase rounded-lg text-white hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};
