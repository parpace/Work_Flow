import { useEffect, useState } from "react"
import axios from "axios"

export default function ProjectBoard (props) {
    const { projectId, loggedInUser } = props
    const [lists, setLists] = useState([])
    const [tasksByList, setTasksByList] = useState({})
    const [checklistItemsByTask, setChecklistItemsByTask] = useState({})

    useEffect(() => {
        const getListsAndTasks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/projects/${projectId}/`)
                const projectData = response.data
                
                const tasks = projectData.lists.map(async (list) => {
                    const tasksResponse = await axios.get(`http://127.0.0.1:8000/lists/${list.id}/tasks/`)
                    return { listId: list.id, tasks: tasksResponse.data }
                })

                const tasksResults = await Promise.all(tasks)
                const tasksByList = tasksResults.reduce((acc, { listId, tasks }) => {
                    acc[listId] = tasks
                    return acc
                }, {})

                const checklistItems = Object.values(tasksByList).flat().map(async (task) => {
                    const checklistResponse = await axios.get(`http://127.0.0.1:8000/tasks/${task.id}/checklist-items/`)
                    return { taskId: task.id, checklistItems: checklistResponse.data }
                })

                const checklistItemsResults = await Promise.all(checklistItems)
                const checklistItemsByTask = checklistItemsResults.reduce((acc, { taskId, checklistItems }) => {
                    acc[taskId] = checklistItems
                    return acc
                }, {})

                setLists(projectData.lists)
                setTasksByList(tasksByList)
                setChecklistItemsByTask(checklistItemsByTask)
            } catch (error) {
                console.error('Error fetching project data:', error)
            }
        }
        getListsAndTasks()
    }, [projectId])

    return (
        <div className="projectBoard">
            {lists && (
                <div className="lists">
                    {lists.map(list => (
                        <div key={list.id}>
                            <h3>{list.list_name}</h3>
                            {tasksByList[list.id] && (
                                <div className="tasks">
                                    {tasksByList[list.id].map(task => (
                                        <div key={task.id}>
                                            <h4>{task.task_name}</h4>
                                            {checklistItemsByTask[task.id] && (
                                                <div className="checklistItems">
                                                    {checklistItemsByTask[task.id].map(item => (
                                                        <div key={item.id}>{item.item_name}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div>
                <h4>+ Add another list</h4>
            </div>
        </div>
    )
}