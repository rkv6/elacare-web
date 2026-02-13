import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader, Scan, AlertTriangle } from 'lucide-react';

const ML_API = 'http://localhost:5001';

export default function LeafSensor() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);          // keep the raw File for upload

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      fileRef.current = file;             // store raw file
      setAnalysis(null);
      setError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeLeaf = async () => {
    if (!fileRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', fileRef.current);

      const res = await fetch(`${ML_API}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server returned ${res.status}`);
      }

      const data = await res.json();

      setAnalysis({
        disease: data.label,
        confidence: data.confidence,
        status: data.status,
        recommendations: data.recommendations,
        allPredictions: data.all_predictions,
      });
    } catch (err) {
      console.error('Error analyzing leaf:', err);
      setError(
        err.message.includes('Failed to fetch')
          ? 'ML server is not running. Start it with: py -3.13 backend/ml_server.py'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
            {/* Header */}
            <div className="mb-10">
              <p className="section-label mb-2">ML Leaf Scanner</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Leaf Health <span className="text-emerald-600">Analysis</span>
              </h1>
              <p className="text-gray-500 text-sm max-w-lg">
                Upload a photo of your cardamom leaf for AI-powered disease detection and health assessment
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Card */}
              <div className="bento-card flex flex-col items-center justify-center text-center min-h-[360px]">
                {!uploadedImage ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
                      <Upload className="text-emerald-600" size={28} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Leaf Image</h2>
                    <p className="text-sm text-gray-400 mb-6 max-w-xs">
                      Take a clear photo of a leaf from your cardamom crop
                    </p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                      <Camera size={16} /> Choose Image
                    </label>
                    <p className="text-[11px] font-mono text-gray-300 mt-4 uppercase tracking-wider">JPG · PNG · WebP</p>
                  </>
                ) : (
                  <div className="w-full">
                    <img src={uploadedImage} alt="Uploaded leaf" className="max-h-56 mx-auto rounded-xl border border-gray-100 mb-5" />
                    <div className="flex items-center justify-center gap-3">
                      <label htmlFor="image-upload" className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        Replace
                      </label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                      <button onClick={analyzeLeaf} disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50">
                        {loading ? <><Loader className="animate-spin" size={16} /> Scanning...</> : <><Scan size={16} /> Analyze</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Card */}
              <div className="bento-card min-h-[360px] flex flex-col">
                <p className="section-label mb-4">Analysis Results</p>

                {!analysis && !loading && !error && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                      <Scan className="text-gray-300" size={24} />
                    </div>
                    <p className="text-sm text-gray-400">Upload an image to see analysis results</p>
                  </div>
                )}

                {error && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                      <AlertTriangle className="text-red-400" size={24} />
                    </div>
                    <p className="text-sm text-red-600 font-medium mb-1">Analysis Failed</p>
                    <p className="text-xs text-gray-500 max-w-xs">{error}</p>
                  </div>
                )}

                {loading && (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader className="animate-spin text-emerald-600 mb-4" size={32} />
                    <p className="text-sm text-gray-500 font-mono">Running model inference...</p>
                  </div>
                )}

                {analysis && (
                  <div className="flex-1 flex flex-col gap-5">
                    <div className={`p-4 rounded-xl ${analysis.status === 'healthy' ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-semibold text-sm ${analysis.status === 'healthy' ? 'text-emerald-800' : 'text-red-800'}`}>
                          {analysis.disease}
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono"
                          style={{ background: analysis.status === 'healthy' ? '#ecfdf5' : '#fef2f2', color: analysis.status === 'healthy' ? '#10b981' : '#ef4444' }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: analysis.status === 'healthy' ? '#10b981' : '#ef4444' }} />
                          {analysis.status === 'healthy' ? 'HEALTHY' : 'DISEASE'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-gray-500">Confidence: <span className="data-value text-base">{analysis.confidence}%</span></p>
                    </div>

                    {/* Per-class probability bars */}
                    {analysis.allPredictions && (
                      <div>
                        <p className="section-label mb-3">Class Probabilities</p>
                        <div className="space-y-2">
                          {Object.entries(analysis.allPredictions).map(([cls, pct]) => (
                            <div key={cls} className="flex items-center gap-3">
                              <span className="text-[11px] font-mono text-gray-500 w-28 truncate capitalize">{cls.replace('_', ' ')}</span>
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%`, background: pct > 50 ? (cls === 'healthy' ? '#10b981' : '#ef4444') : '#d1d5db' }} />
                              </div>
                              <span className="text-[11px] font-mono text-gray-400 w-12 text-right">{pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="section-label mb-3">Recommendations</p>
                      <ul className="space-y-2.5">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
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
