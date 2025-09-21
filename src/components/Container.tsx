import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="
        max-w-[1280px] 
        mx-auto 
        px-4 
        text-center
        flex 
        flex-col
        sm:px-6 
        lg:px-8
      "
    >
      {children}
    </div>
  );
};

export default Container;
