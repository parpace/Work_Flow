import { useEffect, useState } from "react"
import axios from "axios"

export default function ProjectBoard (props) {
    const { projectId, loggedInUser } = props
    const [lists, setLists] = useState([])
    const [tasksByList, setTasksByList] = useState({})
    const [checklistItemsByTask, setChecklistItemsByTask] = useState({})
    const [listFormState, setListFormState] = useState({listName: ''})
    const [showCreateList, setShowCreateList] = useState(false)

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

    const toggleCreateList = () => {
        setShowCreateList(!showCreateList)
    }

    const handleListChange = (e) => {
        setListFormState({
            ...listFormState,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmitNewList = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://127.0.0.1:8000/lists/', {
                project_id: projectId,
                list_name: listFormState.listName
            })
            setLists([...lists, response.data])
            setListFormState({projectName: '', backgroundImg: ''})
            setShowCreateList(false)
        } catch (error) {
            console.error('Error creating new list:', error)
        }
    }

    return (
        <div className="projectBoard">
            {lists ? (
                <div className="lists">
                    {lists.map(list => (
                        <div className="list" key={list.id}>
                            <h3>{list.list_name}</h3>
                            {tasksByList[list.id] && (
                                <div className="tasks">
                                    {tasksByList[list.id].map(task => (
                                        <div className="task" key={task.id}>
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
                            <div>
                                <h4 className="add-task">+ Add a task</h4>
                            </div>
                        </div>
                    ))}
                    <div className="add-list">
                        <h4 onClick={toggleCreateList}>+ Add another list</h4>
                        {showCreateList && (
                            <form className="newListForm" onSubmit={handleSubmitNewList}>
                                <div className="newListName">
                                    <input type="text" name="listName" placeholder="Name your list" onChange={handleListChange} value={listFormState.listName} />
                                </div>
                                <div className="submitListContainer">
                                    <button className="submitNewListBtn" type="submit">Add list</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            ) : (
                <div className="add-list">
                    <h4>+ Make a list</h4>
                </div>
            )}
        </div>
    )
}