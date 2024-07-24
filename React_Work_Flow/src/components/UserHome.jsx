import axios from "axios"
import { useEffect, useState } from "react"

export default function UserHome () {
    const loggedInUser = localStorage.getItem('loggedInUser')
    const [ownedProjects, setOwnedProjects] = useState([])
    const [collaboratorProjects, setCollaboratorProjects] = useState([])
    const [formState, setFormState] = useState({projectName: '', backgroundImg: '', collaborators: []})
    const [showCreateNew, setShowCreateNew] = useState(false)
    const [showInvite, setShowInvite] = useState(false)

    useEffect(() => {
        const getAllProjects = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${loggedInUser}/`)
                console.log(response.data)
                const data = response.data
                setOwnedProjects(data.owned_projects)
                setCollaboratorProjects(data.collaborating_projects)
            } catch (error) {
                console.error('Error fetching owned projects:', error)
            }
        }
        getAllProjects()
    }, [loggedInUser])

    const toggleCreateNewProject = async () => {
        setShowCreateNew(!showCreateNew)
    }

    const toggleShowInvite = async () => {
        setShowInvite(!showInvite)
    }

    const handleSubmitNewProject = async () => {

    }
    
    return (
        <div>
            <h1>User Home Page</h1>
            <button onClick={toggleCreateNewProject}>Create New Project</button>
            {showCreateNew && (
                <form className="newProjectForm" onSubmit={handleSubmitNewProject}>
                    <div className="newProjectName">
                        <input type="text" id="newProjectName" placeholder="Name Your Project" onChange={handleChange} value={formState.username} />
                    </div>

                    <div className="passwordLogin">
                        <input type="password" id="password" placeholder="Enter your password" onChange={handleChange} value={formState.password} />
                    </div>

                    <div className="submitBtnContainer">
                        <button className="submitBtn" type="submit">Log in</button>
                    </div>
                </form>
            )}
            <button onClick={toggleShowInvite}>Invite Collaborators</button>
            <h2>My Projects</h2>
            <ul>
                {ownedProjects.map(project => (
                    <li key={project.id}>{project.project_name}</li>
                ))}
            </ul>
            <h2>Collaborating</h2>
            <ul>
                {collaboratorProjects.map(project => (
                    <li key={project.id}>{project.project_name}</li>
                ))}
            </ul>
        </div>
    )
}