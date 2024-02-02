import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed, FaChair, FaParking } from "react-icons/fa";

function listingDetail() {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        setError(false);
        setLoading(true);
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(false);
          setLoading(false);
          return;
        }
        setListing(data);
        console.log(data);

        setLoading(false);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main className="">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls ? (
              listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}></div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="text-center my-7 text-2xl">
                <p>No images available</p>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      )}
      <div className="px-2">
        <p className="font-semibold">
          {listing.name}
          {" - "}
          {listing.type === "rent"
            ? `${+listing.regularPrice}$ / month`
            : `${+listing.regularPrice}`}
        </p>
        <p className="flex items-center gap-1 text-slate-600 my-2 text-sm">
          <MdLocationOn className="text-green-700" />
          {listing.address}
        </p>
        <div className="flex gap-4">
          <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md hover:opacity-95">
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </p>
          {listing.offer && (
            <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md hover:opacity-95">
              ${+listing.regularPrice - listing.discountPrice}
            </p>
          )}
        </div>
        <p className="my-2">
          <span className="font-semibold text-black">Description -</span>{" "}
          <span className="texsla800">{listing.description}</span>{" "}
        </p>
        <ul className="flex flex-wrap gap-6">
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBed className="text-lg text-green-700" />
            {listing.bedrooms > 1
              ? `${listing.bedrooms} beds`
              : `${listing.bedrooms} bed`}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBath className="text-lg text-green-700" />
            {listing.bathrooms > 1
              ? `${listing.bathrooms} bathrooms`
              : `${listing.bathrooms} bathroom`}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaParking className="text-lg text-green-700" />
            {listing.parking ? "Parking spot" : "No parking"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaChair className="text-lg text-green-700" />
            {listing.furnished ? "Furnished" : "Not furnished"}
          </li>
        </ul>
      </div>
    </main>
  );
}

export default listingDetail;
