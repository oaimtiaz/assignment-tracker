import React from "react";
import TableComponent from "./components/TableComponent";

const App = () => {
  return (
    <div className="h-screen bg-gray-200" >
      <div className="h-[10%] text-3xl font-bold flex justify-center items-center"> 
        Assignment Tracker
      </div>
      <div className="w-full h-[45%] flex flex-row text-xl">
        <TableComponent>Upcoming this week</TableComponent>
        <TableComponent>High priority this week</TableComponent>
      </div>
      <div className="w-full h-[45%] flex flex-row text-xl">
        <TableComponent>Upcoming this month</TableComponent>
        <TableComponent>High priority this month</TableComponent>
      </div>
    </div>
    
  );
};

export default App;