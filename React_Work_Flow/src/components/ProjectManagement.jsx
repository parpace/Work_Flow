import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function ProjectManagement (props) {
    const { projectId, loggedInUser } = props
    const [userProjects, setUserProjects] = useState([])
    const [currentProject, setCurrentProject] = useState({})
    const navigate = useNavigate
    
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

        const getProjectData = async () =>  {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/projects/${projectId}/`)
                console.log(response.data)
                setCurrentProject(response.data)
            } catch (error) {
                console.log('Error fetching current project', error)
            }
        }
        getProjectData()
    }, [loggedInUser])
    
    return (
        <div className="projectManagement">
            <h3 className="projectName">{currentProject.project_name}</h3>
            <div className="projectSettings">
                <div>Board Settings ^</div>
                <div>Collaborators +</div>
            </div>
            <h3 className="yourBoards">Your Boards</h3>
            {userProjects && (
                <div className="projectManagementList">
                    {userProjects.map(project => (
                        <div className="projectManagementDiv" key={project.id} onClick={() => navigate(`/project/${project.id}`)}>{project.project_name}</div>
                    ))}
                </div>
            )}
        </div>
    )
}