import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function ProjectManagement (props) {
    const { loggedInUser, userProjects, currentProject, projectMembers } = props
    const [showMembers, setShowMembers] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)
    const [formState, setFormState] = useState({})
    const navigate = useNavigate()

    const toggleShowMembers = async () => setShowMembers(!showMembers)
    const toggleShowAddMember = () => setShowAddMember(!showAddMember)

    const handleSubmitNewInvite = async (e) => {
        e.preventDefault()
        try {
            const usersResponse = await axios.get('http://127.0.0.1:8000/users/')
            const users = usersResponse.data
            const userToInvite = users.find(user => user.user_name === formState.userName)

            if (userToInvite) {
                const invitationResponse = await axios.post('http://127.0.0.1:8000/invitations/', {
                    sender: loggedInUser,
                    receiver: userToInvite.id,
                    project: currentProject.id
                })
                if (invitationResponse.status === 201) {
                    alert('Invitation sent successfully!')
                    setFormState({ userName: '' })
                    setShowAddMember(false)
                }
            } else {
                alert('Username does not exist.')
            }
        } catch (error) {
            console.error('Error creating new project:', error)
        }
    }

    const handleChange = (e) => setFormState({ ...formState, [e.target.name] : e.target.value })
    
    return (
        <div className="projectManagement">
            <h3 className="projectName">{currentProject.project_name}</h3>
            <div className="projectSettings">
                <div className="showProjectSettings">
                    <p>Board Settings</p>
                    <p>+</p>
                </div>
                <div onClick={toggleShowMembers} className="showMembersDiv">
                    <p>Members</p>
                    <p>+</p>
                </div>
            </div>
            {showMembers && (
                <div className="membersList">
                    {currentProject.owner === parseInt(loggedInUser, 10) && (
                        <>
                            <button className="addMember" onClick={toggleShowAddMember}>+ Add a member</button>
                            {showAddMember && (
                                <div className="modal" onClick={toggleShowAddMember}>
                                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                                        <form className="sendInviteForm" onSubmit={handleSubmitNewInvite}>
                                            <div className="addMemberInput">
                                                <input type="text" name="userName" placeholder="Enter a username" onChange={handleChange} value={formState.userName || ''} />
                                            </div>
                                            <button type="submit">Send Invite</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {projectMembers.map((member) => (
                        <div className="member" key={member.data.id}>
                            <h4>{member.data.user_name}</h4>
                            <div>
                                {member.status === 'owner' && <p>Owner</p> }
                                <img className="userImg" src={member.data.user_img}/>
                            </div>
                        </div>
                    ))}
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