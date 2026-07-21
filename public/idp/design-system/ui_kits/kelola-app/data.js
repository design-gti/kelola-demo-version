/* Kelola UI Kit — fake data (Indonesian names + HR domain) */

window.KELOLA_DATA = {
  user: { name: 'Rina Wijaya', role: 'HR Manager', email: 'rina@acmecorp.co.id' },
  company: 'PT Acme Indonesia',

  nav: [
    { id: 'home', icon: 'ti-home', label: 'Home' },
    { id: 'assignment', icon: 'ti-clipboard-list', label: 'Assignment' },
    { id: 'development', icon: 'ti-certificate', label: 'Development', beta: true },
    { id: 'organization', icon: 'ti-building', label: 'Organization' },
    { id: 'employees', icon: 'ti-users', label: 'Employee List' },
    { id: 'mapping', icon: 'ti-box', label: 'Box Mapping' },
    { id: 'teams', icon: 'ti-users-group', label: 'Teams' },
  ],

  stats: {
    profileCompletion: 87,
    successionRisk: { count: 6, total: 24 },
    needDevelopment: { count: 18, total: 248 },
    avgScore: 3.7,
  },

  // aspect-to-standard chart (company)
  aspects: [
    { label: 'Leadership', score: 3.9, standard: 3.5 },
    { label: 'Communication', score: 3.4, standard: 3.5 },
    { label: 'Problem Solving', score: 4.1, standard: 3.8 },
    { label: 'Adaptability', score: 3.2, standard: 3.6 },
    { label: 'Collaboration', score: 4.3, standard: 3.5 },
    { label: 'Integrity', score: 4.0, standard: 4.0 },
  ],

  employees: [
    { id: 1, name: 'Budi Santoso', position: 'Senior Engineer', dept: 'Technology', status: 'Active', score: 4.2, completion: 100, disc: 'D' },
    { id: 2, name: 'Citra Lestari', position: 'Product Manager', dept: 'Product', status: 'Active', score: 3.9, completion: 92, disc: 'I' },
    { id: 3, name: 'Doni Prasetyo', position: 'UX Designer', dept: 'Product', status: 'On Leave', score: 3.5, completion: 78, disc: 'S' },
    { id: 4, name: 'Eka Putri', position: 'Finance Analyst', dept: 'Finance', status: 'Active', score: 4.0, completion: 100, disc: 'C' },
    { id: 5, name: 'Fajar Nugroho', position: 'Sales Lead', dept: 'Commercial', status: 'Active', score: 3.7, completion: 64, disc: 'D' },
    { id: 6, name: 'Gita Rahmawati', position: 'HR Specialist', dept: 'People', status: 'Active', score: 3.8, completion: 88, disc: 'I' },
    { id: 7, name: 'Hadi Kusuma', position: 'Data Scientist', dept: 'Technology', status: 'Resigned', score: 4.4, completion: 100, disc: 'C' },
    { id: 8, name: 'Indah Permata', position: 'Marketing Mgr', dept: 'Commercial', status: 'Active', score: 3.6, completion: 71, disc: 'I' },
  ],

  // 9-box talent mapping: rows = performance (3..1 top→bottom), cols = potential (1..3)
  boxLabels: [
    ['Effective', 'Future Star', 'Consistent Star'],
    ['Inconsistent', 'Core Player', 'High Potential'],
    ['Risk', 'Average', 'Solid'],
  ],
  boxCounts: [
    [4, 9, 12],
    [7, 31, 18],
    [3, 14, 6],
  ],
};
