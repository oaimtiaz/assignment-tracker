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

    const late = (deadline) => {
        return before(deadline, 0);
    }

    const impending = (deadline, priority) => {
        return before(deadline, priority + 1);
        
    }

    const upcoming = (deadline, priority) => {
        if(priority === 1) {
            return false;
        }
        return before(deadline, 2*priority + 2);
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
        if (assignment['Done']) {
            return 'bg-green-500';
        } else if (late(assignment['Due Date'])) {
            return 'bg-black text-white';
        } else if(impending(assignment['Due Date'], assignment['Importance (1-5)'])) {
            return "bg-red-500";
        } else if(upcoming(assignment['Due Date'], assignment['Importance (1-5)'])) {
            return "bg-yellow-500";
        }
    }

    const getRows = () => {
        console.log(props.children)
        console.log(props.data)
        if(props.data) {
            return Object.keys(props.data).map((index) => {
                return (
                    <tr key={index} className={`hover:bg-slate-200 transition-all w-full ${getColor(index)}`}>
                        <td className="">{props.data[index]['ID']}</td>
                        <td className="">{props.data[index]['Course']}</td>
                        <td className="">{props.data[index]['Assignment Name']}</td>
                        <td className="">{props.data[index]['Importance (1-5)']}</td>
                        <td className="">{props.data[index]['Due Date']}</td>
                        <td onClick={() => submit(props.data[index]['ID'])} className="py-0 my-0 pl-4 hover:cursor-pointer">{props.data[index]['Done'] ? "Yes" : "No"}</td>
                
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
                                <th className="justify-start  ">Course</th>
                                <th className="justify-start  ">Assignment</th>
                                <th className="justify-start ">Priority</th>
                                <th className="justify-start ">Due Date</th>
                                <th className="justify-start ">Done</th>
                            </tr>
                        </thead>
                        <tbody className="text-lg w-full">
                            {getRows()}
                        </tbody>
                    </table>
                </div>
                    
            </div>
        </div>
    );
};

export default TableComponent;