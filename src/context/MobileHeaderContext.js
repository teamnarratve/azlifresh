"use client";

import React, { createContext, useContext, useState } from "react";

const MobileHeaderContext = createContext();

export const MobileHeaderProvider = ({ children }) => {
  const [title, setTitle] = useState("");

  // Helper to set title, defaulting to empty if null
  const setMobileHeaderTitle = (newTitle) => {
    setTitle(newTitle || "");
  };

  return (
    <MobileHeaderContext.Provider value={{ title, setMobileHeaderTitle }}>
      {children}
    </MobileHeaderContext.Provider>
  );
};

export const useMobileHeader = () => {
  return useContext(MobileHeaderContext);
};
