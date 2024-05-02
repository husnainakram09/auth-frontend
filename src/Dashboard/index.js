import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [logs, setLogs] = useState([]);

  const getLog = (id) => {
    fetch(`http://localhost:4000/logs/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setLogs(res);
      })
      .catch((err) => console.log(err));
  };
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user);
  }, []);
  
  useEffect(() => {
    if (user.uuid) getLog(user.uuid);
  }, [user]);
  
  if (!localStorage.getItem("user")) {
    return <Navigate to={"/"} replace />;
  }
  const handleSignOut = () => {
    const time = new Date();
    localStorage.removeItem("user");
    fetch("http://localhost:4000/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ time, _id: user.uuid }),
    });
  };

  return (
    <div className="w-3/4">
      <p className="text-lg font-bold">Dashboard</p>
      <div>
        <div className="flex justify-between">
          <p className="text-lg font-semibold">{user?.username}</p>
          <button onClick={handleSignOut}>SignOut</button>
        </div>
        <table>
          <tr>
            <th>Name</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
          {logs.map((log, key) => {
            return (
              <tr key={key}>
                <td>{log?.username}</td>
                <td>{log?.logInTime}</td>
                <td>{log?.logOutTime ?? "-"}</td>
                <td>{log?.lat}</td>
                <td>{log?.lng}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
