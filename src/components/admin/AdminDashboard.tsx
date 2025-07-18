import React from 'react';
import { Users, Calendar, Mail, ArrowLeft, ClipboardList, MessageSquare, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useNotificationScheduling } from '../../hooks/useNotificationScheduling';

const adminFeatures = [
  {
    title: 'Manage Events',
    description: 'View and manage all volunteer events',
    icon: Calendar,
    href: '/admin/events'
  },
  {
    title: 'Manage Users',
    description: 'View and manage system users',
    icon: Users,
    href: '/admin/users'
  },
  {
    title: 'Manage Sign Ups',
    description: 'View and manage event registrations',
    icon: ClipboardList,
    href: '/admin/signups'
  },
  {
    title: 'Text Reminders',
    description: 'View scheduled and sent text reminders',
    icon: MessageSquare,
    href: '/admin/notifications'
  },
  {
    title: 'Upcoming Volunteers',
    description: 'View all upcoming volunteer registrations',
    icon: UserCheck,
    href: '/admin/upcoming'
  },
{
  title: 'Upcoming Open Shifts',
  description: 'View all upcoming open volunteer shifts',
  icon: Calendar,
  href: '/admin/open-shifts'
},
];

export function AdminDashboard() {
  const navigate = useNavigate();
  
  // Process pending notifications when admin dashboard loads
  useNotificationScheduling();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Admin Dashboard</h1>
        <Button
          variant="secondary"
          className="!w-auto"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {adminFeatures.map(({ title, description, icon: Icon, href }) => (
          <Link
            key={href}
            to={href}
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-dark">{title}</h2>
                <p className="text-sm text-dark/60">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}