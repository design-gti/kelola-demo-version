// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, FileText, Sparkles, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

export default function ImportAIAnalysis() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dataQuery, setDataQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing AI...');

  const suggestionBadges = [
    'Performance Rating',
    'Engagement Score',
    'Flight Risk',
    'Time In Role',
    'Salary',
    'Department',
    'Certifications',
    'Potential Rating',
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleBadgeClick = (text: string) => {
    setDataQuery((prev) => {
      if (prev) return prev + ', ' + text;
      return text;
    });
  };

  const handleStartExtraction = () => {
    setIsGenerating(true);
    setLoadingProgress(0);
    setLoadingText('Initializing AI...');
    
    // Simulate AI processing with progress updates
    const progressSteps = [
      { progress: 20, text: 'Reading uploaded files...', delay: 600 },
      { progress: 40, text: 'Analyzing document structure...', delay: 800 },
      { progress: 60, text: 'Extracting data fields...', delay: 1000 },
      { progress: 80, text: 'Mapping to employee profiles...', delay: 800 },
      { progress: 100, text: 'Finalizing results...', delay: 600 },
    ];

    let currentDelay = 0;
    progressSteps.forEach((step) => {
      currentDelay += step.delay;
      setTimeout(() => {
        setLoadingProgress(step.progress);
        setLoadingText(step.text);
      }, currentDelay);
    });

    // Navigate after all progress steps complete
    setTimeout(() => {
      navigate('/import-review');
    }, currentDelay + 400);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
      {/* AI Generation Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[24px] p-12 max-w-md w-full mx-4" style={{ boxShadow: '1px 1px 40px 0 rgba(0,0,0,0.2)' }}>
            <div className="flex flex-col items-center gap-6">
              {/* Animated Sparkles Icon */}
              <div className="relative">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-[#016699] animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                {/* Orbiting dots */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
                  <div className="w-3 h-3 bg-[#016699] rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
                  <div className="w-3 h-3 bg-[#016699] rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Generating AI Analysis</h3>
                <p className="text-sm text-gray-600">{loadingText}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-xs font-bold text-[#016699]">{loadingProgress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#016699] to-blue-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Loading Details */}
              <div className="w-full bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Loader2 className="w-5 h-5 text-[#016699] animate-spin flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 mb-1">Processing Files</p>
                    <p className="text-xs text-gray-600">
                      {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} • AI Analysis in progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ boxShadow: '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)' }}>
        <div className="px-6 py-4 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="rounded-full flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: '#016699' }} />
            Back To Screener
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Import & AI Analysis - Step 1</h1>
            <p className="text-sm text-gray-600">Upload your data and let AI extract relevant information</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Info Card */}
          <div className="bg-blue-50 rounded-[16px] p-6 border border-blue-200">
            <h3 className="text-sm font-bold text-gray-900 mb-2">How It Works:</h3>
            <ol className="text-sm text-gray-700 space-y-1.5 list-decimal list-inside">
              <li>Upload your employee data files (CSV, Excel, JSON, or PDF) - multiple files supported</li>
              <li>Describe what information you want to extract</li>
              <li>Our AI will analyze and map your data to the correct columns</li>
              <li>Review and confirm the mapping before importing</li>
            </ol>
          </div>

          {/* Upload Area Card */}
          <div className="bg-white rounded-[16px] p-8" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}>
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5" style={{ color: '#016699' }} />
              Upload File
            </h2>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[16px] p-12 text-center transition-all ${
                isDragging
                  ? 'border-[#016699] bg-blue-50'
                  : uploadedFiles.length > 0
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                {uploadedFiles.length > 0 ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="w-full">
                      <p className="text-lg font-semibold text-gray-900 mb-3">
                        {uploadedFiles.length} {uploadedFiles.length === 1 ? 'File' : 'Files'} Uploaded
                      </p>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setUploadedFiles([])}
                        className="rounded-full"
                      >
                        Remove All Files
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="rounded-full"
                      >
                        <Upload className="w-4 h-4 mr-2" style={{ color: '#016699' }} />
                        Upload More Files
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8" style={{ color: '#016699' }} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Drag & Drop Your File Here
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Or click below to browse
                      </p>
                    </div>
                    <label htmlFor="file-upload">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Browse Files
                      </Button>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".csv,.xlsx,.xls,.json,.pdf"
                      multiple
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Supported Formats: Upload File Dan Drive (CSV, Excel, JSON, PDF)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* AI Query Card */}
          <div className="bg-white rounded-[16px] p-8" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}>
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: '#016699' }} />
              What Data Should We Find?
            </h2>

            <Textarea
              placeholder="Describe the data you want to extract, e.g., 'Find performance ratings, employee names, departments, and salaries'"
              value={dataQuery}
              onChange={(e) => setDataQuery(e.target.value)}
              className="min-h-[120px] mb-4 rounded-[12px]"
            />

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Quick Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionBadges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-[#016699] transition-all px-3 py-1.5"
                    onClick={() => handleBadgeClick(badge)}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartExtraction}
              disabled={!uploadedFiles.length || !dataQuery.trim()}
              className="rounded-full bg-[#016699] hover:bg-[#014d73] text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start AI Extraction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}