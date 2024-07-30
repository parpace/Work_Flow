import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function UserHome () {
    const loggedInUser = localStorage.getItem('loggedInUser')
    const [ownedProjects, setOwnedProjects] = useState([])
    const [collaboratorProjects, setCollaboratorProjects] = useState([])
    const [invitations, setInvitations] = useState([])
    const [formState, setFormState] = useState({projectName: '', backgroundImg: ''})
    const [showCreateNew, setShowCreateNew] = useState(false)
    const [showInviteNotification, setShowInviteNotification] = useState(false)
    const [showInvites, setShowInvites] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const getUserData = async (userId) => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${userId}/`)
                console.log(response.data)
                const data = response.data
                setOwnedProjects(data.owned_projects)
                setCollaboratorProjects(data.collaborating_projects)

                const invitationsResponse = await axios.get(`http://127.0.0.1:8000/user-invitations/?user_id=${userId}`)
                const receivedInvitations = invitationsResponse.data
                console.log (receivedInvitations)
                console.log (receivedInvitations)
                if (receivedInvitations.length > 0) {
                    setInvitations(receivedInvitations)
                    setShowInviteNotification(true)
                }
            } catch (error) {
                console.error('Error fetching projects or invitations:', error)
            }
        }
        getUserData(loggedInUser)
    }, [loggedInUser])

    const toggleCreateNewProject = () => {
        setShowCreateNew(!showCreateNew)
    }

    const toggleShowInvites = () => {
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
        setFormState({
            ...formState,
            [e.target.name] : e.target.value
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
            window.location.reload()
        } catch (error) {
            console.error('Error handling invitation:', error)
        }
    }
    
    return (
        <div className="userHome">
            <button onClick={toggleCreateNewProject}>Create New Project</button>
            {showCreateNew && (
                <div className="modal" onClick={toggleCreateNewProject}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <form className="newProjectForm" onSubmit={handleSubmitNewProject}>
                            <div className="newProjectName">
                                <input type="text" name="projectName" placeholder="Name Your Project" onChange={handleChange} value={formState.projectName} />
                            </div>
                            <div className="newProjectBackground">
                                <input type="text" name="backgroundImg" placeholder="Enter a url" onChange={handleChange} value={formState.backgroundImg} />
                            </div>
                            <div className="submitProjectContainer">
                                <button className="submitNewProjectBtn" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showInviteNotification && (
                <button className="invitationsButton" onClick={toggleShowInvites}>Invitations</button>
            )}
            {showInvites && (
                <div className="invitationsList">
                    {invitations.map(invitation => (
                        <div className="invitation" key={invitation.id}>
                            <button onClick={() => handleInvitations(invitation.id, 'accept')}>Accept</button>
                            <button onClick={() => handleInvitations(invitation.id, 'decline')}>Decline</button>
                            <h2>{invitation.sender_username} invited you to collaborate on {invitation.project_name}</h2>
                        </div>
                    ))}
                </div>
            )}
            <div className="ownedBoardsContainer">
                <h2 className="ownedBoardsTitle">Owned Boards</h2>
                <div className="ownedBoards">
                    {ownedProjects.map(project => (
                        <div className="ownedBoardDiv" key={project.id} onClick={() => navigate(`/project/${project.id}`)}>{project.project_name}</div>
                    ))}
                </div>
            </div>
            <div className="guestBoardsContainer">
                <h2 className="guestBoardsTitle">Guest Boards</h2>
                <div className="guestBoards">
                    {collaboratorProjects.map(project => (
                        <div className="guestBoardDiv" key={project.id} onClick={() => navigate(`/project/${project.id}`)}>{project.project_name}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}