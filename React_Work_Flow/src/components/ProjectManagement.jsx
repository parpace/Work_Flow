import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ProjectManagement (props) {
    const { loggedInUser, userProjects, currentProject, projectMembers } = props
    // const [userProjects, setUserProjects] = useState([])
    // const [currentProject, setCurrentProject] = useState({})
    // const [projectMembers, setProjectMembers] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const navigate = useNavigate
    
    // useEffect(() => {
    //     const getUserData = async (userId) => {
    //         try {
    //             const response = await axios.get(`http://127.0.0.1:8000/users/${userId}/`)
    //             // console.log(response.data)
    //             const { owned_projects, collaborating_projects } = response.data
    //             const combinedProjects = [...owned_projects, ...collaborating_projects]
    //             setUserProjects(combinedProjects)
    //         } catch (error) {
    //             console.error('Error fetching projects or invitations:', error)
    //         }
    //     }
    //     getUserData(loggedInUser)

    //     const getProjectData = async () =>  {
    //         try {
    //             const response = await axios.get(`http://127.0.0.1:8000/projects/${projectId}/`)
    //             console.log(response.data)
    //             setCurrentProject(response.data)

    //             const collaborators = response.data.collaborators;
    //             const ownerId = response.data.owner;
    //             const memberIds = [...collaborators.map(collab => collab.user), ownerId];

    //             const memberResponses = await Promise.all(memberIds.map(id => 
    //                 axios.get(`http://127.0.0.1:8000/users/${id}/`)
    //             ))

    //             const members = memberResponses.map((res, index) => {
    //                 const userData = res.data
    //                 return {
    //                     data: userData,
    //                     status: memberIds[index] === ownerId ? 'owner' : 'collaborator'
    //                 }
    //             })
    //             setProjectMembers(members)
                
    //         } catch (error) {
    //             console.log('Error fetching current project data', error)
    //         }
    //     }
    //     getProjectData()
    // }, [loggedInUser, projectId])

    const toggleShowMembers = async () => {
        setShowMembers(!showMembers)
    }
    
    return (
        <div className="projectManagement">
            <h3 className="projectName">{currentProject.project_name}</h3>
            <div className="projectSettings">
                <div>Board Settings ^</div>
                <div onClick={toggleShowMembers}>Members {showMembers ? '-' : '+'}</div>
            </div>
            {showMembers && (
                <div className="membersList">
                    {projectMembers.map((member) => (
                        <div key={member.data.id}>
                            <h4>{member.data.user_name}</h4>
                            {member.status === 'owner' && (
                                <p>Owner</p>
                            )}
                            <img src={member.data.user_img}/>
                        </div>
                    ))}
                    {currentProject.owner === loggedInUser && (
                        <div>
                            <h4>+ Add a member</h4>
                        </div>
                    )}
                </div>
            )}
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