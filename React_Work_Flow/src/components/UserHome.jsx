import axios from "axios"
import { useEffect, useState } from "react"

export default function UserHome () {
    const loggedInUser = localStorage.getItem('loggedInUser')
    const [ownedProjects, setOwnedProjects] = useState([])
    const [collaboratorProjects, setCollaboratorProjects] = useState([])
    const [invitations, setInvitations] = useState([])
    const [formState, setFormState] = useState({projectName: '', backgroundImg: ''})
    const [showCreateNew, setShowCreateNew] = useState(false)
    const [showInviteNotification, setShowInviteNotification] = useState(false)
    const [showInvites, setShowInvites] = useState(false)

    useEffect(() => {
        const getUserData = async (userId) => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${userId}/`)
                console.log(response.data)
                const data = response.data
                setOwnedProjects(data.owned_projects)
                setCollaboratorProjects(data.collaborating_projects)

                const invitationsResponse = await axios.get(`http://127.0.0.1:8000/invitations/`)
                const receivedInvitations = invitationsResponse.data.filter(invite => invite.receiver === userId)
                if (invitationsResponse.data.length > 0) {
                    setInvitations(receivedInvitations)
                    setShowInviteNotification(true)
                }
            } catch (error) {
                console.error('Error fetching projects or invitations:', error)
            }
        }
        getUserData(loggedInUser)
    }, [loggedInUser])

    const toggleCreateNewProject = async () => {
        setShowCreateNew(!showCreateNew)
    }

    const toggleShowInvites = async () => {
        setShowInvites(!showInvites)
    }

    const handleSubmitNewProject = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://127.0.0.1:8000/projects/', {
                project_name: formState.projectName,
                background_image: formState.backgroundImg,
                owner: loggedInUser
            })
            setOwnedProjects([...ownedProjects, response.data])
            setFormState({projectName: '', backgroundImg: ''})
            setShowCreateNew(false)
        } catch (error) {
            console.error('Error creating new project:', error)
        }
    }

    const handleChange = (e) => {
        setFormState({...formState,
        [e.target.id] : e.target.value,
        error:''
        })
    }

    const handleInvitations = async (invitationId, decision) => {
        try {
            if (decision === 'accept') {
                await axios.patch(`http://127.0.0.1:8000/invitations/${invitationId}/`, { status: 'accepted' })
                
                const response = await axios.get(`http://127.0.0.1:8000/users/${loggedInUser}/`)
                setCollaboratorProjects(response.data.collaborating_projects)
            } else {
                await axios.delete(`http://127.0.0.1:8000/invitations/${invitationId}/`)
            }

            setInvitations(invitations.filter(invite => invite.id !== invitationId))
        } catch (error) {
            console.error('Error handling invitation:', error)
        }
    }
    
    return (
        <div>
            <h1>User Home Page</h1>
            <button onClick={toggleCreateNewProject}>Create New Project</button>
            {showCreateNew && (
                <form className="newProjectForm" onSubmit={handleSubmitNewProject}>
                    <div className="newProjectName">
                        <input type="text" id="newProjectName" placeholder="Name Your Project" onChange={handleChange} value={formState.projectName} />
                    </div>

                    <div className="newProjectBackground">
                        <input type="text" id="newProjectBackground" placeholder="Enter a url" onChange={handleChange} value={formState.backgroundImg} />
                    </div>

                    <div className="submitBtnContainer">
                        <button className="submitNewProjectBtn" type="submit">Submit</button>
                    </div>
                </form>
            )}
            {showInviteNotification && (
                <button className="invitationsButton" onClick={toggleShowInvites}>Invitations</button>
            )}
            {showInvites && (
                <ul className="invitationsList">
                    {invitations.map(invitation => (
                        <li className="invitation" key={invitation.id}>
                            <button onClick={handleInvitations(invitation.id, 'accept')}>Accept</button>
                            <button onClick={handleInvitations(invitation.id, 'decline')}>Decline</button>
                            <h2>{invitation.sender.username} invited you to collaborate on {invitation.project.project_name}</h2>
                        </li>
                    ))}
                </ul>
            )}
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