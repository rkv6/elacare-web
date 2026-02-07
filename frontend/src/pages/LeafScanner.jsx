import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Camera, Upload, AlertCircle, CheckCircle, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar";

export default function LeafScanner() {
  const [photo, setPhoto] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (cameraActive) {
      startCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [user, navigate, cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      setPhoto(canvasRef.current.toDataURL("image/jpeg"));
      setCameraActive(false);
    }
  };

  const analyzeLeaf = async () => {
    if (!photo) return;

    setScanning(true);
    // Simulate ML analysis
    setTimeout(() => {
      // Mock AI results based on random selection
      const diseases = [
        {
          name: "Healthy Leaf",
          confidence: 94,
          treatment: "Continue with regular maintenance and fertilizer schedule.",
          severity: "healthy",
        },
        {
          name: "Leaf Spot",
          confidence: 87,
          treatment:
            "Apply fungicide spray. Reduce leaf wetness by irrigation scheduling. Remove affected leaves.",
          severity: "warning",
        },
        {
          name: "Thrips Damage",
          confidence: 82,
          treatment:
            "Use insecticidal soap or neem oil. Increase nitrogen levels to promote new growth.",
          severity: "warning",
        },
        {
          name: "Nutrient Deficiency",
          confidence: 79,
          treatment:
            "Increase phosphorus and potassium levels. Consider foliar spray of micronutrients.",
          severity: "warning",
        },
      ];

      const randomResult = diseases[Math.floor(Math.random() * diseases.length)];
      setResult(randomResult);
      setScanning(false);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result);
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetScanner = () => {
    setPhoto(null);
    setResult(null);
    setCameraActive(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-agri-gray">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-agri-green mb-2">Leaf Health Scanner</h1>
          <p className="text-gray-600">
            Use AI to detect diseases and nutrient deficiencies in your cardamom leaves
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {!photo ? (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden mb-6 aspect-video">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />

              <div className="flex flex-col gap-4">
                <button
                  onClick={capturePhoto}
                  disabled={!cameraActive}
                  className="w-full bg-agri-green text-white py-3 rounded-lg font-semibold hover:bg-emerald-900 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Capture Photo
                </button>

                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Photo
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-6 aspect-video">
                <img src={photo} alt="Leaf" className="w-full h-full object-cover" />
              </div>

              {!result ? (
                <button
                  onClick={analyzeLeaf}
                  disabled={scanning}
                  className="w-full bg-agri-green text-white py-3 rounded-lg font-semibold hover:bg-emerald-900 transition disabled:opacity-50"
                >
                  {scanning ? "Analyzing..." : "Analyze Leaf"}
                </button>
              ) : (
                <div
                  className={`p-6 rounded-lg mb-6 ${
                    result.severity === "healthy"
                      ? "bg-green-50 border border-green-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <div className="flex gap-4">
                    {result.severity === "healthy" ? (
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{result.name}</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Confidence: <strong>{result.confidence}%</strong>
                      </p>
                      <p className="text-sm font-medium text-gray-800 mb-2">Recommended Action:</p>
                      <p className="text-sm text-gray-700">{result.treatment}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={resetScanner}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Scan Another Leaf
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
