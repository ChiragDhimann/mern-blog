import { Button } from 'flowbite-react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import React from 'react'
import {GoogleAuthProvider,signInWithPopup, getAuth} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function GAuth() {
    const auth=getAuth(app);
    const  dispatch = useDispatch();
    const navigate=useNavigate();
    const handleGoogleButton=async ()=>{
        const provider=new GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account'});
        try{
            const resultFromGoogle=await signInWithPopup(auth,provider);
            const res=await fetch('/api/auth/google',{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    name:resultFromGoogle.user.displayName,
                    email:resultFromGoogle.user.email,
                    photoUrl:resultFromGoogle.user.photoURL,
                }),
            });
            const data=await res.json();
            if(res.ok){ 
                dispatch(signInSuccess(data));
                navigate("/");
            }
            // console.log(resultFromGoogle);
        }catch(error){
            console.log(error);
        }
    }
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleButton}>
        <AiFillGoogleCircle className='h-6 w-6 mr-2'/>
        Continue with google
    </Button>
  )
}
