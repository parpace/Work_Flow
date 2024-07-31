import { useEffect, useState } from "react"
import axios from "axios"

export default function ProjectBoard (props) {
    const { projectId, projectMembers } = props
    const [lists, setLists] = useState([])
    const [tasksByList, setTasksByList] = useState({})
    const [checklistItemsByTask, setChecklistItemsByTask] = useState({})
    const [listFormState, setListFormState] = useState({ listName: '' })
    const [taskFormStates, setTaskFormStates] = useState({ taskName: '', assignedUsers: [] })
    const [itemFormState, setItemFormState] = useState({ itemName: '' })
    const [showCreateList, setShowCreateList] = useState(false)
    const [currentListId, setCurrentListId] = useState(null)
    const [showTaskDetails, setShowTaskDetails] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [showCreateItem, setShowCreateItem] = useState(false)
    const [editListId, setEditListId] = useState(null)
    const [editListName, setEditListName] = useState('')

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
                // console.log('tasks by list:', tasksByList)

                const checklistItems = await Promise.all(Object.values(tasksByList).flat().map(async (task) => {
                    const checklistResponse = await axios.get(`http://127.0.0.1:8000/tasks/${task.id}/checklist-items/`)
                    return { taskId: task.id, checklistItems: checklistResponse.data }
                }))

                const checklistItemsByTask = checklistItems.reduce((acc, { taskId, checklistItems }) => {
                    acc[taskId] = checklistItems
                    return acc
                }, {})
                // console.log('checklist items by task:', checklistItemsByTask)

                setLists(projectData.lists)
                setTasksByList(tasksByList)
                setChecklistItemsByTask(checklistItemsByTask)
            } catch (error) {
                console.error('Error fetching project data:', error)
            }
        }
        getListsAndTasks()
    }, [projectId])

    const toggleCreateList = () => setShowCreateList(!showCreateList)
    const toggleCreateTask = (listId) => setCurrentListId(listId === currentListId ? null : listId)
    const toggleCreateItem = () => setShowCreateItem(!showCreateItem)
    const toggleChecklistItem = async (taskId, itemId, currentStatus) => {
        try {
            const newStatus = !currentStatus
            await axios.patch(`http://127.0.0.1:8000/checklist-items/${itemId}/`, { status: newStatus })
            
            setChecklistItemsByTask(prevChecklistItems => ({
                ...prevChecklistItems,
                [taskId]: prevChecklistItems[taskId].map(item =>
                    item.id === itemId ? { ...item, status: newStatus } : item
                )
            }))
        } catch (error) {
            console.error('Error updating checklist item status:', error)
        }
    }
    const toggleTaskDetails = (task) => {
        setSelectedTask(task)
        setShowTaskDetails(!showTaskDetails)
    }


    const handleListChange = (e) => setListFormState({ ...listFormState, [e.target.name] : e.target.value })
    const handleListNameChange = (e) => setEditListName(e.target.value)
    const handleTaskChange = (e, listId) => {
        const listTaskState = taskFormStates[listId] || { taskName: '', description: '', assignedUsers: [] }
        setTaskFormStates({
            ...taskFormStates,
            [listId]: { ...listTaskState, [e.target.name]: e.target.value }
        })
    }
    const handleItemChange = (e) => setItemFormState({ ...itemFormState, [e.target.name] : e.target.value })


    const handleSubmitNewList = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://127.0.0.1:8000/lists/', {
                project_id: projectId,
                list_name: listFormState.listName
            })
            setLists([...lists, response.data])
            setListFormState({listName: ''})
            setShowCreateList(false)
        } catch (error) {
            console.error('Error creating new list:', error)
        }
    }
    const handleSubmitNewTask = async (e, listId) => {
        e.preventDefault()
        try {
            // console.log({
            //     list_id: listId,
            //     task_name: taskFormState.taskName,
            //     assigned_users: taskFormState.assignedUsers
            // })
            const taskFormState = taskFormStates[listId] || {}
            const assignedUserIds = taskFormState.assignedUsers.map(userId => parseInt(userId, 10))
            const response = await axios.post('http://127.0.0.1:8000/tasks/', {
                list_id: listId,
                task_name: taskFormState.taskName,
                description: taskFormState.description,
                assigned_users: assignedUserIds
            })
            setTasksByList({
                ...tasksByList,
                [listId]: [...(tasksByList[listId] || []), response.data]
            })
            setTaskFormStates({ taskName: '', assignedUsers: [] })
            setCurrentListId(null)
        } catch (error) {
            console.error('Error creating new task:', error)
        }
    }
    const createNewChecklistItem = async (e, taskId) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://127.0.0.1:8000/checklist-items/', {
                task_id: taskId,
                item_name: itemFormState.itemName,
                status: false
            })
            const newChecklistItem = response.data
            
            setChecklistItemsByTask(prevChecklistItems => ({
                ...prevChecklistItems,
                [taskId]: [...(prevChecklistItems[taskId] || []), newChecklistItem]
            }))
            
            setItemFormState({ itemName: '' })
            setShowCreateItem(false)
        } catch (error) {
            console.error('Error creating checklist item:', error)
        }
    }


    const deleteList = async (listId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/lists/${listId}/`)
            setLists(prevLists => prevLists.filter(list => list.id !== listId))
        } catch (error) {
            console.error('Error deleting list:', error)
        }
    }
    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/tasks/${taskId}/`)
            setTasksByList(prevTasksByList => {
                const updatedTasksByList = { ...prevTasksByList }
                
                for (const listId in updatedTasksByList) {
                    updatedTasksByList[listId] = updatedTasksByList[listId].filter(task => task.id !== taskId)
                }
                
                return updatedTasksByList
            })
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }
    const deleteChecklistItem = async (taskId, itemId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/checklist-items/${itemId}/`)
            
            setChecklistItemsByTask(prevChecklistItems => ({
                ...prevChecklistItems,
                [taskId]: prevChecklistItems[taskId].filter(item => item.id !== itemId)
            }))
        } catch (error) {
            console.error('Error deleting checklist item:', error)
        }
    }

    const startEditingList = (listId, listName) => {
        setEditListId(listId)
        setEditListName(listName)
    }
    const stopEditingList = async (listId) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/lists/${listId}/`, { list_name: editListName })
            setLists(prevLists => prevLists.map(list => 
                list.id === listId ? { ...list, list_name: editListName } : list
            ))
            setEditListId(null)
            setEditListName('')
        } catch (error) {
            console.error('Error updating list name:', error)
        }
    }

    const userMap = new Map(projectMembers.map(member => [member.data.id, member.data]))


    return (
        <div className="projectBoard">
            {lists.length > 0 ? (
                <div className="lists">
                    {lists.map(list => (
                        <div className="list" key={list.id}>
                            {editListId === list.id ? (
                                <div className="listEditing">
                                    <input
                                        type="text"
                                        value={editListName}
                                        onChange={handleListNameChange}
                                        onBlur={() => stopEditingList(list.id)}
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <h3 onClick={() => startEditingList(list.id, list.list_name)}>
                                    {list.list_name}
                                </h3>
                            )}
                            {tasksByList[list.id] && (
                                <div className="tasks">
                                    {tasksByList[list.id].map(task => (
                                        <div className="task" key={task.id} onClick={() => toggleTaskDetails(task)}>
                                            <div className="taskNameAndUsers">
                                                <h4>{task.task_name}</h4>
                                                <div className="assignedUsers">
                                                    {task.assigned_users.map(userId => {
                                                        const user = userMap.get(userId)
                                                        return user ? (
                                                            <div key={userId} className="assignedUser">
                                                                <img src={user.user_img} alt={user.user_name} className="userImg" />
                                                                <p className="hiddenUserName">{user.user_name}</p>
                                                            </div>
                                                        ) : null
                                                    })}
                                                </div>
                                            </div>
                                            {checklistItemsByTask[task.id] && (
                                                <div className="checklistItems">
                                                    {checklistItemsByTask[task.id].map(item => (
                                                        <div className="checklistItem" key={item.id}>
                                                            <div>{item.item_name}</div>
                                                            <div className="checklistItemIcons">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.status}
                                                                    onChange={() => toggleChecklistItem(task.id, item.id, item.status)}
                                                                />
                                                                <span
                                                                    className="deleteIcon"
                                                                    onClick={() => deleteChecklistItem(task.id, item.id)}
                                                                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                                                                >
                                                                    🗑️
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <button className="deleteTask" onClick={() => deleteTask(task.id)}>Delete Task</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="addDeleteTasks">
                                <div className="addTask">
                                    <button onClick={() => toggleCreateTask(list.id)}>+ Add a task</button>
                                    {currentListId === list.id && (
                                        <div className="modal" onClick={() => toggleCreateTask(list.id)}>
                                            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                                                <form className="newTaskForm" onSubmit={(e) => handleSubmitNewTask(e, list.id)}>
                                                    <div className="newTaskName">
                                                        <p>Name:</p>
                                                        <input type="text" name="taskName" placeholder="Name your task" 
                                                            onChange={(e) => handleTaskChange(e, list.id)}
                                                            value={taskFormStates[list.id]?.taskName || ''} />
                                                    </div>
                                                    <div className="newTaskDescription">
                                                        <p>Description:</p>
                                                        <textarea name="description" placeholder="Task description" 
                                                            onChange={(e) => handleTaskChange(e, list.id)}
                                                            value={taskFormStates[list.id]?.description || ''} />
                                                    </div>
                                                    <div className="newTaskAssignedUsers">
                                                        <p>Assign to members:</p>
                                                        <select multiple name="assignedUsers"
                                                            onChange={(e) => {
                                                                const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value, 10))
                                                                setTaskFormStates({
                                                                    ...taskFormStates,
                                                                    [list.id]: { ...taskFormStates[list.id], assignedUsers: selectedOptions }
                                                                })
                                                            }}
                                                            value={taskFormStates[list.id]?.assignedUsers || []}
                                                        >
                                                            {projectMembers.map(member => (
                                                                <option key={member.data.id} value={member.data.id}>
                                                                    {member.data.user_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="submitTaskContainer">
                                                        <button className="submitNewTaskBtn" type="submit">Submit Task</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button className="deleteList" onClick={() => deleteList(list.id)}>Delete</button>
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
                    <h4 onClick={toggleCreateList}>+ Make a list</h4>
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
            )}
            {showTaskDetails && selectedTask && (
                <div className="modal" onClick={() => toggleTaskDetails(null)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <div className="taskDetailsHeader">
                            <h2>{selectedTask.task_name}</h2>
                            <button className="addChecklist" onClick={toggleCreateItem}>Add to-do</button>
                            {showCreateItem && (
                                <form className="newItemForm" onSubmit={(e) => createNewChecklistItem(e, selectedTask.id)}>
                                    <div className="newItemName">
                                        <input type="text" name="itemName" placeholder="description" onChange={handleItemChange} value={itemFormState.itemName} />
                                    </div>
                                    <div className="submitItemContainer">
                                        <button className="submitNewItemBtn" type="submit">Submit</button>
                                    </div>
                                </form>
                            )}
                        </div>
                        <div className="checklistItems">
                            {checklistItemsByTask[selectedTask.id].map(item => (
                                <div className="checklistItem" key={item.id}>
                                    <div>{item.item_name}</div>
                                    <div className="checklistItemIcons">
                                        <input
                                            type="checkbox"
                                            checked={item.status}
                                            onChange={() => toggleChecklistItem(selectedTask.id, item.id, item.status)}
                                        />
                                        <span
                                            className="deleteIcon"
                                            onClick={() => deleteChecklistItem(selectedTask.id, item.id)}
                                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                                        >
                                            🗑️
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="deleteTask" onClick={() => deleteTask(selectedTask.id)}>Delete Task</button>
                    </div>
                </div>
            )}
        </div>
    )
}