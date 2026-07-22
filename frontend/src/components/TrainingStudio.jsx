import React, { useState } from 'react';
import { UploadCloud, Image, Database, Cpu, CheckCircle2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function TrainingStudio({ onRetrainSuccess }) {
  const [activeMode, setActiveMode] = useState('dataset'); // 'dataset' | 'photo'
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [photoResult, setPhotoResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAndRetrain = async () => {
    setIsUploading(true);
    setUploadResult(null);
    setPhotoResult(null);

    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      if (activeMode === 'dataset') {
        const res = await fetch('/api/model/retrain', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        setUploadResult(data);
        if (onRetrainSuccess) onRetrainSuccess();
      } else {
        if (!selectedFile) {
          alert('Please select a photo file (.png or .jpg) to upload.');
          setIsUploading(false);
          return;
        }
        const res = await fetch('/api/vision/analyze', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        setPhotoResult(data);
      }
    } catch (err) {
      console.error('Error processing file upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              AI Training Studio & Photo Vision Inspector
            </h3>
            <p className="text-xs text-slate-400">
              Upload custom CSV datasets or ground/satellite photos to retrain ML models and run AI vision diagnostics.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => { setActiveMode('dataset'); setSelectedFile(null); setUploadResult(null); setPhotoResult(null); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'dataset'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Dataset ML Retraining (.CSV)</span>
          </button>

          <button
            onClick={() => { setActiveMode('photo'); setSelectedFile(null); setUploadResult(null); setPhotoResult(null); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'photo'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Photo / Satellite Vision (.PNG/.JPG)</span>
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 text-center bg-slate-950/50 transition-all">
        <input
          type="file"
          id="file-input"
          accept={activeMode === 'dataset' ? '.csv,.json' : 'image/*'}
          onChange={handleFileChange}
          className="hidden"
        />

        <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <UploadCloud className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">
              {selectedFile ? selectedFile.name : `Click or drag & drop ${activeMode === 'dataset' ? 'custom AQI dataset (.csv)' : 'pollution photo (.png, .jpg)'}`}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {activeMode === 'dataset' ? 'Supports custom PM2.5, PM10, NO2 & weather features' : 'Analyzes stack smoke opacity & thermal anomaly signatures'}
            </p>
          </div>
        </label>

        <div className="mt-4 flex items-center justify-center space-x-3">
          <button
            onClick={handleUploadAndRetrain}
            disabled={isUploading}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>{activeMode === 'dataset' ? 'Retraining Model...' : 'Analyzing Photo...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{activeMode === 'dataset' ? 'Retrain Model on Dataset' : 'Analyze Photo Vision'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dataset Retrain Results */}
      {uploadResult && (
        <div className="mt-4 bg-emerald-950/20 border border-emerald-500/40 p-4 rounded-xl text-xs space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{uploadResult.message}</span>
          </div>
          {uploadResult.metrics && (
            <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center font-mono mt-1">
              <div>
                <span className="text-[10px] text-slate-400">Samples Count</span>
                <div className="text-cyan-300 font-bold text-sm">{uploadResult.metrics.samples_count}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">AirIQ ML RMSE</span>
                <div className="text-emerald-400 font-bold text-sm">{uploadResult.metrics.rmse_ml}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">R² Score</span>
                <div className="text-purple-300 font-bold text-sm">{uploadResult.metrics.r2_ml}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Photo Vision Results */}
      {photoResult && (
        <div className="mt-4 bg-purple-950/20 border border-purple-500/40 p-4 rounded-xl text-xs space-y-2">
          <div className="flex items-center space-x-2 text-purple-300 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>AI Vision Diagnostic Complete ({photoResult.file_name} - {photoResult.size_kb} KB)</span>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
            <p className="text-slate-200"><strong>Source Detected: </strong>{photoResult.vision_diagnostics.detected_source}</p>
            <p className="text-amber-300"><strong>Plume Opacity: </strong>{photoResult.vision_diagnostics.plume_opacity_index}</p>
            <p className="text-rose-400"><strong>Predicted PM2.5 Surge: </strong>{photoResult.vision_diagnostics.estimated_pm25_surge}</p>
            <p className="text-cyan-300"><strong>Action: </strong>{photoResult.vision_diagnostics.recommended_action}</p>
          </div>
        </div>
      )}

    </div>
  );
}
