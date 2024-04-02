import { Sidebar } from 'flowbite-react'
import React from 'react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';

export default function DashSidebar() {
    const location=useLocation();
  const [tab,setTab]=useState("");
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabfromUrl=urlParams.get('tab');
    if(tabfromUrl){
      setTab(tabfromUrl);
    }
  },[location.search]);
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile' >
            <Sidebar.Item active={tab==='profile'} label='user' labelColor='dark' icon={HiUser}>
                    Profile
                </Sidebar.Item>
                </Link>
                <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer'>
                    Sign out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
