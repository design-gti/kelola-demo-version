import { useState, useEffect } from 'react';
import { Download, Upload, RotateCcw, Plus, Trash2, Save, ImageIcon, Star, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Employee } from '../data/orgChartData';
import { dataManager } from '../data/dataManager';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { saveImage, getImageStorageStats } from '../data/imageStorage';

interface VisibleColumns {
  gender: boolean;
  city: boolean;
  maritalStatus: boolean;
  performance: boolean;
  iq: boolean;
  capability: boolean;
  commitment: boolean;
  contribution: boolean;
}

interface DataEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange: () => void;
  visibleColumns: VisibleColumns;
}

export default function DataEditor({ isOpen, onClose, onDataChange, visibleColumns }: DataEditorProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [storageStats, setStorageStats] = useState({ usedMB: 0, totalMB: 5, percentUsed: 0 });
  const [imageStats, setImageStats] = useState({ count: 0, sizeMB: 0 });

  useEffect(() => {
    if (isOpen) {
      // Load current data when dialog opens
      setEmployees(dataManager.getEmployees());
      setSearchTerm(''); // Reset search when dialog opens
      
      // Update storage stats
      setStorageStats(dataManager.getStorageStats());
      
      // Update image storage stats
      getImageStorageStats().then(stats => {
        setImageStats(stats);
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
      // VALIDATION: Employees without Manager must have NON-EMPTY department name
      // And department should be unique among CEO-level positions (employees without manager)
      const employeesWithoutManager = employees.filter(emp => !emp.managerId);
      
      if (employeesWithoutManager.length > 0) {
        const errors: string[] = [];
        
        // Check each employee without manager
        employeesWithoutManager.forEach(emp => {
          // Department must not be empty
          const department = emp.jobTitle?.trim();
          if (!department) {
            errors.push(`â€¢ ${emp.name} (${emp.position}) - Department kosong! Wajib diisi.`);
          }
          


          
          // REMOVED: Duplicate department validation - multiple positions can share the same department
        });
        
        // Show errors if any
        if (errors.length > 0) {
          alert(`âŒ Validation Error!\n\nPosisi tanpa Manager harus punya Department UNIQUE:\n\n${errors.join('\n')}\n\nNote: Department harus beda dengan semua department yang sudah ada.`);
          toast.error(`${errors.length} validation error(s) - check console`);
          console.error('Validation errors:', errors);
          return; // Stop save process
        }
      }

      // Check for base64 images and warn user
      const hasBase64Images = employees.some(emp => emp.imageUrl && emp.imageUrl.startsWith('data:'));
      
      if (hasBase64Images) {
        toast.warning('âš ï¸ Base64 images detected and will be removed to save space. Use image URLs instead.', {
          duration: 5000
        });
      }
      
      dataManager.saveEmployees(employees);
      
      // Update storage stats after save
      const stats = dataManager.getStorageStats();
      setStorageStats(stats);
      
      if (stats.percentUsed > 80) {
        toast.warning(`âš ï¸ Storage usage: ${stats.percentUsed.toFixed(1)}%. Consider reducing data.`);
      }
      
      toast.success('âœ… Data saved successfully!');
      onDataChange(); // Trigger reload in parent
      onClose();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save data. Data might be too large.');
    }
  };

  const handleExport = () => {
    try {
      // Prepare data for Excel - exclude IndexedDB and base64 images
      const excelData = employees.map(emp => {
        // Find manager name for Report To column
        const manager = employees.find(e => e.id === emp.managerId);
        const reportTo = manager ? `${manager.name} (${manager.position})` : '';
        
        return {
          'ID': emp.id,
          'Name': emp.name,
          'Department': emp.jobTitle,
          'Position': emp.position,
          'Manager ID': emp.managerId || '',
          'Report To': reportTo,
          'Score': emp.competencyScore,
          // 'Successors' kolom dihapus - auto-calculated dari jumlah bawahan
          'Performance Rating': emp.performanceRating || 3,
          'Readiness': emp.readinessScore ?? '',
          'Critical Position': emp.criticalPosition ? 'Yes' : 'No',
          'Gender': emp.gender || '',
          'City': emp.city || '',
          'Marital Status': emp.maritalStatus || '',
          'Performance': emp.performance ?? '',
          'IQ': emp.iq ?? '',
          'Image URL': emp.imageUrl && !emp.imageUrl.startsWith('data:') && !emp.imageUrl.startsWith('indexeddb:') ? emp.imageUrl : ''
          // Note: Uploaded images (IndexedDB) are NOT exported - they remain in browser storage
        };
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 15 }, // ID
        { wch: 20 }, // Name
        { wch: 20 }, // Department
        { wch: 25 }, // Position
        { wch: 15 }, // Manager ID
        { wch: 30 }, // Report To
        { wch: 12 }, // Score
        // Successors column removed - auto-calculated
        { wch: 12 }, // Performance Rating
        { wch: 12 }, // Readiness
        { wch: 15 }, // Critical Position
        { wch: 12 }, // Gender
        { wch: 15 }, // City
        { wch: 15 }, // Marital Status
        { wch: 12 }, // Performance
        { wch: 10 }, // IQ
        { wch: 40 }  // Image URL
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `org-chart-data-${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Excel file exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export Excel file');
    }
  };

  const handleExportJSON = () => {
    try {
      // Clean data for export (remove IndexedDB and base64 images, keep URLs)
      const cleanedEmployees = employees.map(emp => {
        const cleaned = { ...emp };
        
        // Remove IndexedDB and base64 images from export
        if (cleaned.imageUrl && (cleaned.imageUrl.startsWith('data:') || cleaned.imageUrl.startsWith('indexeddb:'))) {
          delete cleaned.imageUrl;
        }
        
        return cleaned;
      });

      const jsonString = JSON.stringify(cleanedEmployees, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `org-chart-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('JSON file exported successfully!');
    } catch (error) {
      console.error('Export JSON error:', error);
      toast.error('Failed to export JSON file');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          console.log('Reading Excel file:', file.name);
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          console.log('Reading sheet:', sheetName);
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
          console.log('ðŸ“Š Raw Excel data:', jsonData);
          console.log('ðŸ“‹ Excel columns detected:', Object.keys(jsonData[0] || {}));
          
          if (jsonData.length === 0) {
            toast.error('Excel file is empty');
            return;
          }

          // IMPORTANT: Excel is the SINGLE SOURCE OF TRUTH
          // Do NOT preserve existing data - import replaces everything!

          // Map Excel data to Employee objects
          const importedEmployees: Employee[] = jsonData.map((row: any, index: number) => {
            const id = String(row['ID'] || row['id'] || `emp-${index + 1}`).trim();
            
            // Helper function to get numeric value properly (handles 0 correctly)
            const getNumericValue = (value: any, defaultValue: number): number => {
              if (value !== undefined && value !== null && String(value).trim() !== '') {
                return Number(value);
              }
              return defaultValue;
            };
            
            // Helper function to get optional string value
            const getStringValue = (value: any): string | undefined => {
              if (value !== undefined && value !== null && String(value).trim() !== '') {
                return String(value).trim();
              }
              return undefined;
            };
            
            const employee: Employee = {
              id: id,
              name: String(row['Name'] || row['name'] || 'Unknown'),
              position: String(row['Position'] || row['position'] || 'Position'),
              jobTitle: String(row['Department'] || row['Job Title'] || row['jobTitle'] || 'Employee'),
              competencyScore: getNumericValue(row['Score'] ?? row['Competency Score'] ?? row['competencyScore'], 75),
              successors: 0, // Will be auto-calculated from employee hierarchy (ignored if in Excel)
              performanceRating: getNumericValue(row['Performance Rating'] ?? row['performanceRating'], 3),
            };

            // IMPORTANT: All optional fields from Excel - if empty in Excel, leave as undefined
            // This ensures Excel import completely replaces existing data
            
            // Manager ID - from Excel only
            employee.managerId = getStringValue(row['Manager ID'] ?? row['managerId']);

            // Readiness Score - from Excel only
            const readinessScore = row['Readiness'] ?? row['Readiness Score'] ?? row['readinessScore'];
            if (readinessScore !== undefined && readinessScore !== null && String(readinessScore).trim() !== '') {
              employee.readinessScore = Number(readinessScore);
            }

            // Critical Position - from Excel only
            const criticalPos = row['Critical Position'] ?? row['criticalPosition'];
            if (criticalPos !== undefined && criticalPos !== null && String(criticalPos).trim() !== '') {
              employee.criticalPosition = String(criticalPos).toLowerCase() === 'yes' || criticalPos === true || criticalPos === 'true';
            } else {
              employee.criticalPosition = false; // Default to false if empty
            }

            // Gender - from Excel only
            employee.gender = getStringValue(row['Gender'] ?? row['gender']) as 'Laki-laki' | 'Perempuan' | undefined;

            // City - from Excel only
            employee.city = getStringValue(row['City'] ?? row['city']);

            // Marital Status - from Excel only
            employee.maritalStatus = getStringValue(row['Marital Status'] ?? row['maritalStatus']) as 'Menikah' | 'Belum Menikah' | undefined;

            // Performance - from Excel only
            const performance = row['Performance'] ?? row['performance'];
            if (performance !== undefined && performance !== null && String(performance).trim() !== '') {
              employee.performance = Number(performance);
            }

            // IQ - from Excel only
            const iq = row['IQ'] ?? row['iq'];
            if (iq !== undefined && iq !== null && String(iq).trim() !== '') {
              employee.iq = Number(iq);
            }
            
            // Image URL - from Excel only, do NOT preserve existing images
            // If Excel has empty/blank Image URL column, imageUrl will be undefined (no image)
            employee.imageUrl = getStringValue(row['Image URL'] ?? row['imageUrl']);
            
            return employee;
          });

          // Validate basic required fields
          const hasValidData = importedEmployees.every(emp => emp.id && emp.name);
          if (!hasValidData) {
            toast.error('Invalid data format. Make sure ID and Name columns exist.');
            return;
          }

          console.log('Parsed employees:', importedEmployees);
          console.log('Number of employees:', importedEmployees.length);

          // IMPORTANT: Preserve positions from Excel file!
          // Only auto-generate position if it's completely empty or generic
          let updatedEmployees = importedEmployees.map(emp => {
            // Only auto-generate position if it's empty or generic
            const isGenericPosition = !emp.position || 
                                    emp.position === 'Position' || 
                                    emp.position === 'Employee' || 
                                    emp.position.trim() === '';
            
            if (emp.managerId && isGenericPosition) {
              const basePosition = generatePositionFromManager(emp.managerId, emp.id, importedEmployees);
              console.log(`âš¡ Auto-generating position for ${emp.name}: "${basePosition}"`);
              return { ...emp, position: basePosition };
            } else {
              // Preserve the exact position from Excel
              console.log(`âœ… Preserving Excel position for ${emp.name}: "${emp.position}"`);
              return emp;
            }
          });

          // Do NOT recalculate positions for Excel import!
          // User data from Excel should be preserved as-is
          console.log('âœ… Excel import complete - positions preserved from file');

          // Update state immediately
          setEmployees(updatedEmployees);
          
          // Count how many employees had their data replaced
          const clearedImages = updatedEmployees.filter(emp => !emp.imageUrl).length;
          
          toast.success(`âœ… Imported ${updatedEmployees.length} employees from Excel! All data replaced with Excel values. Click Save to apply.`, {
            duration: 5000
          });
          
          if (clearedImages > 0) {
            toast.info(`â„¹ï¸ ${clearedImages} employee(s) have no Image URL in Excel (images cleared).`, {
              duration: 4000
            });
          }
          
          console.log('ðŸ“‹ Excel Import Summary:');
          console.log(`   â€¢ Total employees: ${updatedEmployees.length}`);
          console.log(`   â€¢ Employees with images: ${updatedEmployees.filter(emp => emp.imageUrl).length}`);
          console.log(`   â€¢ Employees without images: ${clearedImages}`);
          console.log(`   âš ï¸  All existing data replaced with Excel data (Excel = source of truth)`);
          
        } catch (error) {
          console.error('Import error:', error);
          toast.error('Failed to import Excel file. Check console for details.');
        }
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin reset ke data default yang tersimpan? Perubahan yang belum di-save akan hilang.')) {
      dataManager.resetToDefault();
      setEmployees(dataManager.getEmployees());
      onDataChange(); // Trigger reload in parent
      toast.success('âœ… Data di-reset ke default yang tersimpan');
    }
  };

  const handleSaveAsDefault = () => {
    try {
      dataManager.saveCurrentAsDefault();
      toast.success('â­ Data sekarang dijadikan default! Klik Reset kapanpun untuk kembali ke data ini.');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan data sebagai default');
    }
  };



  const handleAddEmployee = () => {
    // AUTO-INCREMENT ID: Find highest numeric ID and add 1
    let nextId = 1;
    
    employees.forEach(emp => {
      // Extract numeric value from ID (supports "50", "emp-50", etc.)
      const numericMatch = emp.id.match(/\d+/);
      if (numericMatch) {
        const numericId = parseInt(numericMatch[0], 10);
        if (numericId >= nextId) {
          nextId = numericId + 1;
        }
      }
    });
    
    // Create new vacant position
    const newEmployee: Employee = {
      id: String(nextId), // Auto-increment ID (e.g., "51")
      name: '(Vacant)', // Vacant position marker
      position: '', // Required - user must fill
      jobTitle: '', // Required - user must fill (Department)
      competencyScore: 0, // Default 0 for vacant
      successors: 0,
      performanceRating: 0, // Default 0 for vacant
      // Optional fields - all empty/undefined for vacant
      managerId: undefined,
      readinessScore: undefined,
      criticalPosition: false,
      gender: undefined,
      city: undefined,
      maritalStatus: undefined,
      performance: undefined,
      iq: undefined,
      imageUrl: undefined
    };
    
    setEmployees([...employees, newEmployee]);
    toast.success(`âœ… Vacant position added with ID: ${nextId}. Fill Position Name & Department!`);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      toast.success('Employee deleted');
    }
  };

  // Helper function to get base position (without numbering)
  const getBasePosition = (position: string): string => {
    return position.replace(/\s*#\d+$/, '').trim();
  };

  // Helper function to generate base position from manager's title
  const generateBasePositionFromManagerTitle = (managerPosition: string): string => {
    let basePosition = managerPosition
      .replace(/\bManager\b/gi, '')
      .replace(/\bDirector\b/gi, '')
      .replace(/\bVP of\b/gi, '')
      .replace(/\bVP\b/gi, '')
      .replace(/\bChief\b/gi, '')
      .replace(/\bExecutive\b/gi, '')
      .replace(/\bOfficer\b/gi, '')
      .trim();
    
    // If ends with "ing", convert to "er" (e.g., "Engineering" â†’ "Engineer")
    if (basePosition.endsWith('ing')) {
      basePosition = basePosition.replace(/ing$/, 'er');
    }
    
    // Default fallback
    if (!basePosition) basePosition = 'Employee';
    
    return basePosition;
  };

  /**
   * Recalculate all positions under a manager with smart numbering
   * Rules:
   * - 1 employee with base position â†’ No numbering (e.g., "Visual Designer")
   * - 2+ employees with same base position â†’ All numbered (e.g., "Visual Designer #1", "Visual Designer #2")
   * 
   * Example:
   * - Scarlett (only Visual Designer) â†’ "Visual Designer"
   * - Tiara joins as Visual Designer â†’ Scarlett: "Visual Designer #1", Tiara: "Visual Designer #2"
   */
  const recalculatePositionsForManager = (managerId: string, allEmployees: Employee[]): Employee[] => {
    if (!managerId) return allEmployees;
    
    const manager = allEmployees.find(emp => emp.id === managerId);
    if (!manager) return allEmployees;
    
    // Get all employees under this manager
    const teamMembers = allEmployees.filter(emp => emp.managerId === managerId);
    
    if (teamMembers.length === 0) return allEmployees;
    
    // Group by base position
    const basePositionGroups = new Map<string, Employee[]>();
    
    teamMembers.forEach(emp => {
      let basePos = getBasePosition(emp.position);
      
      // If base position is empty or generic, try to generate from manager
      if (!basePos || basePos === 'Employee' || basePos === 'Position') {
        basePos = generateBasePositionFromManagerTitle(manager.position);
      }
      
      if (!basePositionGroups.has(basePos)) {
        basePositionGroups.set(basePos, []);
      }
      basePositionGroups.get(basePos)!.push(emp);
    });
    
    console.log(`ðŸ”„ Recalculating positions for manager: ${manager.name} (${manager.position})`);
    console.log(`   Team size: ${teamMembers.length}, Position groups: ${basePositionGroups.size}`);
    
    // Update positions with numbering
    const updatedEmployees = [...allEmployees];
    
    basePositionGroups.forEach((members, basePos) => {
      // Sort members by ID to maintain consistent ordering
      members.sort((a, b) => a.id.localeCompare(b.id));
      
      console.log(`   ðŸ“ Group "${basePos}": ${members.length} member(s)`);
      
      members.forEach((member, index) => {
        const empIndex = updatedEmployees.findIndex(e => e.id === member.id);
        if (empIndex !== -1) {
          // If only 1 member with this base position, no numbering
          // If 2+ members, add numbering #1, #2, #3, etc
          const newPosition = members.length === 1 
            ? basePos 
            : `${basePos} #${index + 1}`;
          
          const oldPosition = updatedEmployees[empIndex].position;
          updatedEmployees[empIndex] = {
            ...updatedEmployees[empIndex],
            position: newPosition
          };
          
          if (oldPosition !== newPosition) {
            console.log(`      âœ… ${member.name}: "${oldPosition}" â†’ "${newPosition}"`);
          } else {
            console.log(`      â­ï¸  ${member.name}: "${newPosition}" (unchanged)`);
          }
        }
      });
    });
    
    return updatedEmployees;
  };

  // Helper function to generate position from manager (for new assignments)
  const generatePositionFromManager = (managerId: string, currentEmployeeId: string, allEmployees: Employee[]): string => {
    if (!managerId) return 'Employee';
    
    // Find manager
    const manager = allEmployees.find(emp => emp.id === managerId);
    if (!manager) {
      console.log(`âš ï¸ Manager not found for ID: ${managerId}`);
      return 'Employee';
    }
    
    console.log(`ðŸ”„ Generating position for employee (ID: ${currentEmployeeId}) under manager: ${manager.name} (${manager.position})`);
    
    // Find other employees under the same manager (excluding current employee)
    const siblings = allEmployees.filter(emp => 
      emp.managerId === managerId && 
      emp.id !== currentEmployeeId
    );
    
    let basePosition = '';
    
    // Try to get base position from existing siblings
    if (siblings.length > 0) {
      // Get the most common position among siblings (without numbering)
      const positions = siblings.map(emp => getBasePosition(emp.position));
      
      // Find most frequent position
      const positionCounts = new Map<string, number>();
      positions.forEach(pos => {
        positionCounts.set(pos, (positionCounts.get(pos) || 0) + 1);
      });
      
      let maxCount = 0;
      positionCounts.forEach((count, pos) => {
        if (count > maxCount) {
          maxCount = count;
          basePosition = pos;
        }
      });
    }
    
    // If no siblings, generate from manager's title
    if (!basePosition) {
      basePosition = generateBasePositionFromManagerTitle(manager.position);
    }
    
    console.log(`âœ… Generated base position: "${basePosition}"`);
    
    return basePosition;
  };

  const handleFieldChange = (id: string, field: keyof Employee, value: any) => {
    setEmployees(prevEmployees => {
      // VALIDATION: Prevent duplicate IDs
      if (field === 'id') {
        const newId = value.trim();
        
        // Check if the new ID already exists (excluding the current employee)
        const duplicate = prevEmployees.find(emp => emp.id === newId && emp.id !== id);
        if (duplicate) {
          toast.error(`âŒ ID "${newId}" already exists! Employee IDs must be unique.`);
          return prevEmployees; // Don't update, keep original
        }
        
        // Empty ID not allowed
        if (!newId) {
          toast.error(`âŒ Employee ID cannot be empty!`);
          return prevEmployees;
        }
      }
      
      let updatedEmployees = prevEmployees.map(emp => {
        if (emp.id === id) {
          const updated = { ...emp, [field]: value };
          
          // REMOVED: Auto-update position when managerId changes
          // Position is now fully manual and independent from managerId
          // User has full flexibility to set any position regardless of manager
          
          // NEW: Auto-update department (jobTitle) when managerId changes
          if (field === 'managerId') {
            if (value) {
              // Find the new manager
              const newManager = prevEmployees.find(e => e.id === value);
              if (newManager) {
                // Auto-update department to match manager's department
                const oldDepartment = updated.jobTitle;
                updated.jobTitle = newManager.jobTitle;
                
                // Show toast notification
                if (oldDepartment !== newManager.jobTitle) {
                  toast.success(`âš¡ Department auto-updated: "${oldDepartment}" â†’ "${newManager.jobTitle}" (from ${newManager.name})`);
                }
                
                console.log(`âš¡ Department auto-updated for ${emp.name}: "${oldDepartment}" â†’ "${newManager.jobTitle}"`);
              }
            }
            // If managerId is cleared, department stays as-is (no auto-reset)
          }
          
          return updated;
        }
        return emp;
      });
      
      // REMOVED: Recalculate positions for affected managers
      // Position is now fully manual - no auto-calculation
      // User can freely change managerId without affecting position
      
      return updatedEmployees;
    });
  };

  const handleImageUpload = (employeeId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Check file size (max 5MB per image)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image too large! Please use an image smaller than 5MB.');
          return;
        }

        try {
          // Convert to base64
          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64 = e.target?.result as string;
            
            // Save to IndexedDB and get image ID
            toast.loading('Uploading image...');
            const imageId = await saveImage(employeeId, base64);
            
            // Store image ID in employee data (not the base64!)
            handleFieldChange(employeeId, 'imageUrl', `indexeddb:${imageId}`);
            
            // Update image stats
            const stats = await getImageStorageStats();
            setImageStats(stats);
            
            toast.dismiss();
            toast.success(`âœ… Image uploaded! (${(file.size / 1024).toFixed(0)} KB)`);
          };
          reader.onerror = () => {
            toast.dismiss();
            toast.error('Failed to read image file');
          };
          reader.readAsDataURL(file);
        } catch (error) {
          toast.dismiss();
          toast.error('Failed to save image. Check console for details.');
          console.error('Image upload error:', error);
        }
      }
    };
    input.click();
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(searchLower) ||
      emp.id.toLowerCase().includes(searchLower) ||
      emp.position.toLowerCase().includes(searchLower) ||
      emp.jobTitle.toLowerCase().includes(searchLower) ||
      (emp.managerId && emp.managerId.toLowerCase().includes(searchLower)) ||
      (emp.city && emp.city.toLowerCase().includes(searchLower)) ||
      (emp.gender && emp.gender.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[98vw] !w-[98vw] max-h-[96vh] font-['Open_Sans',_sans-serif] p-0 flex flex-col">
        {/* Header - Fixed */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle>Employee Data Editor</DialogTitle>
              <DialogDescription className="mt-1">
                Edit employee data directly. Changes are saved to browser localStorage.
              </DialogDescription>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleExport} title="Export to Excel (.xlsx)">
                <Download className="w-4 h-4 mr-1" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJSON} title="Export to JSON (for hardcoded default)">
                <Download className="w-4 h-4 mr-1" />
                Export JSON
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport} title="Import from Excel - REPLACES all data with Excel values (including empty fields)">
                <Upload className="w-4 h-4 mr-1" />
                Import Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} title="Reset ke data default yang tersimpan" className="hidden">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset to Default
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Info Banner */}

          
          {/* Storage Info Banner */}


          {/* Add Button & Actions */}
          <div className="px-6 py-3 border-b shrink-0 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1 w-[250px] h-9 text-sm"
                />
              </div>
              <Button onClick={handleAddEmployee} className="bg-[#016699] hover:bg-[#015580]" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Position
              </Button>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">
                {searchTerm ? (
                  <>
                    Showing: <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> employees
                  </>
                ) : (
                  <>
                    Total: <strong>{employees.length}</strong> employees
                  </>
                )}
              </span>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  storageStats.percentUsed > 80 ? 'bg-red-100 text-red-700' :
                  storageStats.percentUsed > 60 ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`} title={`localStorage: ${storageStats.usedMB.toFixed(2)} MB / ${storageStats.totalMB} MB`}>
                  ðŸ’¾ {storageStats.percentUsed.toFixed(0)}%
                </span>
                {imageStats.count > 0 && (
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700" title={`${imageStats.count} images in IndexedDB`}>
                    ðŸ“· {imageStats.sizeMB.toFixed(1)} MB
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Table - Scrollable */}
          <div className="flex-1 overflow-auto px-6 py-4">
            <div className="border rounded-lg bg-white">
              <table className="w-full min-w-[2200px]">
                <thead className="bg-gray-50 border-b sticky top-0 z-20">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[80px]">ID</th>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[150px]">Name</th>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[140px]">
                        Department
                        <span className="ml-1 text-purple-500" title="Auto-updates from Manager's Department">âš¡</span>
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[160px]">
                        Position
                        <span className="ml-1 text-gray-400" title="Fully manual - edit freely">âœï¸</span>
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[100px]">
                        Manager ID
                        <span className="ml-1 text-yellow-500" title="Manual input - synced with Report to">ðŸ”—</span>
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[220px]">
                        Report to
                        <span className="ml-1 text-green-500" title="Editable dropdown - synced with Manager ID">ðŸ“‹</span>
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[80px]">Score</th>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[100px]">Readiness</th>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[100px]">Critical Pos</th>
                      {visibleColumns.gender && <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[110px]">Gender</th>}
                      {visibleColumns.city && <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[110px]">City</th>}
                      {visibleColumns.maritalStatus && <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[110px]">Marital Status</th>}
                      {visibleColumns.performance && <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[100px]">Performance</th>}
                      {visibleColumns.iq && <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[80px]">IQ</th>}
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[200px]">Image</th>
                      <th className="px-3 py-2 text-left text-[10px] uppercase text-gray-600 w-[60px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={100} className="px-3 py-8 text-center text-gray-500">
                          {searchTerm ? (
                            <div className="flex flex-col items-center gap-2">
                              <Search className="w-8 h-8 text-gray-400" />
                              <p>No employees found matching "{searchTerm}"</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setSearchTerm('')}
                                className="mt-2"
                              >
                                Clear search
                              </Button>
                            </div>
                          ) : (
                            'No employees found'
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((employee, index) => (
                      <tr 
                        key={`${employee.id}-${index}`}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-2">
                          <Input
                            value={employee.id}
                            onChange={(e) => handleFieldChange(employee.id, 'id', e.target.value)}
                            className="h-7 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={employee.name}
                            onChange={(e) => handleFieldChange(employee.id, 'name', e.target.value)}
                            className="h-7 text-xs"
                            placeholder="Employee name"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={employee.jobTitle}
                            onChange={(e) => handleFieldChange(employee.id, 'jobTitle', e.target.value)}
                            className="h-7 text-xs"
                            placeholder="Department"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="relative">
                            <Input
                              value={employee.position}
                              onChange={(e) => handleFieldChange(employee.id, 'position', e.target.value)}
                              className="h-7 text-xs"
                              placeholder="Position title"
                              title="Fully manual - position is independent from Manager ID"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={employee.managerId || ''}
                            onChange={(e) => {
                              const newValue = e.target.value || undefined;
                              handleFieldChange(employee.id, 'managerId', newValue);
                              
                              // Log change
                              if (newValue) {
                                const newManager = employees.find(emp => emp.id === newValue);
                                if (newManager) {
                                  console.log(`âœï¸ Manager ID changed: ${employee.name} â†’ ${newManager.name} (${newManager.position})`);
                                }
                              }
                            }}
                            className="h-7 text-xs bg-yellow-50 border-yellow-200"
                            placeholder="ID"
                            title="Enter Manager ID manually (synced with Report to dropdown)"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Select
                            value={employee.managerId || 'none'}
                            onValueChange={(value) => {
                              const newManagerId = value === 'none' ? undefined : value;
                              handleFieldChange(employee.id, 'managerId', newManagerId);
                              
                              // Show feedback
                              if (newManagerId) {
                                const newManager = employees.find(e => e.id === newManagerId);
                                if (newManager) {
                                  console.log(`ðŸ“‹ Manager changed via dropdown: ${employee.name} â†’ ${newManager.name} (${newManager.position})`);
                                }
                              }
                            }}
                          >
                            <SelectTrigger 
                              className="h-7 text-xs bg-green-50 border-green-200 hover:bg-green-100" 
                              title="Click to select manager from dropdown"
                            >
                              <SelectValue placeholder="Select manager">
                                {(() => {
                                  if (!employee.managerId) return 'No manager';
                                  const manager = employees.find(e => e.id === employee.managerId);
                                  return manager ? manager.position : 'Not found';
                                })()}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              <SelectItem value="none">
                                <span className="text-gray-500 italic">No manager (CEO level)</span>
                              </SelectItem>
                              {(() => {
                                // Group by hierarchy level
                                const potentialManagers = employees.filter(e => e.id !== employee.id);
                                
                                const getLevel = (pos: string) => {
                                  if (pos.includes('CEO') || pos.includes('Chief')) return { level: 1, label: 'Executive' };
                                  if (pos.includes('VP')) return { level: 2, label: 'VP' };
                                  if (pos.includes('Director')) return { level: 3, label: 'Director' };
                                  if (pos.includes('Manager')) return { level: 4, label: 'Manager' };
                                  return { level: 5, label: 'Other' };
                                };
                                
                                const sorted = potentialManagers.sort((a, b) => {
                                  const aLevel = getLevel(a.position).level;
                                  const bLevel = getLevel(b.position).level;
                                  if (aLevel !== bLevel) return aLevel - bLevel;
                                  return a.position.localeCompare(b.position);
                                });
                                
                                let currentLevel = 0;
                                const items: JSX.Element[] = [];
                                const addedLabels = new Set<number>();
                                
                                sorted.forEach((e, idx) => {
                                  const levelInfo = getLevel(e.position);
                                  
                                  // Only add label if we haven't added it before
                                  if (!addedLabels.has(levelInfo.level)) {
                                    addedLabels.add(levelInfo.level);
                                    items.push(
                                      <div key={`label-${levelInfo.level}`} className={`px-2 py-1.5 text-[10px] uppercase text-gray-500 bg-gray-50 ${items.length > 0 ? 'border-t' : ''}`}>
                                        {levelInfo.label}
                                      </div>
                                    );
                                  }
                                  
                                  items.push(
                                    <SelectItem key={e.id} value={e.id}>
                                      <span className="font-medium">{e.position}</span>
                                      <span className="text-gray-500 ml-2 text-xs">({e.name})</span>
                                    </SelectItem>
                                  );
                                });
                                
                                return items;
                              })()}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={employee.competencyScore}
                            onChange={(e) => handleFieldChange(employee.id, 'competencyScore', Number(e.target.value))}
                            className="h-7 text-xs w-full"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={employee.readinessScore ?? ''}
                            onChange={(e) => handleFieldChange(employee.id, 'readinessScore', e.target.value ? Number(e.target.value) : undefined)}
                            className="h-7 text-xs w-full"
                            placeholder="%"
                            title="Readiness score for next level position (0-100%)"
                          />
                        </td>
                        
                        {/* Critical Position - Toggle */}
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={employee.criticalPosition || false}
                              onChange={(e) => handleFieldChange(employee.id, 'criticalPosition', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              title="Toggle critical position"
                            />
                          </div>
                        </td>

                        {/* Gender - Select */}
                        {visibleColumns.gender && (
                          <td className="px-3 py-2">
                            <Select
                              value={employee.gender || 'none'}
                              onValueChange={(value) => {
                                const newValue = value === 'none' ? undefined : value as 'Laki-laki' | 'Perempuan';
                                handleFieldChange(employee.id, 'gender', newValue);
                                console.log(`ðŸš¹ Gender changed: ${employee.name} â†’ ${newValue || 'cleared'}`);
                              }}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">-</SelectItem>
                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        )}

                        {/* City - Input */}
                        {visibleColumns.city && (
                          <td className="px-3 py-2">
                            <Input
                              value={employee.city || ''}
                              onChange={(e) => handleFieldChange(employee.id, 'city', e.target.value || undefined)}
                              className="h-7 text-xs"
                              placeholder="City"
                            />
                          </td>
                        )}

                        {/* Marital Status - Select */}
                        {visibleColumns.maritalStatus && (
                          <td className="px-3 py-2">
                            <Select
                              value={employee.maritalStatus || 'none'}
                              onValueChange={(value) => {
                                const newValue = value === 'none' ? undefined : value as 'Menikah' | 'Belum Menikah';
                                handleFieldChange(employee.id, 'maritalStatus', newValue);
                                console.log(`ðŸ’ Marital status changed: ${employee.name} â†’ ${newValue || 'cleared'}`);
                              }}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">-</SelectItem>
                                <SelectItem value="Menikah">Menikah</SelectItem>
                                <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        )}

                        {/* Performance - Number Input */}
                        {visibleColumns.performance && (
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={employee.performance ?? ''}
                              onChange={(e) => handleFieldChange(employee.id, 'performance', e.target.value ? Number(e.target.value) : undefined)}
                              className="h-7 text-xs w-full"
                              placeholder="%"
                              title="Performance percentage (0-100%)"
                            />
                          </td>
                        )}

                        {/* IQ - Number Input */}
                        {visibleColumns.iq && (
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              min="0"
                              max="200"
                              value={employee.iq ?? ''}
                              onChange={(e) => handleFieldChange(employee.id, 'iq', e.target.value ? Number(e.target.value) : undefined)}
                              className="h-7 text-xs w-full"
                              placeholder="IQ"
                              title="IQ score"
                            />
                          </td>
                        )}

                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <Input
                              value={employee.imageUrl?.startsWith('indexeddb:') ? 'ðŸ“· Uploaded Image' : employee.imageUrl || ''}
                              onChange={(e) => handleFieldChange(employee.id, 'imageUrl', e.target.value || undefined)}
                              className={`h-7 text-xs flex-1 ${employee.imageUrl?.startsWith('indexeddb:') ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
                              placeholder="URL or upload..."
                              title={employee.imageUrl?.startsWith('indexeddb:') ? 'Image uploaded to IndexedDB. Click ðŸ“· to replace.' : 'Paste image URL or click ðŸ“· to upload from computer'}
                              readOnly={employee.imageUrl?.startsWith('indexeddb:')}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleImageUpload(employee.id)}
                              className="h-7 w-7 p-0 shrink-0"
                              title="Upload image from computer (max 5MB, stored in IndexedDB)"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                            title="Delete employee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center shrink-0">
          <p className="text-sm text-gray-600">
            ðŸ’¾ Changes are saved to browser localStorage
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#016699] hover:bg-[#015580]" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
