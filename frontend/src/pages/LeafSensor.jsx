import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Upload, Camera, Loader } from 'lucide-react';

export default function LeafSensor() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        // Here you would call the backend API to analyze the image
        // analyzeLeaf(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeLeaf = async () => {
    setLoading(true);
    try {
      // Mock analysis - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysis({
        disease: 'No disease detected',
        confidence: 98,
        status: 'healthy',
        recommendations: [
          'Plant is in excellent health',
          'Continue current watering schedule',
          'Monitor for any changes in leaf color'
        ]
      });
    } catch (error) {
      console.error('Error analyzing leaf:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col" style={{ marginLeft: '256px' }}>
        <Navbar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaf Sensor Analysis</h1>
            <p className="text-gray-600 mb-8">
              Upload a photo of your plant leaf for AI-powered disease detection and health assessment
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Upload Leaf Image
                </h2>
                <p className="text-gray-600 mb-6">
                  Take a clear photo of a leaf from your crop for analysis
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />

                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block mb-4">
                    Choose Image
                  </div>
                </label>

                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, WebP
                </p>

                {uploadedImage && (
                  <div className="mt-6">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded leaf" 
                      className="max-h-64 mx-auto rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={analyzeLeaf}
                      disabled={loading}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader className="inline animate-spin mr-2" size={18} />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Results Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Analysis Results</h2>

                {!analysis && !loading && (
                  <div className="text-center text-gray-500">
                    <Camera className="mx-auto mb-4 opacity-50" size={40} />
                    <p>Upload an image to see analysis results</p>
                  </div>
                )}

                {loading && (
                  <div className="text-center">
                    <Loader className="mx-auto animate-spin text-green-600 mb-4" size={40} />
                    <p className="text-gray-600">Analyzing leaf health...</p>
                  </div>
                )}

                {analysis && (
                  <div>
                    <div className={`p-4 rounded-lg mb-6 ${
                      analysis.status === 'healthy' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`font-semibold ${
                        analysis.status === 'healthy' 
                          ? 'text-green-800' 
                          : 'text-red-800'
                      }`}>
                        {analysis.disease}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Confidence: {analysis.confidence}%
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <span className="text-green-600 mt-1">✓</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
