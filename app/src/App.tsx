import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/Layout'
import PageUnderConstruction from './components/general/PageUnderConstruction'
import Home from './components/Home'
import GroupComponent from './components/group/GroupComponent'
import UserComponent from './components/user/UserComponent'

const App = () => {

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
