import ProjectManagement from './ProjectManagement'
import ProjectBoard from './ProjectBoard'

export default function ProjectPage () {
    return (
        <div className='projectPage'>
            <ProjectManagement />
            <ProjectBoard />
        </div>
    )
}