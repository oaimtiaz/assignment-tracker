import React from "react";

const TableComponent = (props) => {
    return (
        <div className="w-full bg-blue-300 justify-center m-4 p-4 shadow-l rounded-lg hover:shadow-2xl transition-all duration-200"> 
            <div className=" w-full flex border-b-2 content-center justify-center text-2xl">
                {props.children}
            </div>
        </div>
    );
};

export default TableComponent;