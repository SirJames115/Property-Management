import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./component/Header";
import PrivateRoute from "./component/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateListing } from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import ListingDetail from "./pages/listingDetail";
import Search from "./pages/Search";
// import Listing from "./pages/Listing";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/:searchQuery" element={<Search />} />
          <Route path="/listing/:listingId" element={<ListingDetail />} />
          {/* <Route path="/listing/:listingId" element={<Listing />} /> */}
          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route
              path="/update-listing/:listingId"
              element={<UpdateListing />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
