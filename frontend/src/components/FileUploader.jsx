import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { uploadFile } from '../api';

const FileUploader = ({ label, type, isUploaded, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            await uploadFile(file, type);
            onSuccess();
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (isUploaded) {
        return (
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-green-100">{label}</p>
                        <p className="text-xs text-green-300/70">Document Verified</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-emerald-100 shadow-xl hover:border-emerald-300 transition-all group">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-600" />
                        {label}
                    </h4>
                    {file && <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Selected</span>}
                </div>

                {!file ? (
                    <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-emerald-50 border-dashed rounded-2xl cursor-pointer bg-emerald-50/30 hover:bg-emerald-50 transition-all">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5 text-emerald-600" />
                            </div>
                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Choose document</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="space-y-4">
                        <div className="truncate text-[10px] font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            {file.name}
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            {uploading ? 'Analyzing Docs...' : 'Process with AI'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                        <p className="text-[10px] text-red-700 font-bold">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
