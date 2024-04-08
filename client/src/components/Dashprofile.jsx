import React, { useState , useRef, useEffect} from 'react'
import {useSelector}  from "react-redux";
import {Alert, Button, TextInput} from 'flowbite-react'
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage'
import {app} from  '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure,updateStart,updateSuccess,deleteUserError,deleteUserStart,deleteUserSuccess,signOutSuccess } from '../redux/user/userSlice.js';
import {useDispatch} from 'react-redux'
import { Modal } from 'flowbite-react';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {Link} from  'react-router-dom'




export default function Dashprofile() {
  const {currentUser,error,loading}= useSelector(state => state.user)
  const [imageFile,setImageFile]=useState(null)
  const [imageFileUrl,setImageFileUrl]=useState(null)
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal,setShowModal]=useState(false);
  const [formData,setFormData]=useState({});
  
  const filePickerRef=useRef();
  const dispatch=useDispatch();

  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(()=>{
    if(imageFile){
      uploadImage();
    }
  },[imageFile]);

  const uploadImage=async ()=>{
//     rules_version = '2';

// // Craft rules based on data in your Firestore database
// // allow write: if firestore.get(
// //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write : if
//       request.resource.size < 2 *1024*1024 &&
//       request.resource.contentType.matches('image/.*')
//     }
//   }
// }
setImageFileUploading(true);
setImageFileUploadError(null);

    const storage=getStorage(app);
    const fileName=new Date().getTime()+ imageFile.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error)=>{
        setImageFileUploadError("could not upload image (size must less then 2 MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setImageFileUrl(downloadURL);
          setFormData({...formData,profilePicture:downloadURL});
          setImageFileUploading(false);
        })
      }
    )
  }

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }

  // console.log(formData);

  const handleUpdateSubmit=async (e)=>{
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if(Object.keys(formData).length===0){
      setUpdateUserError("No changes made")
      return;
    }
    if(imageFileUploading){
      setUpdateUserError("Wait for image upload");
      return;
    }
    try{
      dispatch(updateStart());
      // console.log("hi1")
      const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });
      // console.log("hi2")
      const data=await  res.json();
      console.log(data);
      
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message)
      }else{
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User profile updated successfully");
      }

    }catch(err){
        dispatch(updateFailure(err.message));
        setUpdateUserError(err.message);
    }
  }

  const handleDeleteUser=async ()=>{
    setShowModal(false);
    try{
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}` , {
        method:"DELETE",
      }
      );
      const data=await res.json();
      if(!res.ok){
        dispatch(deleteUserError(data.message))
      }else{
        dispatch(deleteUserSuccess(data))
      }

    }catch(err){
      dispatch(deleteUserError(err.message))
    }
  }

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
    <div className='max-w-lg mx-auto p-3 w-full'> 
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleUpdateSubmit} className='flex flex-col gap-4'>
        <input 
        type='file' 
        accept='image/.*' 
        onChange={handleImageChange}
        ref={filePickerRef}
        hidden
        />
      <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' 
      onClick={()=>filePickerRef.current.click()}>

        {imageFileUploadProgress && (
          <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} 
            strokeWidth={5}
            styles={{
              root:{
                width:'100%',
                height:'100%',
                position:'absolute',
                top:0,
                left:0,
              },
                path:{
                  stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`,
                },
            }}

          />

        )}
        <img src={imageFileUrl || currentUser.profilePicture} 
        alt="user" className={`rounded-full h-full w-full border-8 object-cover border-[lightgray] 
        ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`}/>
      </div>
      {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
      <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
      <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
      <TextInput type='password' id='password' placeholder='password'  onChange={handleChange}/>
      <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading}>
        {loading ? '...loading': "update"}
      </Button>

        { currentUser.isAdmin && (
          <Link to={'/create-post'}>
          <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
            Create a post
          </Button>
          </Link>
        )}

      </form>
      <div className='text-red-500 flex justify-between mt-3'>
        <span onClick={()=>{setShowModal(true)}} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && <Alert color="success" className='mt-5'>
        {updateUserSuccess}
        </Alert>}
      
      {
        updateUserError &&  
        <Alert color='failure' className='mt-5'> 
        {updateUserError}
        </Alert>
      }
       {
        error &&  
        <Alert color='failure' className='mt-5'> 
        {error}
        </Alert>
      }
      <Modal 
      show={showModal} 
      onClose={()=>setShowModal(false)} 
      popup 
      size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='text-gray-500 dark:text-gray-400 text-lg mb-5'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I am Sure
              </Button>
              <Button color='gray' onClick={()=>{setShowModal(false)}}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
