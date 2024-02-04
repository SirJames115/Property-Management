import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          toast.error(data.message);
          return;
        }
        toast.success(data.message);
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  });

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg"
            placeholder="Enter your message here"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}></textarea>

          <Link
            className="uppercase text-white p-3 text-center bg-slate-700 hover:opacity-95 rounded-lg"
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body${message}`}>
            Send message
          </Link>
        </div>
      )}
    </>
  );
}

export default Contact;
