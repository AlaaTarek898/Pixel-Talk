import React, { useState } from 'react'
import { Input } from "@heroui/react";
//icon
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

export default function PasswordInput({label,placeholder,type,name,errorMessage, isInvalid,value,
  onChange}) {
    
const [icon, setIcon] = useState(<FaRegEyeSlash />);
const [inputType, setInputType] = useState("password");
    function handleShowPassword() {
        if (inputType === "password") {
    setInputType("text");
    setIcon(FaEye);
  } else {
    setInputType("password");
    setIcon(FaRegEyeSlash);
  }
}
  return (
   <div className="relative w-full m-2 ">
        <Input
          className="w-full "
          label={label}
          placeholder={placeholder}
          type={inputType}
          name={name}
          errorMessage={errorMessage}
          isInvalid={isInvalid}
          value={value}
          onChange={onChange}
       
        />    <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={handleShowPassword}
          >
                    {icon}

          </span>
        </div>
  )
}
