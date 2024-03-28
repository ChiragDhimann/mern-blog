
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import {Link , useNavigate} from "react-router-dom"
import { signInFailure,signInStart,signInSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function SignIn() {

  const [formData,setFormData]=useState({});
  const {loading, error:errorMessage}=useSelector(state=>state.user);
  const dispatch=useDispatch()
  const navigate=useNavigate();

  const handlingData=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }
  // console.log(formData);
  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password){
      return dispatch(signInFailure("please fill all the fileds"));
    }
    try{
      dispatch(signInStart());
      const res=await fetch('/api/auth/signin',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(formData),
    });
    const data=await res.json();
    if(data.success===false){
      dispatch(signInFailure(data.message));
    }
    if(res.ok){
      dispatch(signInSuccess(data));
      navigate("/")
    }
    }
    catch(err){
      dispatch(signInFailure(err.message));
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
          You can sign in with email and password or Google.
        </p>
        </div>

        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

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
                ): 'Sign In'
              }
             
            </Button>
          </form>
          <div className='flex text-sm  gap-2 mt-5'>
            <span>
             Don't Have an Account
              </span>
              <Link to="/sign-up " className='text-blue-500'>
                sign up
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
