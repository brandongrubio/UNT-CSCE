import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { BsCheckSquareFill, BsPen, BsTrash } from "react-icons/bs"; // Import Bootstrap icons

function TaskList({ user, onEditTask }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) return;
    // Updated Firestore path to the new structure
    const userTasksCollection = collection(db, "users", user.uid, "tasks");
    const unsubscribe = onSnapshot(userTasksCollection, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const toggleTaskCompletion = async (id, completed) => {
    // Updated Firestore path to the new structure
    const taskDoc = doc(db, "users", user.uid, "tasks", id);
    await updateDoc(taskDoc, { completed: !completed });
  };

  const deleteTask = async (id) => {
    // Updated Firestore path to the new structure
    const taskDoc = doc(db, "users", user.uid, "tasks", id);
    await deleteDoc(taskDoc);
  };

  const getStatus = (dueDate, completed) => {
    const today = new Date().toISOString().split("T")[0];
    if (completed) return { text: "Completed", color: "text-success" };
    if (dueDate < today) return { text: "Past Due", color: "text-danger" };
    if (dueDate === today) return { text: "Due", color: "text-success" };
    return { text: "Upcoming", color: "text-warning" };
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return { text: "High", color: "text-danger" }; // Red
      case "Normal":
        return { text: "Normal", color: "text-success" }; // Green
      case "Low":
        return { text: "Low", color: "text-warning" }; // Yellow
      default:
        return { text: "None", color: "text-muted" }; // Default muted color
    }
  };

  return (
    <Table striped bordered hover responsive className="mt-4">
      <thead>
        <tr>
          <th>Task</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Category</th>
          <th>Status</th>
          <th>Tools</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => {
          const { text: statusText, color: statusColor } = getStatus(task.dueDate, task.completed);
          const { text: priorityText, color: priorityColor } = getPriorityStyle(task.priority);

          return (
            <tr key={task.id}>
              {/* Task Name */}
              <td>
                <strong>{task.title}</strong>
                <br />
                <small className="text-muted">{task.description || "No Description"}</small>
              </td>

              {/* Due Date */}
              <td>
                {task.dueDate || <em>No due date</em>}
                {task.dueTime && (
                  <>
                    <br />
                    <small className="text-muted">at {task.dueTime}</small>
                  </>
                )}
              </td>

              {/* Priority */}
              <td className={priorityColor}>{priorityText}</td>

              {/* Category */}
              <td>{task.category || <em>Uncategorized</em>}</td>

              {/* Status */}
              <td className={statusColor}>{statusText}</td>

              {/* Tools */}
              <td className="text-center">
                <BsCheckSquareFill
                  className="me-3 text-success cursor-pointer"
                  size={20}
                  title="Mark as Complete"
                  onClick={() => toggleTaskCompletion(task.id, task.completed)}
                />
                <BsPen
                  className="me-3 text-primary cursor-pointer"
                  size={20}
                  title="Edit Task"
                  onClick={() => onEditTask(task)}
                />
                <BsTrash
                  className="text-danger cursor-pointer"
                  size={20}
                  title="Delete Task"
                  onClick={() => deleteTask(task.id)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default TaskList;