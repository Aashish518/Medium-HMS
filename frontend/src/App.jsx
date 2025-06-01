import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Admindashboard } from "./pages/Admindashboard";
import { Manageallhosdetail } from "./pages/Manageallhosdetails";
import { Profile } from "./pages/Profile";
import { Managerooms } from "./pages/Managerooms";
import { Roomdetails } from "./pages/Roomdetails";
import { Applyform } from "./pages/Applyform";
import { Managestudentapplication } from "./pages/Managestudentapplications";
import { Moreaboutstudent } from "./pages/Moreaboutstudent";
import { Complaints } from "./pages/Complaints";
import { Managecomplaints } from "./pages/Managecomplaints";
import { Ragisteruser } from "./pages/Ragisteruser";
import { Meritelistpage } from "./pages/Meritelistpage";
import { Studentroomfees } from "./pages/Studentroomfees";
import { Review } from "./pages/Review";

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/login", element: <Login /> },
  { path: "/admindashboard", element: <Admindashboard /> },
  { path: "/admindashboard/manageallhosdetail", element: <Manageallhosdetail /> },
  { path: "/admindashboard/managerooms", element: <Managerooms /> },
  { path: "/admindashboard/managestudentapplication", element: <Managestudentapplication /> },
  { path: "/admindashboard/managecomplaints", element: <Managecomplaints /> },
  { path: "/admindashboard/ragisteruser", element: <Ragisteruser /> },
  { path: "/admindashboard/ragisteruser/studentroomfees", element: <Studentroomfees /> },
  { path: "/profile", element: <Profile /> },
  { path: "/roomdetails", element: <Roomdetails /> },
  { path: "/applyform", element: <Applyform /> },
  { path: "/moreaboutstudent", element: <Moreaboutstudent /> },
  { path: "/complaints", element: <Complaints /> },
  { path: "/meritelistpage", element: <Meritelistpage /> },
  { path: "/review", element: <Review /> },
]);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>
};

export default App;

