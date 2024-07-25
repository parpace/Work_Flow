import { useEffect, useState } from "react"
import axios from "axios"

export default function ProjectManagement (props) {
    const loggedInUser = props.loggedInUser
    const [userProjects, setUserProjects] = useState([])
    
    useEffect(() => {
        const getUserData = async (userId) => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${userId}/`)
                // console.log(response.data)
                const { owned_projects, collaborating_projects } = response.data
                const combinedProjects = [...owned_projects, ...collaborating_projects]
                setUserProjects(combinedProjects)
            } catch (error) {
                console.error('Error fetching projects or invitations:', error)
            }
        }
        getUserData(loggedInUser)
    }, [loggedInUser])
    
    return (
        <div className="projectManagement">
            {userProjects && (
                <div className="projectManagementList">
                    {userProjects.map(project => (
                        <div key={project.id}>{project.project_name}</div>
                    ))}
                </div>
            )}
        </div>
    )
}