import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import Dashprofile from '../components/Dashprofile';
import DashPost from '../components/DashPost';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';

export default function Dashboard() {
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
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'> 
        <DashSidebar />
      </div>
      {/* Profile */}
     {tab==='profile' && <Dashprofile />}
     {/* Posts */}
     {tab==='posts' && <DashPost />}
     {/* Users */}
     {tab==='users' && <DashUsers />}
     {/* Comments */}
     {tab==='comments' && <DashComments />}
    </div>
  )
}
