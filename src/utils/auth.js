import Cookies from "js-cookie";

export const getAuthToken = () => {
  return Cookies.get("api_key") || localStorage.getItem("authToken") || null;
};

export const isLoggedIn = () => {
  return !!getAuthToken();
};
