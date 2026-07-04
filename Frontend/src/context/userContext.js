import { useEffect, useState } from "react";
import axios from "axios";

export const INITIAL_FORM_DATA = {
  username: "",
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  password: "",
};

export function buildAuthPayload(authMode, formData) {
  if (authMode === "login") {
    return {
      username: formData.username,
      password: formData.password,
    };
  }

  return {
    username: formData.username,
    firstName: formData.firstName,
    lastName: formData.lastName,
    dob: formData.dob,
    email: formData.email,
    password: formData.password,
  };
}

export function persistAuthState(token, userData) {
  if (!token) return;

  localStorage.setItem("authToken", token);
  localStorage.setItem("authUser", JSON.stringify(userData));
  window.dispatchEvent(new Event("authStateChanged"));
}

export function clearAuthState() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  window.dispatchEvent(new Event("authStateChanged"));
}

export function hasStoredAuth() {
  return Boolean(localStorage.getItem("authToken"));
}

export function useAuthPanelState(onClose) {
  const [authMode, setAuthMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLoggedIn(hasStoredAuth());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        authMode === "login" ? "/api/users/login" : "/api/users/register";
      const payload = buildAuthPayload(authMode, formData);
      const response = await axios.post(endpoint, payload);
      const token = response.data?.accessToken ?? response.data?.token;
      const userData = response.data?.user ?? response.data;

      if (token) {
        persistAuthState(token, userData);
        setIsLoggedIn(true);
      }

      setMessage(
        authMode === "login"
          ? "Logged in successfully"
          : "Registered successfully",
      );
      onClose?.();
    } catch (error) {
      setMessage(
        error.response?.data?.error || error.message || "Authentication failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthState();
    setIsLoggedIn(false);
    setMessage("You have been logged out");
    onClose?.();
  };

  return {
    authMode,
    setAuthMode,
    isLoggedIn,
    setIsLoggedIn,
    formData,
    handleChange,
    message,
    setMessage,
    loading,
    handleSubmit,
    handleLogout,
  };
}
