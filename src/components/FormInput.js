import React from "react";

const FormInput = (props) => {
    const getSize = () => {
        if(props.small && props.small==="true") {
            return "w-[20%]";
        } else if(props.med && props.med === "true") {
            return "w-[75%]";
        }
    }
    return (
        <div className=" text-lg py-4">
            {props.children}
            <input className={`rounded mx-2 px-1 ${getSize()}`} type={props.type} name={props.name} placeholder={props.placeholder} onChange={props.onChange} value={props.value}  />
        </div>
    )
};

export default FormInput;