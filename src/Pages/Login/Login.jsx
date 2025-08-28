import React, { useContext, useState } from "react";
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
import { AuthContext, AuthContextProvider } from "../../Context/AuthContext";
import SingleInput from '../../Components/SingleInput/SingleInput'
export default function Register() {





  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

const{setUserToken}=useContext(AuthContext)

  const navigate = useNavigate();
  const schema = zod
    .object({

      email: zod
        .email("not valid")
        .nonempty("reauired")
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "not valid"),
      password: zod.string().regex(/(?=.*?[A-Z])/, "at least one Upper case"),
     
    })
    

  const { handleSubmit, register, formState ,control } = useForm({
    defaultValues: {

      email: "alaatarek2040@gmail.com",

       password: "Alaa@123",
     
   
    },
    resolver: zodResolver(schema),
  });

  const { errors } = formState;

   function handleLogin(values) {
        setError(null)
        setLoading(true)

   
        axios.post('https://linked-posts.routemisr.com/users/signin', values).then((response) => {
          console.log(response)
            if (response.data.message === 'success') {
                setLoading(false)
                setUserToken(response.data.token)
                localStorage.setItem('token', response.data.token)
                navigate('/Posts')

            }
        }).catch((err) => {
            setError(err.response.data.error);
            setLoading(false)

        })
    }
  // console.log("erroris", errors);

  return (
    <main className=" w-11/12 flex flex-col justify-center items-center  m-auto ">
      <h1 className="text-white m-3 text-4xl">Login</h1>
      {error && (
        <div className="bg-red-400 p-3 rounded-xl w-1/3 mb-2">{error}</div>
      )}

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-glass p-3.5 rounded-xl w-11/12 flex flex-col items-center md:w-1/3 m-auto "
      >

      
           <Controller
        name="email"
        control={control}
        rules={{ required: "theemail " }}
        render={({ field }) => (
          <SingleInput
            {...field}   // بيدي value + onChange
            label="email"
            placeholder="Enter your email "
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
          />
        )}
      />
           <Controller
        name="password"
        control={control}
        rules={{ required: "the password " }}
        render={({ field }) => (
          <PasswordInput
            {...field}   // بيدي value + onChange
            label="Password"
            placeholder="Enter your password "
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
          />
        )}
      />
   
        <Button
          className="m-4"
          type="submit"
          color="primary"
          isDisabled={loading}
          isLoading={loading}
          onClick={() => setError(null)}
        >
          {loading ? "loading" : "Login"}
        </Button>
      </form>
    </main>
  );
}
