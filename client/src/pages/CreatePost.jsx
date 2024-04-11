import React from 'react'
import {TextInput,Select, FileInput, Button, Alert} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import { ref } from 'firebase/storage';
import { useState } from 'react';
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {useNavigate} from 'react-router-dom'

export default function CreatePost() {
    const [file,setFile]=useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({})
    const [publishError,setPublishError]=useState(null);

    const navigate=useNavigate();


    // console.log(formData);

    const handleUploadImageForPost=async ()=>{
        try{
            if(!file){
                setImageUploadProgress("please select an image");
            }
            setImageUploadError(null);
            const storage=getStorage(app);
            const fileName=new Date().getTime() +'-'+file.name;
            const storageRef=ref(storage,fileName);
            const uploadTask=uploadBytesResumable(storageRef,file);
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress=(snapshot.bytesTransferred / snapshot.totalBytes) *100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error)=>{
                    setImageUploadError("image upload failed");
                    setImageUploadError(null);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({...formData,image: downloadURL});
                    })
                }
            )
        }catch(err){
            setImageUploadError("please select an image");
            setImageUploadProgress(null);
            // console.log(err);
        }
    }

    const handlePost=async (e)=>{
        e.preventDefault();
        try{
            const res=await fetch('/api/post/create',{
                method:"POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify(formData),
            })
            const data=await res.json();
            console.log(publishError);
            if(!res.ok){
                setPublishError(data.message);
            }
            if(res.ok){
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        }catch(err){
            setPublishError("Something went wrong");
        }
    }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
    
    <h1 className='text-center text-3xl my-7 font-semibold'>Create a new post</h1>
    <form className='flex flex-col gap-4' onSubmit={handlePost}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput type='text' 
            placeholder='title' 
            required 
            id='title' 
            className='flex-1'
            onChange={(e)=>setFormData({...formData,title:e.target.value})}/>
            <Select
            onChange={(e)=>setFormData({...formData,category:e.target.value})}
            >
                <option value='uncategorized'>Select a category</option>
                <option value='javascript'>Javascript</option>
                <option value='reactjs'>React.js</option>   
                <option value='nextjs'>Next.js</option>
            </Select>
            
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput accept="image/*" type='file' onChange={(e)=>setFile(e.target.files[0])}/>
                <Button gradientDuoTone='purpleToBlue' type='button' size='sm' outline onClick={handleUploadImageForPost} disabled={imageUploadProgress}>
                    {
                        imageUploadProgress ?
                        (<div className='w-16 h-16'>
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                        </div>):("Upload Image")
                    }
                    </Button>
            </div>
            {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
            {formData.image && (
                <img src={formData.image} 
                alt='upload'
                className='w-full h-72 object-cover'
                />
            )}
            <ReactQuill  theme="snow" className='h-72 mb-12' required
            onChange={(value)=>{
                setFormData({...formData,content:value})
            }}
            />
            <Button type='submit' gradientDuoTone='purpleToPink' >Publish</Button>
            {
                publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>
            }
    </form>
        </div>
  )
}
