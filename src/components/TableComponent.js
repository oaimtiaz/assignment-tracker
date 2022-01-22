import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import apiData from "./ApiData";


const TableComponent = (props) => {

    const { API_HOST } = apiData;
    const { getAccessTokenSilently } = useAuth0();

    const getToken = async () => {
        try {
          const accessToken = await getAccessTokenSilently({
            audience: API_HOST,
          });
          return accessToken;
        } catch (e) {
          return null
        }
    }

    const makeRequest = async (path, options) => {
        const token = await getToken();
        options['headers']['Authorization'] = `Bearer ${token}`;
        const res = fetch(`${API_HOST}/${path}` , options)
        return res;
    }

    const late = (deadline) => {
        return before(deadline, 0);
    }

    const impending = (deadline, priority) => {
        return before(deadline, priority);
        
    }

    const upcoming = (deadline, priority) => {
        if(priority === 1) {
            return false;
        }
        return before(deadline, priority + 2);
    }

    const before = (deadline, num_days) => {
        const now = new Date();
        const diff = new Date(deadline) - now;
        
        const days = 1000 * 60 * 60 * 24 * num_days;
        return diff < days;
    }

    const submit = async (id) => {

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            crossDomain: true,
            body: JSON.stringify(id),
        }
        const res = await makeRequest('complete', requestOptions);
        window.location.reload(false);
    }

    const getColor = (index) => {
        const assignment = props.data[index];
        if (assignment['done']) {
            return 'bg-green-500';
        } else if (late(assignment['due'])) {
            return 'bg-black text-white';
        } else if(impending(assignment['due'], assignment['priority'])) {
            return "bg-red-500";
        } else if(upcoming(assignment['due'], assignment['priority'])) {
            return "bg-yellow-500";
        }
    }

    const getRows = () => {
        if(props.data) {
            return Object.keys(props.data).map((index) => {
                if(isNaN(index)) {
                    return ""
                }
                return (
                    <tr key={index} className={`hover:bg-slate-200 transition-all w-full ${getColor(index)}`}>
                        <td className="">{props.data[index]['id']}</td>
                        <td className="">{props.data[index]['subject']}</td>
                        <td className="">{props.data[index]['name']}</td>
                        <td className="">{props.data[index]['priority']}</td>
                        <td className="">{props.data[index]['due']}</td>
                        <td onClick={() => submit(props.data[index]['id'])} className="py-0 my-0 pl-4 hover:cursor-pointer">{props.data[index]['done'] ? "Yes" : "No"}</td>
            
                    </tr>
                )
            })
        } else {
            return (<></>);
        }
    }
    return (
        <div className="w-full bg-blue-300 justify-center m-4 p-4 shadow-l rounded-lg hover:shadow-2xl transition-all duration-200 overflow-y-scroll"> 
            <div className=" w-full flex flex-col">
                <div className="border-b-2 content-center justify-center text-2xl">
                    {props.children}
                </div>
                <div >
                    <table className="table-auto  overflow-y-scroll w-full">
                        <thead>
                            <tr className="">
                                <th className="justify-start  ">ID</th>
                                <th className="justify-start  ">Subject</th>
                                <th className="justify-start  ">Name</th>
                                <th className="justify-start ">Priority</th>
                                <th className="justify-start ">Due Date</th>
                                <th className="justify-start ">Done</th>
                            </tr>
                        </thead>
                        <tbody className="text-lg w-full">
                            {!props.data['ready'] ? (
                                <>
                                    <tr className="w-max h-max flex justify-center items-center">
                                        <div className="w-max h-max flex justify-center items-center font-bold text-xl">Loading...</div>
                                    </tr>
                                    
                                </>
                                
                                ):  (getRows())}
                        </tbody>
                    </table>
                </div>
                    
            </div>
        </div>
    );
};

export default TableComponent;