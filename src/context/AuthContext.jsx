import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      try {
        const decodedUser = jwtDecode(access_token);
        // get username, email, roles і т.д.
        setUser(decodedUser);
      } catch (error) {
        Cookies.remove("access_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {setUser(userData)};
  const logout = () => {setUser(null)};

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
