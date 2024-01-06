import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">
        Profile
      </h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile-image"
          className="rounded-full h-24 w-24 self-center mt-2 object-cover cursor-pointer"
        />
        <input
          type="text"
          className="border p-3 rounded-lg"
          placeholder="Username"
          id="username"
        />
        <input
          type="email"
          className="border p-3 rounded-lg"
          placeholder="Email"
          id="email"
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          placeholder="Password"
          id="password"
        />
        <button className="bg-slate-700 rounded-lg hover:opacity-95  disabled:opacity-80 uppercase text-white p-3">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
