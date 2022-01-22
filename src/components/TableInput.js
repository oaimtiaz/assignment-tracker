import React, { useEffect } from "react";
import { useState } from "react";
import FormInput from "./FormInput";
import apiData from "./ApiData";
import { useAuth0 } from "@auth0/auth0-react";



const TableInput = (props) => {

    const [action, setAction] = useState(0);
    const [validId, setValidId] = useState(true);

    const [state, setState] = useState({
        id: 0,
        course: "",
        assignment: "",
        dueDate: new Date(),
        priority: "",
        completed: false,
    })
    
    const { API_HOST } = apiData;
    const { getAccessTokenSilently } = useAuth0();

    const getToken = async () => {
        try {
          const accessToken = await getAccessTokenSilently({
            audience: API_HOST,
          });
          return accessToken;
        } catch (e) {
          console.log(e.message);
          return null
        }
    }

    const makeRequest = async (path, options) => {
        const token = await getToken();
        options['headers']['Authorization'] = `Bearer ${token}`;
        const res = fetch(`http://${API_HOST}/${path}` , options)
        return res;
    }


    const convertDate = (date) => {
        const offset = date.getTimezoneOffset()
        const yourDate = new Date(date.getTime() - (offset*60*1000))
        return yourDate.toISOString().split('T')[0]
    }

    const modifyAction = (a) => {
        if(a !== action) {
            setAction(a);
            resetState()
            if(a === EDIT) {
                const e = {target: {value: props.data[0]['id']}}
                changeId(e);
            }
        }
    }

    const resetState = () => {
        setState({
            id: 0,
            course: "",
            assignment: "",
            dueDate: convertDate(new Date()),
            priority: "",
            completed: false,
        })
    }

    useEffect(() => {
        resetState();
    }, []);


    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeNumeric = (e) => {
        setState({
            ...state,
            [e.target.name]: parseInt(e.target.value)
        })
        
    }

    const getAssignment = (id) => {
        const assignments = props.data;
        for(let key in assignments) {
            if(assignments[key]['id'] === id) {
                return assignments[key];
            }
        }
    }

    const changeId = (e) => {
        let id = parseInt(e.target.value);
        if(id < 0) {
            setState({
                ...state,
                id: 0
            })
            return
        }
        let assignment = getAssignment(id);
        if(assignment) {
            setValidId(true);
            setState({
                ...state,
                course: assignment['subject'],
                assignment: assignment['name'],
                dueDate: convertDate(new Date(assignment['due'])),
                priority: assignment['priority'],
                completed: assignment['done'],
                id: id
            })
        } else {
            setValidId(false);
            resetState()

            setState({
                ...state,
                id: id
            })
        }
    }

    const ADD = 0;
    const DELETE = 1;
    const EDIT = 2;

    const deletePage =  () => {
        const del = async (e) => {
            if(validId) {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    crossDomain: true,
                    body: JSON.stringify(state.id),
                }
                const res = await makeRequest('remove', requestOptions)
            } else {
                e.preventDefault();
            }
            
        }
        return (
            <div className="flex flex-row">
                <form onSubmit={del}>
                    <FormInput type="number" name="id" placeholder="ID" onChange={changeId} value={state.id} small="true">Assignment ID: </FormInput>
                    <button  type="submit" className={`${validId ? "bg-blue-200 hover:bg-blue-400" : "bg-slate-200 hover:cursor-default"} text-lg py-1 px-4 rounded transition-all duration-300`}>Delete</button>
                </form>
                {validId ? (
                    <div className="text-lg w-1/2 mt-3">
                        <div>Course: {state['course']}</div>
                        <div>Assignment: {state['assignment']} </div>
                        <div>Due Date: {state['dueDate']} </div>
                        <div>Priority: {state['priority']} </div>
                    </div>
                ) : ""}
                
            </div>
        )
    }

    const addPage = (props) => {
        const add = async (e) => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                crossDomain: true,
                body: JSON.stringify(state),
                
            }
            const res = await makeRequest('add', requestOptions)
        }
        return (
            <div>
                <form onSubmit={add}>
                    <div className="flex flex-row">
                        <FormInput type="text" name="course" placeholder="Course" value={state.course} onChange={handleChange}>
                            Course:
                        </FormInput>
                        <FormInput type="text" name="assignment" placeholder="Assignment Name" value={state.assignment} onChange={handleChange}>
                            Assignment:
                        </FormInput>
                    </div>
                    <div className="flex flex-row">
                        <FormInput type="number" name="priority" placeholder="Priority" onChange={handleChangeNumeric} value={state.priority}>
                            Priority:
                        </FormInput>
                        <FormInput type="date" name="dueDate" onChange={handleChange} value={state.dueDate}>
                            Due Date:
                        </FormInput>
                    </div>
                    <button className="bg-blue-200 hover:bg-blue-400 text-lg py-1 px-4 rounded" type="submit">Submit</button>
                </form>
            </div>
        )
    }

    const editPage = (props) => {
        const edit = async (e) => {
            if(validId) {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    crossDomain: true,
                    body: JSON.stringify(state),
                    
                }
                const res = await makeRequest('edit', requestOptions)
            } else {
                e.preventDefault();
            }
        }
        return (
            <div>
                <form onSubmit={edit}>
                    <div className="flex flex-row">
                        <FormInput type="number" name="id" placeholder="ID" onChange={changeId} value={state.id} med="true">
                            Assignment ID: 
                        </FormInput>
                        <FormInput type="text" name="course" placeholder="Course" value={state.course} onChange={handleChange}>
                            Course:
                        </FormInput>
                        <FormInput type="text" name="assignment" placeholder="Assignment Name" value={state.assignment} onChange={handleChange}>
                            Assignment:
                        </FormInput>
                    </div>
                    <div className="flex flex-row">
                        <FormInput type="number" name="priority" placeholder="Priority" onChange={handleChangeNumeric} value={state.priority}>
                            Priority:
                        </FormInput>
                        <FormInput type="date" name="dueDate" onChange={handleChange} value={state.dueDate}>
                            Due Date:
                        </FormInput>
                    </div>
                    <button className={`${validId ? "bg-blue-200 hover:bg-blue-400" : "bg-slate-200 hover:cursor-default"} text-lg py-1 px-4 rounded transition-all duration-300`} type="submit">Submit</button>
                </form>
            </div>
        )
    }

    return (
        <div className="w-full bg-blue-300 justify-center m-4 p-4 shadow-l rounded-lg hover:shadow-2xl transition-all duration-200"> 
            <div className=" w-full flex flex-col ">
                <div className="border-b-2 content-center justify-center text-lg">
                    <button className={` bg-blue-200 rounded-l px-3 py-1 hover:bg-blue-400 transition-all ${action == ADD ? "bg-slate-400" : ""}`} onClick={() => modifyAction(ADD)}>
                        Add
                    </button>
                    <button className={` bg-blue-200 px-3 py-1 hover:bg-blue-400 transition-all ${action == DELETE ? "bg-slate-400" : ""}`} onClick={() => modifyAction(DELETE)}>
                        Delete
                    </button>
                    <button className={` bg-blue-200 rounded-r px-3 py-1 hover:bg-blue-400 transition-all ${action == EDIT ? "bg-slate-400" : ""}`} onClick={() => modifyAction(EDIT)}>
                        Edit
                    </button>
                </div>
                <div>
                    {action === ADD ? addPage() : ""}
                    {action === DELETE ? deletePage() : ""}
                    {action === EDIT ? editPage() : ""}
                </div>
                    
            </div>
        </div>
    );
};

export default TableInput;