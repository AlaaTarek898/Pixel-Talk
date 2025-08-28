import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function useGet(method,URL,requestBody,headers) {
    const [data, setData] = useState(null);
    const[error,setError]=useState(null);
    const[isLoading,setIsLoading]=useState(false);

  function getdata(){
   axios({
    method,
    url:URL,
    data:requestBody,
    headers,
   }).then((response) => {
    // console.log(response.data);
    if (response.data.message === "success") {
      setData(response.data); 
   }})
   .catch(err => {
    setError(err);

   }).finally(()=>{
    setIsLoading(false)
   })

}

useEffect(()=>{
    getdata()
},[])

  return (
    {data,error,isLoading}
  )
}
