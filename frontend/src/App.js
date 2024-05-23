import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Home from "./components/home";
import Readmore from "./components/readMore";
import Login from "./components/login";
import Signup from "./components/sigiup";
import Mypost from "./components/mypost";
import Menu from "./components/Menu";
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/readmore/:id" element={<Readmore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/mypost" element={<Mypost/>}/>
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/header" element={<Header/>}/>
      </Routes>
    </BrowserRouter>
  );
}
