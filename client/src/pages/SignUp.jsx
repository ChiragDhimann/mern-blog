
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import {Link , useNavigate} from "react-router-dom"
import GAuth from '../components/GAuth';

export default function SignUp() {

  const [formData,setFormData]=useState({});
  const [errorMessage,setErrorMessage]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();

  const handlingData=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }
  // console.log(formData);
  const handleSignUpSubmit=async (e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage("All Fields are required");
    }
    try{
      setLoading(true);
      setErrorMessage(null);
      const res=await fetch('/api/auth/signup',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(formData),
    });
    const data=await res.json();
    if(data.success===false){
      setErrorMessage(data.message);
    }
    setLoading(false);
    if(res.ok){
      navigate("/sign-in")
    }
    }
    catch(err){
      setErrorMessage(err.message);
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
        <Link to="/" className=' text-4xl
        font-bold dark:text-white' >
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
             via-purple-500 to-pink-500 rounded-lg text-white'>Chirag's</span>Blog
        </Link>
        <p className=' text-sm mt-5'>
          You can sign up with email and password or Google.
        </p>
        </div>

        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSignUpSubmit}>
            <div>
              <Label value="Username" />
              <TextInput type='text' placeholder='Username' id='username' onChange={handlingData}/>
            </div>

            <div>
              <Label value="Email" />
              <TextInput type='email' placeholder='Email' id='email' onChange={handlingData}/>
            </div>

            <div>
              <Label value="Password" />
              <TextInput type='password' placeholder='Password' id='password' onChange={handlingData}/>
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                  <Spinner size="sm"/>
                  <span>loading...</span>
                  </>
                ): 'Sign Up'
              }
             
            </Button>
            <GAuth />
          </form>
          <div className='flex text-sm  gap-2 mt-5'>
            <span>
              Have an Account
              </span>
              <Link to="/sign-in " className='text-blue-500'>
                sign in
                </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color="failure">
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
