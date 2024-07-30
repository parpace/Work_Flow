import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

export default function Header () {
    const loggedInUser = localStorage.getItem('loggedInUser')
    const [userData, setUserData] = useState({})
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showSettingsMenu, setShowSettingsMenu] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedInUser) {
            const getUserData = async (userId) => {
                const response = await axios.get(`http://127.0.0.1:8000/users/${userId}/`)
                setUserData(response.data)
            }
            getUserData(loggedInUser)
        }
    }, [loggedInUser])

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu)
    }

    const toggleSettingsMenu = () => {
        setShowSettingsMenu(!showSettingsMenu)
    }

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser')
        setShowUserMenu(false)
        navigate(`/`)
    }
    
    return (
        <div className="header">
            {loggedInUser ? (
                <>
                    <div className="headerLeft">
                        <h3 onClick={() => navigate(`/home/${userData.user_name}`)}>Work_Flow</h3>
                    </div>
                    <div className="headerRight">
                        <div className='headerRightDiv'>
                            <h4 className='headerUsername'>{userData.user_name}</h4>
                            <img className='userImg' onClick={toggleUserMenu} src={userData.user_img}/>
                        </div>
                        {showUserMenu && (
                            <ul className="dropdown">
                                <li onClick={toggleSettingsMenu}>settings</li>
                                <li onClick={handleLogout}>Logout</li>
                            </ul>
                        )}
                    </div>
                    {showSettingsMenu && (
                        <h1>Settings Menu</h1>
                    )}
                </>
            ) : (
                <div className="headerLeft">
                        <h3>Work_Flow</h3>
                    </div>
            )}
        </div>
    )
}