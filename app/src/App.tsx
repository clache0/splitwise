import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/Layout'
import PageUnderConstruction from './components/general/PageUnderConstruction'
import Home from './components/Home'
import GroupComponent from './components/group/GroupComponent'
import UserComponent from './components/user/UserComponent'
import { useEffect, useState } from 'react'
import PasswordPrompt from './components/general/PasswordPrompt'

const App = () => {
  if (!import.meta.env.VITE_PASSWORD) {
    console.error("ENVIRONMENT VARIABLE NOT DEFINED: VITE_PASSWORD")
    return <h1>Sorry Server issues!</h1>;
  }

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('password') === import.meta.env.VITE_PASSWORD;
  });

  const handleAuthenticate = (password: string, remember: boolean) => {
    if (password === import.meta.env.VITE_PASSWORD) {
      setIsAuthenticated(true);
      if (remember) {
        localStorage.setItem('password', password);
      }
      else {
        sessionStorage.setItem('password', password);
      }
    }
    else {
      alert('Incorrect password');
    }
  };

  useEffect(() => {
    const password = localStorage.getItem('password') || sessionStorage.getItem('password');
    if (password === import.meta.env.VITE_PASSWORD) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <PasswordPrompt onAuthenticate={handleAuthenticate} />;
  }

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/group/:groupId" element={<GroupComponent/>}/>
                <Route path="/users" element={<UserComponent />}/>
                <Route path="/under-construction" element={<PageUnderConstruction/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
