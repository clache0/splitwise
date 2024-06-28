import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/Layout'
import PageUnderConstruction from './components/general/PageUnderConstruction'
import Home from './components/Home'
import GroupComponent, { User } from './components/group/GroupComponent'
import { useEffect, useState } from 'react'
import { fetchAllUsers } from './api/api'
import UserComponent from './components/user/UserComponent'

const App = () => {
  const [users, setUsers] = useState<User[]>([]);

  // fetch users
  const fetchData = async () => {
    try {
      const users = await fetchAllUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching groups data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/group/:groupId" element={<GroupComponent/>}/>
                <Route path="/users" element={<UserComponent users={users} />}/>
                <Route path="/under-construction" element={<PageUnderConstruction/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
