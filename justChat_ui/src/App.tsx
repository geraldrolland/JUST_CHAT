import './App.css'
import { Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import EmailVarification from './components/EmailVarification'
import OtpVarification from './components/OtpVarification'
import ChangePassword from './components/ChangePassword'
import Home from './components/Home'
import MessageBox from './components/MessageBox'

export const queryClient = new QueryClient()
function App() {

  useEffect(() => {
    document.body.classList.add("bg-gray-[#F5EFFF]")
    document.body.classList.add("overflow-x-hidden")
    
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/sign-up' element={<SignUp/>} />
          <Route path='/log-in' element={<LogIn/>} />
          <Route path='/forgot-password' element={<EmailVarification/>} />
          <Route path='/otp-verification' element={<OtpVarification/>} />
          <Route path='/change-password' element={<ChangePassword/>} /> 
          <Route path='/home/' element={<Home/>}>
          <Route path='friend/:userId' element={<MessageBox/>} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </>
  )
}

export default App
