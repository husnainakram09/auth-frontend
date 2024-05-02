import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import LoginWithFaceId from "./loginFaceId";

function Login() {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginFaceId, setLoginFaceId] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.latitude) {
      alert("Please turn on location!");
      return;
    }

    fetch("http://localhost:9002/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginForm),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoginForm((preState) => ({
            ...preState,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [navigator.geolocation]);

  // let faceio;
  // useEffect(() => {
  //   // if (faceIO) {
  //   setTimeout(() => {
  //     faceio = new faceIO("Your Public ID goes here");
  //   }, 1000);
  //   // }
  // }, []);
  const handleSigin = async () => {
    // setLoginFaceId(true);
    navigate("/login-with-faceid")
  };

  return (
    <div className="h-lvh w-lvw flex flex-col items-center justify-center">
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="px-2 py-1 rounded border border-gray-400"
            onChange={(e) =>
              setLoginForm((preState) => ({
                ...preState,
                username: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="px-2 py-1 rounded border border-gray-400"
            onChange={(e) =>
              setLoginForm((preState) => ({
                ...preState,
                password: e.target.value,
              }))
            }
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded p-1">
          Login
        </button>
        <button
          type="button"
          className="bg-green-700 text-white rounded p-1"
          onClick={handleSigin}
        >
          Login with FaceID
        </button>
      </form>

      {/* {loginFaceId && <LoginWithFaceId />} */}
    </div>
  );
}

export default Login;
