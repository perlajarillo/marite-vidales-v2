import React from "react";

const UnderConstruction: React.FC = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-full h-160 overflow-hidden bg-auto md:bg-contain  bg-center bg-no-repeat bg-[url(assets/Under_Construction.png)]"></div>
    </div>
  );
};

export default UnderConstruction;
