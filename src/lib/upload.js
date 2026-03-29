import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "./firebase"

const upload=async (file)=>{
    const date=new Date()
    const storageRef=ref(storage,`images/${date + file.name}`);
    
    const uploadTask=uploadBytesResumable(storageRef,file)
    return new Promise((resolve,reject)=>{
        uploadTask.on('state_changed',(snapshot)=>{
            const progress=(snapshot.bytesTransferred / snapshot.totalBytes)*100;
            console.log("telechargement "+progress+" % fait");
        },(error)=>{
            reject("Quelque chose s'est mal deroule !"+error.code)
        },()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                resolve(downloadURL)
            })
        })
    }
)}

export default upload