export const users = [
  { id: 'u1', name: 'Prof. Sharma', role: 'admin' },
  { id: 'u2', name: 'Prof. Iyer', role: 'admin' },

  
  { id: 'u3', name: 'Aarav Patel', role: 'student' },
  { id: 'u4', name: 'Priya Nair', role: 'student' },
  { id: 'u5', name: 'Rohan Gupta', role: 'student' },
  { id: 'u6', name: 'Ananya Verma', role: 'student' },
  { id: 'u7', name: 'Vikram Singh', role: 'student' },
]

export const assignments = [

  {
    id: 'a1',
    title: 'React Hooks Practice',
    description: 'Implement a counter and a search filter using useState and useEffect hooks.',
    dueDate: '2026-11-10',
    driveLink: 'https://drive.google.com/drive/folders/sample-react-hooks',
    createdBy: 'u1',
    assignedTo: ['u3', 'u4', 'u5', 'u6', 'u7'], 
  },
  {
    id: 'a2',
    title: 'DBMS ER Diagram',
    description: 'Design a complete Entity-Relationship diagram for an online hospital management system.',
    dueDate: '2026-10-28', 
    driveLink: 'https://drive.google.com/drive/folders/sample-dbms-er',
    createdBy: 'u1',
    assignedTo: ['u3', 'u4', 'u5'],
  },
  {
    id: 'a3',
    title: 'Operating Systems Scheduling',
    description: 'Simulate First-Come-First-Served and Round Robin CPU scheduling algorithms.',
    dueDate: '2026-11-18',
    driveLink: 'https://drive.google.com/drive/folders/sample-os-scheduling',
    createdBy: 'u1',
    assignedTo: ['u4', 'u5', 'u6', 'u7'], 
  },

  
  {
    id: 'a4',
    title: 'Computer Networks Socket Chat',
    description: 'Create a client-server chat application using TCP sockets in Python or Node.js.',
    dueDate: '2026-10-31',
    driveLink: 'https://drive.google.com/drive/folders/sample-networks-chat',
    createdBy: 'u2',
    assignedTo: ['u3', 'u4', 'u5', 'u6', 'u7'], 
  },
  {
    id: 'a5',
    title: 'Binary Tree Traversals',
    description: 'Write iterative and recursive algorithms for Inorder, Preorder, and Postorder tree traversals.',
    dueDate: '2026-11-15',
    driveLink: 'https://drive.google.com/drive/folders/sample-tree-traversals',
    createdBy: 'u2',
    assignedTo: ['u3', 'u5', 'u7'], 
  },
  {
    id: 'a6',
    title: 'System Design Case Study',
    description: 'Draft a high-level architecture diagram and database schema for a URL shortening service.',
    dueDate: '2026-11-25',
    driveLink: 'https://drive.google.com/drive/folders/sample-system-design',
    createdBy: 'u2',
    assignedTo: ['u3', 'u4', 'u6', 'u7'], 
  },
]

export const submissions = [

  { assignmentId: 'a1', studentId: 'u3', submittedAt: '2026-11-02T10:30:00' },
  { assignmentId: 'a1', studentId: 'u4', submittedAt: '2026-11-02T14:15:00' },


  { assignmentId: 'a2', studentId: 'u3', submittedAt: '2026-10-27T16:00:00' },
  { assignmentId: 'a2', studentId: 'u5', submittedAt: '2026-10-28T09:45:00' },

 
  { assignmentId: 'a4', studentId: 'u3', submittedAt: '2026-10-30T11:20:00' },
  { assignmentId: 'a4', studentId: 'u4', submittedAt: '2026-10-30T18:00:00' },
  { assignmentId: 'a4', studentId: 'u6', submittedAt: '2026-10-31T08:30:00' },


  { assignmentId: 'a5', studentId: 'u7', submittedAt: '2026-11-03T11:00:00' },
]

