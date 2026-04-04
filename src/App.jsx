import { useEffect } from "react"
import AppRoutes from "./routes/Routes"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"

const App = () => {
  const {currentUser,isLoading,fetchUserInfo}=useUserStore()

  useEffect(()=>{
    const unSub=onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid)
    })
    return ()=>{
      unSub();
    }
  },[fetchUserInfo])
  
  if(isLoading) return <div className="loading">Chargement...</div>

  return (
    <AppRoutes/>
  )
}

export default App