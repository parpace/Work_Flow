import ProjectManagement from './ProjectManagement'
import ProjectBoard from './ProjectBoard'
import { useParams } from 'react-router-dom'

export default function ProjectPage () {
    const loggedInUser = localStorage.getItem('loggedInUser')
    const { projectId } = useParams()

    return (
        <div className='projectPage'>
            <ProjectManagement projectId={projectId} loggedInUser={loggedInUser}/>
            <ProjectBoard projectId={projectId} loggedInUser={loggedInUser}/>
        </div>
    )
}