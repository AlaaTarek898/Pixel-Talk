import React, { useState } from "react";
//Ui
import { Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/react";

//axios
import axios from "axios";
//form
import * as zod from "zod";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
//routing
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../Components/PasswordInput/PasswordInput";
import SingleInput from "../../Components/SingleInput/SingleInput";

export default function Register() {
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  //handle validation
  const schema = zod
    .object({
      name: zod
        .string("must be string")
        .nonempty("reauired")
        .min(3, "must be at least 3"),
      email: zod
        .email("not valid")
        .nonempty("reauired")
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "not valid"),
      password: zod.string().regex(/(?=.*?[A-Z])/, "at least one Upper case"),
      rePassword: zod.string(),
      gender: zod.string().regex(/^(male|female)$/, "select"),
      dateOfBirth: zod.coerce.date().refine(
        function (value) {
          if (new Date().getFullYear() - value.getFullYear() >= 18) {
            return true;
          }
        },
        { message: "you are young" }
      ),
    })
    .refine(
      function (value) {
        if (value.password == value.rePassword) {
          return true;
        } else {
          return false;
        }
      },
      { message: "password not match", path: ["rePassword"] }
    );

  const { handleSubmit, register, formState,control } = useForm({
    defaultValues: {
      name: "Alaa Tarek",
      email: "alaatarek2040@gmail.com",
      password: "Alaa@123",
      rePassword: "Alaa@123",
      dateOfBirth: "07-10-1994",
      gender: "female",
    },
    resolver: zodResolver(schema),
  });

  const { errors } = formState;
//send values 
  function handleRegister(values) {
    setError(null);
    setLoading(true);

    axios
      .post("https://linked-posts.routemisr.com/users/signup", values)
      .then((response) => {
        if (response.data.message === "success") {
          setLoading(false);
          navigate("/login");
        }
      })
      .catch((err) => {
        setError(err.response.data.error);
        setLoading(false);
      });
  }


  return (
    <main className=" w-full flex flex-col justify-center align-middle items-center  ">
      <h1 className="text-white m-3 text-4xl">Register</h1>

      {error && (
        <div className="bg-red-400 p-3 rounded-xl w-1/3 mb-2">{error}</div>
      )}

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="bg-glass p-3.5 rounded-xl w-full flex flex-col items-center md:w-1/3 m-auto "
      >
            <Controller
        name="name"
        control={control}
        rules={{ required: "name is required" }}
        render={({ field }) => (
          <SingleInput
            {...field}   
            label="name"
            placeholder="Enter name"
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
            
          />
        )}
      />
                  <Controller
        name="email"
        control={control}
        rules={{ required: "email is required" }}
        render={({ field }) => (
          <SingleInput
            {...field}   
            label="email"
            placeholder="Enter email"
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            type="email"
          />
        )}
      />
       
       
      
          <Controller
        name="password"
        control={control}
        rules={{ required: "Password is required" }}
        render={({ field }) => (
          <PasswordInput
            {...field}   // بيدي value + onChange
            label="Password"
            placeholder="Enter password"
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            
          />
        )}
      />
         <Controller
        name="rePassword"
        control={control}
        rules={{ required: "the password must be the same" }}
        render={({ field }) => (
          <PasswordInput
            {...field}   // بيدي value + onChange
            label="rePassword"
            placeholder="Enter your password again"
            errorMessage={errors.rePassword?.message}
            isInvalid={!!errors.rePassword}
          />
        )}
      />
      

        <Input
          className="w-full m-2"
          label="Date Of Birth"
          placeholder="Enter your Date Of Birth"
          type="date"
          name="dateOfBirth"
          errorMessage={errors.dateOfBirth?.message}
          isInvalid={!!errors.dateOfBirth}
          {...register("dateOfBirth")}
        />
        <Select
          name="gender"
          {...register("gender")}
          errorMessage={errors.gender?.message}
          isInvalid={!!errors.gender}
          className="w-full m-2"
          label="gender"
        >
          <SelectItem key={"male"}>male</SelectItem>
          <SelectItem key={"female"}>Female</SelectItem>
        </Select>
        <Button
          className="m-4"
          type="submit"
          color="primary"
          isDisabled={loading}
          isLoading={loading}
          onClick={() => setError(null)}
        >
          {loading ? "loading" : "Register"}
        </Button>
      </form>
    </main>
  );
}
