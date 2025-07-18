import React from 'react';
import { Users, Calendar, Mail } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

const adminLinks = [
  { 
    label: 'Manage Events',
    icon: Calendar,
    href: '/admin/events'
  },
  { 
    label: 'Manage Users',
    icon: Users,
    href: '/admin/users'
  },
  { 
    label: 'Contact Volunteers',
    icon: Mail,
    href: '/admin/contact'
  }
];

export function AdminNav() {
  const { profile } = useAuthContext();

  if (profile?.user_type !== 'admin') {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {adminLinks.map(({ label, icon: Icon, href }) => (
        <a
          key={href}
          href={href}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-light/80 hover:text-light hover:bg-dark-hover rounded-md transition-colors"
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </a>
      ))}
    </div>
  );
}