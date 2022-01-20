import React from "react";
import TableComponent from "./components/TableComponent";
import TableInput from "./components/TableInput";
import { useState, useEffect } from "react";

import apiData from "./components/ApiData";

import AuthButton from "./components/AuthComponents/AuthButton";
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./components/LoginPage";

const {API_HOST, API_PORT} = apiData;

const App = () => {

  const [upcomingWeek, setUpcomingWeek] = useState({});
  const [priorityWeek, setPriorityWeek] = useState({});
  const [priorityMonth, setPriorityMonth] = useState({});
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [all, setAll] = useState({});
  const [accessToken, setAccessToken] = useState(null);

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

  const makeRequest = async (path) => {
    const token = await getToken();
    const res = await fetch(`http://${API_HOST}/${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        }
      });
      return res;
  }

  const updateState = async (method, data) => {
    var tmp = await data.json()
    tmp = JSON.parse(tmp)
    method(tmp);
  }



  const getUpcomingWeek = async () => {
    const res = await makeRequest('assignments?range=7')
    updateState(setUpcomingWeek, res)
  }

  const getPriorityWeek = async () => {
    const res = await makeRequest('assignments?range=7&priority=1')
    updateState(setPriorityWeek, res)
  }


  const getPriorityMonth = async () => {
    const res = await makeRequest('assignments?range=30&priority=1')
    updateState(setPriorityMonth, res)
  }

  const getAll = async () => {
    const res = await makeRequest('assignments')
    updateState(setAll, res)
  }



  useEffect(() => {
    const tmp = async () => {

      await getUpcomingWeek();
      await getPriorityWeek();
      await getPriorityMonth();
      await getAll();
    }
    tmp();
  }, []);

  if(isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {isAuthenticated ? (
        <div className="h-screen bg-gray-200" >
          <div className="h-full overflow-y-scroll bg-gray-200">
            <div className="h-[10%]  flex flex-col justify-center items-center"> 
              <div className="w-full flex justify-end pt-4 pr-4"><AuthButton/></div>
              <div className="text-3xl font-bold">Assignment Tracker</div>
              
              
            </div>
            <div className="w-full h-[45%] flex flex-row text-xl">
              <TableComponent data={upcomingWeek}>Upcoming this week</TableComponent>
              <TableComponent data={priorityWeek}>High priority this week</TableComponent>
            </div>
            <div className="w-full h-[45%] flex flex-row text-xl">
              {/* <TableComponent data={upcomingMonth}>Upcoming this month</TableComponent> */}
              <TableInput data={all} />
              <TableComponent data={priorityMonth}>High priority this month</TableComponent>
            </div>
            <div className="w-full text-xl h-[65%] overflow-scroll">
              <TableComponent data={all}>All Assignments</TableComponent>
            </div>
          </div>
        </div>
      ) : <LoginPage />}
      
    </>
    
    
  );
};

export default App;