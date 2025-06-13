import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import {ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from "./store/useAuthStore.js";
import Chat from "./components/Chat.jsx";
import SidebarForUsers from "./components/SidebarForUsers.jsx";


function App() {
  const { authUser } = useAuthStore();
  return (
    <BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      { authUser && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<Chat />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sidebar" element={<SidebarForUsers />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
