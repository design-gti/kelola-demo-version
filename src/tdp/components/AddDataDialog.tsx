// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { loadEmployeeDraftEmployees } from '../data/employeeDraft';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Badge } from './ui/badge';

interface AddDataDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onDataImported: () => void;
}

interface ImportPreview {
  employeeId: string;
  employeeName: string;
  newDataValue: string | number;
  status: 'success' | 'error' | 'warning';
  message?: string;
}

export default function AddDataDialog({ isOpen, onClose, onDataImported }: AddDataDialogProps) {
  const allEmployees = useMemo(() => loadEmployeeDraftEmployees(), []);
  const [columnName, setColumnName] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview[]>([]);
  const [step, setStep] = useState<'setup' | 'upload' | 'preview'>('setup');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    // Create template Excel with employee list
    const templateData = allEmployees.map((emp) => ({
      'Employee ID': emp.id,
      'Employee Name': emp.name,
      'Department': emp.department,
      'Role': emp.role,
      [columnName || 'New Data Column']: '', // Empty column for user to fill
    }));

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Data');

    // Set column widths
    const colWidths = [
      { wch: 15 }, // Employee ID
      { wch: 25 }, // Employee Name
      { wch: 20 }, // Department
      { wch: 30 }, // Role
      { wch: 20 }, // New Data Column
    ];
    worksheet['!cols'] = colWidths;

    // Generate file
    const fileName = columnName
      ? `employee_template_${columnName.toLowerCase().replace(/\s+/g, '_')}.xlsx`
      : 'employee_template.xlsx';
    XLSX.writeFile(workbook, fileName);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setImportFile(file);
    parseExcelFile(file);
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        processImportData(jsonData);
        setStep('preview');
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Failed to parse Excel file. Please check the file format.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const processImportData = (data: any[]) => {
    const preview: ImportPreview[] = [];

    // Find the new data column (last column or the one with columnName)
    const firstRow = data[0];
    const columns = Object.keys(firstRow);
    const newDataColumn = columns.find((col) => 
      col.toLowerCase().includes(columnName.toLowerCase())
    ) || columns[columns.length - 1];

    data.forEach((row: any) => {
      const employeeId = row['Employee ID'];
      const employeeName = row['Employee Name'];
      const newDataValue = row[newDataColumn];

      // Validate
      const employee = allEmployees.find((e) => e.id === employeeId);

      if (!employee) {
        preview.push({
          employeeId,
          employeeName: employeeName || 'Unknown',
          newDataValue: newDataValue || '',
          status: 'error',
          message: 'Employee not found in system',
        });
      } else if (!newDataValue && newDataValue !== 0) {
        preview.push({
          employeeId,
          employeeName: employee.name,
          newDataValue: '',
          status: 'warning',
          message: 'No data provided',
        });
      } else {
        preview.push({
          employeeId,
          employeeName: employee.name,
          newDataValue,
          status: 'success',
          message: 'Ready to import',
        });
      }
    });

    setImportPreview(preview);
  };

  const handleImport = () => {
    // Save the new column data to localStorage
    const successfulImports = importPreview.filter((p) => p.status === 'success');

    const newColumnData = successfulImports.reduce((acc, item) => {
      acc[item.employeeId] = item.newDataValue;
      return acc;
    }, {} as Record<string, string | number>);

    // Save to localStorage
    const existingCustomData = localStorage.getItem('customEmployeeData');
    const customData = existingCustomData ? JSON.parse(existingCustomData) : {};
    customData[columnName] = newColumnData;
    localStorage.setItem('customEmployeeData', JSON.stringify(customData));

    // Close dialog and notify parent
    onDataImported();
    handleClose();
  };

  const handleClose = () => {
    setColumnName('');
    setImportFile(null);
    setImportPreview([]);
    setStep('setup');
    onClose(false);
  };

  const getStatusIcon = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const successCount = importPreview.filter((p) => p.status === 'success').length;
  const errorCount = importPreview.filter((p) => p.status === 'error').length;
  const warningCount = importPreview.filter((p) => p.status === 'warning').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <span>Add Custom Data Column</span>
          </DialogTitle>
          <DialogDescription>
            Import new data for your employees by uploading an Excel file with the template format.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Step 1: Setup Column Name */}
          {step === 'setup' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="column-name" className="mb-2 block">
                  New Column Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="column-name"
                  placeholder="e.g., Leadership Score, Training Status, Project Assignment"
                  value={columnName}
                  onChange={(e) => setColumnName(e.target.value)}
                  className="text-base"
                />
                <p className="text-sm text-gray-500 mt-2">
                  This will be the name of the new data column added to your employee table.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Enter the name for your new data column above</li>
                      <li>Download the Excel template with all employee data</li>
                      <li>Fill in the new column with your data</li>
                      <li>Upload the completed Excel file back</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Upload File */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Upload Excel File</h3>
                <Badge className="bg-green-100 text-green-800">
                  Column: {columnName}
                </Badge>
              </div>

              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {importFile ? 'File Selected' : 'Drop your Excel file here'}
                </h4>
                {importFile ? (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                      <FileSpreadsheet className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">{importFile.name}</span>
                      <button
                        onClick={() => {
                          setImportFile(null);
                          setImportPreview([]);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Processing...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      or click to browse your files
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Browse Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                Supported formats: .xlsx, .xls
              </p>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Import Preview</h3>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800">
                    ✓ {successCount} Success
                  </Badge>
                  {warningCount > 0 && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ⚠ {warningCount} Warning
                    </Badge>
                  )}
                  {errorCount > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      ✗ {errorCount} Error
                    </Badge>
                  )}
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Employee ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Employee Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        {columnName}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {importPreview.map((item, index) => (
                      <tr
                        key={index}
                        className={`${
                          item.status === 'error'
                            ? 'bg-red-50'
                            : item.status === 'warning'
                            ? 'bg-yellow-50'
                            : 'bg-white'
                        }`}
                      >
                        <td className="px-4 py-3">{getStatusIcon(item.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.employeeId}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {item.employeeName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.newDataValue || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errorCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900 mb-1">
                        {errorCount} employee(s) cannot be imported
                      </h4>
                      <p className="text-sm text-red-800">
                        Please fix the errors in your Excel file and try again. Only
                        successful records will be imported.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-3">
            {step === 'setup' && (
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                disabled={!columnName.trim()}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            )}
            {step === 'upload' && (
              <Button variant="ghost" onClick={() => setStep('setup')}>
                Back
              </Button>
            )}
            {step === 'preview' && (
              <Button variant="ghost" onClick={() => setStep('upload')}>
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {step === 'setup' && (
              <Button
                onClick={() => setStep('upload')}
                disabled={!columnName.trim()}
              >
                Next: Upload File
              </Button>
            )}
            {step === 'preview' && (
              <Button
                onClick={handleImport}
                disabled={successCount === 0}
                className="gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Import {successCount} Record(s)
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
