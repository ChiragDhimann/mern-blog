import { Sidebar } from 'flowbite-react'
import React from 'react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice';
import {useDispatch} from 'react-redux'

export default function DashSidebar() {
    const location=useLocation();
    const dispatch=useDispatch();
  const [tab,setTab]=useState("");
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabfromUrl=urlParams.get('tab');
    if(tabfromUrl){
      setTab(tabfromUrl);
    }
  },[location.search]);

  const handleSignOut=async ()=>{
    try{
      const res=await fetch("/api/user/signout",{
        method:"POST",
      });
      const data=await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signOutSuccess());
      }
    }catch(err){
      next(err);
    }
  }


  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile' >
            <Sidebar.Item active={tab==='profile'} label='user' labelColor='dark' icon={HiUser} as='div'> 
                    Profile
                </Sidebar.Item>
                </Link>
                <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
                    Sign out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
