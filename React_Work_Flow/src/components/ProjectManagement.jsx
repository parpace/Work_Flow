import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ProjectManagement (props) {
    const { loggedInUser, userProjects, currentProject, projectMembers } = props
    const [showMembers, setShowMembers] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)
    const navigate = useNavigate()

    const toggleShowMembers = async () => {
        setShowMembers(!showMembers)
    }

    const toggleShowAddMember = () => setShowAddMember(!showAddMember)
    
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
                    {projectMembers.map((member) => (
                        <div className="member" key={member.data.id}>
                            <h4>{member.data.user_name}</h4>
                            <div>
                                {member.status === 'owner' && <p>Owner</p> }
                                <img className="userImg" src={member.data.user_img}/>
                            </div>
                        </div>
                    ))}
                    {currentProject.owner === parseInt(loggedInUser, 10) && (
                        <div className="addMember" onClick={toggleShowAddMember}>+ Add a member</div>
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