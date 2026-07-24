// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
export interface Committee {
  id: string;
  name: string;
  objective: string;
  period: {
    start: string; // e.g., "Jan 2024"
    end: string;   // e.g., "Dec 2024"
  };
  status: 'Active' | 'Draft' | 'Locked' | 'Completed';
  participants: number;
  icon: string; // emoji or icon identifier
  iconColor: string;
}

export const mockCommittees: Committee[] = [
  {
    id: '1',
    name: 'Annual Audit 2024',
    objective: 'Oversee financial compliance and audit processes for the fiscal year',
    period: { start: 'Jan 2024', end: 'Dec 2024' },
    status: 'Active',
    participants: 12,
    icon: '🏛️',
    iconColor: 'bg-green-100',
  },
  {
    id: '2',
    name: 'Employee Wellness Taskforce',
    objective: 'Improve workplace ergonomics and mental health initiatives',
    period: { start: 'Mar 2024', end: 'Sep 2024' },
    status: 'Draft',
    participants: 5,
    icon: '💙',
    iconColor: 'bg-blue-100',
  },
  {
    id: '3',
    name: 'Safety Standards Review',
    objective: 'Ensure site safety protocols meet regulatory requirements',
    period: { start: 'Jan 2024', end: 'Jun 2024' },
    status: 'Locked',
    participants: 8,
    icon: '🔒',
    iconColor: 'bg-yellow-100',
  },
  {
    id: '4',
    name: 'Tech Innovation Group',
    objective: 'Evaluate new software tools and digital transformation initiatives',
    period: { start: 'Jun 2024', end: 'Dec 2024' },
    status: 'Active',
    participants: 15,
    icon: '⚡',
    iconColor: 'bg-purple-100',
  },
  {
    id: '5',
    name: 'Diversity & Inclusion',
    objective: 'Promote inclusive hiring practices and cultural awareness programs',
    period: { start: 'Feb 2024', end: 'Dec 2024' },
    status: 'Active',
    participants: 10,
    icon: '👥',
    iconColor: 'bg-pink-100',
  },
  {
    id: '6',
    name: 'Customer Experience',
    objective: 'Enhance customer satisfaction and service delivery standards',
    period: { start: 'Jan 2024', end: 'Jun 2024' },
    status: 'Completed',
    participants: 7,
    icon: '⭐',
    iconColor: 'bg-orange-100',
  },
  {
    id: '7',
    name: 'Product Development',
    objective: 'Oversee new product launches and feature roadmaps',
    period: { start: 'Apr 2024', end: 'Oct 2024' },
    status: 'Active',
    participants: 18,
    icon: '🚀',
    iconColor: 'bg-indigo-100',
  },
  {
    id: '8',
    name: 'Sustainability Initiative',
    objective: 'Implement eco-friendly practices and carbon reduction strategies',
    period: { start: 'Jan 2024', end: 'Dec 2024' },
    status: 'Active',
    participants: 11,
    icon: '🌱',
    iconColor: 'bg-green-100',
  },
];
