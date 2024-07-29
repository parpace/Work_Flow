import ProjectManagement from './ProjectManagement'
import ProjectBoard from './ProjectBoard'
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom'

export default function ProjectPage () {
    const loggedInUser = localStorage.getItem('loggedInUser')
    const { projectId } = useParams()
    const [userProjects, setUserProjects] = useState([])
    const [currentProject, setCurrentProject] = useState({})
    const [projectMembers, setProjectMembers] = useState([])

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${loggedInUser}/`)
                // console.log(response.data)
                const { owned_projects, collaborating_projects } = response.data
                const combinedProjects = [...owned_projects, ...collaborating_projects]
                setUserProjects(combinedProjects)
            } catch (error) {
                console.error('Error fetching projects or invitations:', error)
            }
        }
        getUserData()

        const getProjectData = async () =>  {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/projects/${projectId}/`)
                console.log(response.data)
                setCurrentProject(response.data)

                const collaborators = response.data.collaborators;
                const ownerId = response.data.owner;
                const memberIds = [...collaborators.map(collab => collab.user), ownerId];

                const memberResponses = await Promise.all(memberIds.map(id => 
                    axios.get(`http://127.0.0.1:8000/users/${id}/`)
                ))

                const members = memberResponses.map((res, index) => {
                    const userData = res.data
                    return {
                        data: userData,
                        status: memberIds[index] === ownerId ? 'owner' : 'collaborator'
                    }
                })
                setProjectMembers(members)
                
            } catch (error) {
                console.log('Error fetching current project data', error)
            }
        }
        getProjectData()
    }, [loggedInUser, projectId])

    return (
        <div className='projectPage'>
            <ProjectManagement 
                userProjects={userProjects}
                currentProject={currentProject}
                projectMembers={projectMembers}
                projectId={projectId}
                loggedInUser={loggedInUser}
            />
            <ProjectBoard 
                projectId={projectId} 
                loggedInUser={loggedInUser}
                projectMembers={projectMembers}
            />
        </div>
    )
}