import React from 'react'
import { Input } from "@heroui/react";

export default function SingleInput({label,placeholder,type,name,errorMessage, isInvalid,value,
  onChange}) {
  return (
    <div className="relative w-full m-2 ">
        <Input
          className="w-full "
          label={label}
          placeholder={placeholder}
          type={type}
          name={name}
          errorMessage={errorMessage}
          isInvalid={isInvalid}
          value={value}
          onChange={onChange}
       
        />   
        </div>
  )
}
