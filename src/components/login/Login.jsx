import React, { useState } from 'react'
import "./login.css"
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import upload from '../../lib/upload'


export default function Login() {
    const [avatar,setAvatar]=useState({
        file:null,
        url:""
    })
    const [loading,setLoading]=useState(false)
    const handleAvatar=e=>{
        if(e.target.files[0]){
          setAvatar({
            file:e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })  
        }  
    }
    const handleRegister=async(e)=>{
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);

        const {username,email,password}=Object.fromEntries(formData);

        try {
            const res=await createUserWithEmailAndPassword(auth,email,password)
            //const blocked=[]
            const imgUrl=await upload(avatar.file)
            await setDoc(doc(db,"users",res.user.uid),{
                username,
                email,
                avatar:imgUrl,
                id:res.user.uid,
                blocked:[]
                
                
            })
            await setDoc(doc(db,"userChats",res.user.uid),{
                chats:[],
            })
            toast.success("compte cree, vous pouvez vous connectez")
            
        } catch (error) {
           toast.error(error.message) 
        }finally{
            setLoading(false)
        }
    }
    const handleLogin=async (e)=>{
        e.preventDefault();
        setLoading(true);
        const formData=new FormData(e.target);
        const {email,password}=Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth,email,password)
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
  return (
    <div className='login'>
        <div className="item">
            <h2>Bienvenu A vous,</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder='Email'name='email' />
                <input type="password" placeholder='mot de pase'name='password' />
                <button disabled={loading}>{loading?"Chargement...":"Se Connecter"}</button>
            </form>
        </div>
        <div className="separator"></div>
        <div className="item">
        <h2>Creer un compte</h2>
            <form action=""onSubmit={handleRegister}>
                <label htmlFor="file">
                <img src={avatar.url || "./avatar.png"} alt="" />Charger l'image
                </label>
                <input type="file" id='file' style={{display:"none"}}onChange={handleAvatar}/>
                <input type="text" placeholder='votre nom'name='username' />
                <input type="email" placeholder='Email'name='email' />
                <input type="password" placeholder='mot de pase'name='password' />
                <button disabled={loading}>{loading?"Chargement...":"Enregistrer"}</button>
            </form>
        </div>
    </div>
  )
}


