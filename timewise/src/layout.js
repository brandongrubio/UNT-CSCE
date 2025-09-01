import React from "react";
import { useLocation } from "react-router-dom";
import PreLoginBar from "./components/preLoginBar";
import AppNavbar from "./components/navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {isAuthPage ? <PreLoginBar /> : <AppNavbar />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
