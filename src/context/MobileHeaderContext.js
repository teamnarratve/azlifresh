"use client";

import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

const MobileHeaderContext = createContext();

export const MobileHeaderProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const pathname = usePathname();

  // Reset title on route change
  React.useEffect(() => {
    setTitle("");
  }, [pathname]);

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
