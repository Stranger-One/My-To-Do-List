import { useEffect, useRef, useState } from 'react'
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import gsap from 'gsap/gsap-core';
import { useGSAP } from "@gsap/react";
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';



function App() {
  const [taskList, setTaskList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isChecked, setIsChecked] = useState()
  const [saveOrAdd, setsaveOrAdd] = useState("Add")
  const [curId, setCurId] = useState("")

  const popRef = useRef()
  const textRef = useRef()
  const emptyRef = useRef()

  const { contextSafe } = useGSAP();
  const openPop = contextSafe(() => {
    gsap.to(popRef.current, { visibility: 'visible', opacity: 1, duration: 0.2 });
    setTimeout(() => {
      textRef.current.focus();
    }, 500);
  });
  const closePop = contextSafe(() => {
    gsap.to(popRef.current, { visibility: 'hidden', opacity: 0, duration: 0.1 });

  });

  


  const handleAdd = (id) => {
    setsaveOrAdd("Add")
    if (inputText === "") {
      toast.error('Plese enter your task', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });

      return;
    }
    if (saveOrAdd === "Save") {
      let ind = taskList.findIndex(item => item.id === curId)
      taskList[ind].inputText = inputText;
      closePop()
      setInputText("")
      toast.error('Update Succesfully', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    setTaskList([...taskList, {
      id: uuidv4(),
      inputText,
      dateTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
      isChecked,
    }])
    setInputText("")
    closePop();

    toast.error('Add Succesfully', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }

  const handleCheck = (e, id) => {
    const updatedTaskList = taskList.map((task) => {
      if (task.id === id) {
        return { ...task, isChecked: !task.isChecked };
      } else {
        return task;
      }
    });
    setTaskList(updatedTaskList);
  };

  const handleDelete = (e, id) => {
    setTaskList(taskList.filter(item => item.id !== id))
    toast.error('Delete Succesfully', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }

  const handleEdit = (e, id) => {
    setCurId(id)
    setsaveOrAdd("Save")
    openPop()
    let ind = taskList.findIndex(item => item.id === id)
    console.log(id)
    console.log(ind)
    console.log(taskList[ind].inputText)
    setInputText(taskList[ind].inputText)
    let val = textRef.current.value.length

    setTimeout(() => {
      // textRef.current.select()
      textRef.current.setSelectionRange(val, val)
    },500)
  }

  useEffect(()=>{
    if(taskList.length == 0){
      emptyRef.current.style.display = "flex"
    }
    else{
      emptyRef.current.style.display = "none"
    }
  },[taskList] )

  return (
    <>
      <div>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </div>

      <section className='w-full h-screen flex flex-col justify-between bg-cover ' style={{ backgroundImage: 'url(src/images/Default_simple_to_do_list_app_design_for_mobile_and_pc_3.jpg)' }}>
        <nav className='w-full h-14 flex items-center justify-center border-b-1 border-slate-300'>
          <h1 className='oswald capitalize text-xl tracking-wide underline'>write your tasks here</h1>
        </nav>
        <main className='w-full h-full px-2 pt-20  relative ' >
          <div className="part-1 w-full h-full">
            <h2 className='work-sans text-xl capitalize mb-2 font-semibold'>your task list</h2>
            
            <div className="task-container w-full flex flex-col gap-2 pt-4  min-h-64 border-t-[2px] border-black ">
              <div ref={emptyRef} className="empty hidden w-full h-64 items-center justify-center">
                <h1 className='text-xl'>Your Task list is empty</h1>

              </div>
              {taskList.map((item, index) => {
                return (
                  <div key={index} id={item.id} className="task w-full h-20 bg-slate-500/20 rounded-xl flex p-2 backdrop-blur-sm border-[1px] border-gray-500">
                    <div className="content w-full flex flex-col justify-between">
                      <p className={`whatToDo w-full leading-7 text-xl text-ellipsis overflow-hidden line-clamp-1 ${item.isChecked ? 'line-through' : ''}`}>{item.inputText}</p>
                      <h3 className='date text-black text-md'>{item.dateTime}</h3>
                    </div>
                    <div className="btns w-48 flex items-center gap-2 ">
                      <input type="checkbox" className='w-8 h-8 cursor-pointer rounded-md' checked={item.isChecked} onChange={(e) => { handleCheck(e, item.id) }} />

                      <button onClick={(e) => { handleEdit(e, item.id) }} className='p-1 border-[1px] border-black flex items-center justify-center rounded-md cursor-pointer'>
                        <MdEdit size={22} color='black' className='pointer-events-none' />
                      </button>

                      <button onClick={(e) => { handleDelete(e, item.id) }} className='p-1 border-[1px] border-black flex items-center justify-center rounded-md cursor-pointer'>
                        <MdDelete size={22} color='black' className='pointer-events-none' />
                      </button>
                    </div>
                  </div>
                )
              })}

            </div>

            <button onClick={openPop} className="add border-[2px] border-black rounded-md fixed bottom-8 right-6 cursor-pointer">
              <IoMdAdd size={40} />
            </button>
          </div>

          <div ref={popRef} className="part-2 add-popup invisible opacity-0 absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[90%] bg-gray-500/80 backdrop-blur-sm rounded-md flex flex-col items-center justify-between gap-4 p-4 ">
            <h1 className='text-xl font-semibold capitalize'>Add your tasks</h1>

            <textarea ref={textRef} onChange={(e) => setInputText(e.target.value)} value={inputText} name="task" required rows="3" className='textarea border-black border-[1px] w-full  bg-transparent text-lg focus:outline-none resize-none'></textarea>

            <div className='w-full flex gap-2 mt-10'>
              <button onClick={closePop} className='capitalize flex-1 border-black border-2 py-2 rounded-md text-xl'>cancel</button>
              <button onClick={handleAdd} className='capitalize flex-1 border-black border-2 py-2 rounded-md text-xl'>{saveOrAdd}</button>
            </div>
          </div>

        </main>

      </section>
    </>
  )
}

export default App
