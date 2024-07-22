import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import UserHome from './UserHome'
import ProjectPage from './ProjectPage'

export default function Body () {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/home/:username' element={<UserHome/>}/>
                <Route path='/project/:projectId' element={<ProjectPage/>}/>
            </Routes>
        </div>
    )
}