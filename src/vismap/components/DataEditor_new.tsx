// Temporary - just the handleSave validation section

  const handleSave = () => {
    try {
      // VALIDATION: Employees without Manager must have NON-EMPTY department name
      // Note: Multiple employees can share the same department (e.g., multiple Division Heads in same dept)
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
        });
        
        // Show errors if any
        if (errors.length > 0) {
          alert(`âŒ Validation Error!\n\nPosisi tanpa Manager harus punya Department:\n\n${errors.join('\n')}\n\nSilakan isi kolom Department untuk semua posisi.`);
          toast.error(`${errors.length} validation error(s) - check console`);
          console.error('Validation errors:', errors);
          return; // Stop save process
        }
      }

      // Check for base64 images and warn user
      const hasBase64Images = employees.some(emp => emp.imageUrl && emp.imageUrl.startsWith('data:'));

