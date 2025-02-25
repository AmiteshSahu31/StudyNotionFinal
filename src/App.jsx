import "./App.css";
import { Route,Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import MyProfile from "./components/core/Dashboard/MyProfile";
import DashBoard from "./pages/DashBoard";
import OpenRoute from "./components/core/Auth/OpenRoute"; 
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./components/core/Dashboard/Add Course";
import { useSelector } from "react-redux";
import Catalog from "./pages/Catalog";

function App() {
  const {user} = useSelector((state) => state.profile);


  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="catalog/:catalogName" element={<Catalog/>}/>
        <Route
          path="signup"
          element={
             <OpenRoute>
              <Signup />
             </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
             <OpenRoute>
              <Login />
             </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
             <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
             <OpenRoute>
               <UpdatePassword/>
             </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
             <OpenRoute>
              <VerifyEmail/>
             </OpenRoute>
          }
        />
         <Route
          path="about"
          element={
            <OpenRoute>
              <About/>
            </OpenRoute>
          }
        />

        <Route  
           element={
            <PrivateRoute>
             <DashBoard />
            </PrivateRoute>
           }
        >
          <Route path="dashboard/my-profile"
         element={<MyProfile/>} />

         {
          user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
            </>
          )
         }
        </Route>

      </Routes>
    </div>
  );
}

export default App;
