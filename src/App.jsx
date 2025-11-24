import { useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import TopBar from "./components/TopBar";
import { AuthProvider }  from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TopBar />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
