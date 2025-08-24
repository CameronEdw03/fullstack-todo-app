import React, { useState, useEffect } from 'react';
import { IoAddOutline } from "react-icons/io5";

function Todo() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString(undefined, options);

    const [popup, setPopup] = useState(false);
    const handlePopup = () => setPopup(!popup);

    const API_URL = "http://127.0.0.1:8000/tasks";

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    // Fetch tasks
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Fetch tasks error:", err));
    }, []);

    // Save task
    const handleSaveTask = () => {
        if (!newTask.trim()) return;

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTask })
        })
        .then(res => res.json())
        .then(savedTask => {
            setTasks([...tasks, savedTask]);
            setNewTask('');
            setPopup(false);
        })
        .catch(err => console.error("Save task error:", err));
    };

    // Delete task
    const handleDeleteTask = (id) => {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => setTasks(tasks.filter(task => task.id !== id)))
            .catch(err => console.error("Delete task error:", err));
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='bg-white w-[500px] h-[700px] shadow-lg rounded-lg flex flex-col justify-start items-center'>
                <h1 className='text-black text-[30px] font-bold mt-20'>Today's Task</h1>
                <h2 className='text-stone-400 font-semibold'>{formattedDate}</h2>

                <button
                    className='w-[120px] h-[40px] bg-green-300/50 rounded-lg text-green-800 font-semibold border border-green-400 
                               flex items-center justify-center gap-2 mt-4 cursor-pointer hover:scale-105 transition-all duration-300'
                    onClick={handlePopup}
                >
                    <IoAddOutline size={24} />Add Task
                </button>

                {popup && (
                    <div className='fixed mt-30 '>
                    <div className='w-[400px] h-[400px] bg-stone-100 rounded-lg flex flex-col items-center shadow-lg mt-20 relative p-6 overflow-auto'>
                        <button
                            className='w-[90px] h-[40px] bg-green-800 rounded-lg text-white font-semibold absolute top-4 right-4 
                                       flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300'
                            onClick={handlePopup}
                        >
                            Close
                        </button>

                        <h1 className='text-black font-bold text-[20px] mb-4 self-start'>Add New Task</h1>

                        <input
                            type='text'
                            placeholder='Task Title'
                            className='w-[300px] h-[40px] border-2 border-stone-300 rounded-lg pl-3 text-black 
                                       focus:outline-none focus:border-green-400 mb-4'
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />

                        <button
                            className='w-[100px] h-[38px] border border-green-400 text-green-800 flex items-center justify-center 
                                       rounded-lg bg-green-300/50 hover:scale-105 transition-all duration-300 cursor-pointer mt-30'
                            onClick={handleSaveTask}
                        >
                            Save Task
                        </button>

                      
                    </div>
                    </div>
                )}
                  <div className='w-full'>
                    <h1 className='text-black mt-10 ml-5 text-[20px] font-semibold text-stone-400 '>Your Todo List</h1>
                            {tasks.map(task => (
                                <div key={task.id} className='flex justify-between items-center p-2 mb-2 '>
                                    <span className='text-black text-[18px] ml-3 '>{task.title}</span>
                                    <button
                                        className='text-green-300 font-bold transition-all duration-300 hover:scale-105 hover:text-green-800 cursor-pointer'
                                        onClick={() => handleDeleteTask(task.id)}
                                    >
                                        Mark Completed
                                    </button>
                                </div>
                            ))}
                        </div>
            </div>
        </div>
    );
}

export default Todo;
