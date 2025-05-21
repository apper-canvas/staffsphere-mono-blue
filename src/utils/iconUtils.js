import {
  User,
  UserPlus,
  Users,
  Clipboard,
  ClipboardCheck,
  Calendar,
  Clock,
  Edit,
  Trash,
  Search,
  X,
  Check,
  Mail,
  Phone,
  Briefcase,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  Pen,
  LogOut
} from 'lucide-react';

// Map of icon names to their components
const iconMap = {
  'user': User,
  'user-plus': UserPlus,
  'users': Users,
  'clipboard': Clipboard,
  'clipboard-check': ClipboardCheck,
  'calendar': Calendar,
  'clock': Clock,
  'edit': Edit,
  'trash': Trash,
  'search': Search,
  'x': X,
  'check': Check,
  'mail': Mail,
  'phone': Phone,
  'briefcase': Briefcase,
  'file-text': FileText,
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'trending-up': TrendingUp,
  'alert-circle': AlertCircle,
  'pen': Pen,
  'log-out': LogOut
};

/**
 * Get the icon component by name
 * @param {string} name - The name of the icon
 * @returns {React.Component} - The icon component
 */
export const getIcon = (name) => {
  return iconMap[name] || (() => null);
};

export default getIcon;