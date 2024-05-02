import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
// import AuthIdle from "../assets/images/auth-idle.svg";
// import AuthFace from "../assets/images/auth-face.svg";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const convertBase64ToFile = (base64Data) => {
  const byteString = atob(base64Data.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: "image/png" }); // Change the type as needed
  const file = new File([blob], "image.png", { type: "image/png" }); // Change the file name and type as needed
  console.log("Converted file:", file);
  return file;
  // You can now use the 'file' object as needed (e.g., upload to server)
};

function LoginWithFaceId() {
  const [localUserStream, setLocalUserStream] = useState(null);
  const [loginResult, setLoginResult] = useState("PENDING");
  const videoRef = useRef();
  const canvasRef = useRef();
  const videoWidth = 640;
  const videoHeight = 360;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getLocalUserVideo();
  }, []);
  const getLocalUserVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        videoRef.current.srcObject = stream;
        setLocalUserStream(stream);
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const pauseLocalUserVideo = () => {
    if (localUserStream) {
      const tracks = localUserStream.getVideoTracks();
      tracks.forEach((track) => {
        track.enabled = false; // Pause the video track
      });
    }
  };

  const scanFace = async () => {
    setIsLoading(true);
    setLoginResult("PENDING");
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    // Ensure canvas dimensions match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the entire video frame onto the canvas
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    // Convert canvas to data URL
    pauseLocalUserVideo();
    const img = canvasRef.current.toDataURL("image/png");
    const file = convertBase64ToFile(img);

    const formData = new FormData();
    formData.append("File", file);
    // formData.append("username", 'husnain');
    // formData.append("password", 'husnain');

    fetch("http://localhost:9002/check-face", {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((res) => res.json)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        setLoginResult("SUCCESS");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setLoginResult("FAILED");
      });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-[24px] max-w-[720px] mx-auto">
      {loginResult === "SUCCESS" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-indigo-600 mt-2">
            We've successfully recognize your face!
          </span>
        </h2>
      )}

      {loginResult === "FAILED" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-rose-700 sm:text-4xl">
          <span className="block mt-[56px]">
            Upps! We did not recognize your face.
          </span>
        </h2>
      )}
      {loginResult === "PENDING" && isLoading && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block mt-[56px]">Scanning Face...</span>
        </h2>
      )}
      <div className="w-full">
        <div className="relative flex flex-col items-center p-[10px]">
          <video
            muted
            autoPlay
            ref={videoRef}
            height={videoHeight}
            width={videoWidth}
            // onPlay={scanFace}
            style={{
              objectFit: "fill",
              // height: "360px",
              borderRadius: "10px",
              display: localUserStream ? "block" : "none",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              display: localUserStream ? "block" : "none",
            }}
          />
        </div>
        <div className="text-center">
          {!isLoading && (
            <button
              onClick={scanFace}
              type="button"
              className="flex justify-center items-center w-1/2 py-2.5 px-5 mr-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg border border-gray-200 inline-flex items-center"
            >
              Scan my face
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginWithFaceId;
