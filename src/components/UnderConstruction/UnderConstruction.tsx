import React from "react";

const UnderConstruction: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-screen items-center p-5 gap-5">
      <div className="w-full h-120 overflow-hidden bg-contain bg-center bg-no-repeat bg-[url(assets/Under_Construction.png)]"></div>
      <p>Working in something awesome, stay tuned!</p>
    </div>
  );
};

export default UnderConstruction;
