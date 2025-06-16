import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useState,useEffect} from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import Note from "./pages/Note";
import axiosInstance from "./api/axiosInstance";
function App() {
  const [backendData,setBackendData]=useState([{}])
  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const res=await axiosInstance.get('/text');
        setBackendData(res.data)
      }catch(e){
        console.error("Error fetching data",e)
      }
    }
    fetchData()
  },[])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/note/:noteId" element={<Note />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
