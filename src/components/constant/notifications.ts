
// constants/notifications.ts

export interface Notification {
    status: any;
    category: any;
    title: string;
    message: string;
    time: string;
    icon: 'Calendar' | 'CreditCard' | 'Users' | 'Bell';
    color: string;
    badge?: string;
  }
  
  export const notifications: Notification[] = [
    {
      status: 'canceled',
      category: 'booking',
      title: 'Booking Cancellation',
      message: 'John Smith has canceled their booking for tomorrow at 2:00 PM',
      time: '10 minutes ago',
      icon: 'Calendar',
      color: 'red',
    },
    {
      status: 'new',
      category: 'booking',
      title: 'New Booking',
      message: 'Sarah Johnson has made a new booking on Friday 10:00 AM',
      time: '1 hour ago',
      icon: 'Calendar',
      color: 'green'
    },
    {
      status: 'received',
      category: 'payment',
      title: 'Payment Received',
      message: "You've received a payment of $150 from Michael Brown",
      time: '3 hours ago',
      icon: 'CreditCard',
      color: 'yellow',
      badge: 'New'
    },
    {
      status: 'new',
      category: 'customer',
      title: 'New Customer',
      message: 'Emma Wilson has created a new account',
      time: '5 hours ago',
      icon: 'Users',
      color: 'blue',
      badge: 'New'
    },
    {
      status: 'info',
      category: 'system',
      title: 'System Update',
      message: 'System maintenance completed successfully',
      time: '1 day ago',
      icon: 'Bell',
      color: 'purple'
    },
    {
      status: 'canceled',
      category: 'booking',
      title: 'Booking Cancellation',
      message: 'John Smith has canceled their booking for tomorrow at 2:00 PM',
      time: '10 minutes ago',
      icon: 'Calendar',
      color: 'red',
      badge: 'New'
    },
    {
      status: 'received',
      category: 'payment',
      title: 'Payment Received',
      message: "You've received a payment of $150 from Michael Brown",
      time: '3 hours ago',
      icon: 'CreditCard',
      color: 'yellow',
      badge: 'New'
    },
    {
      status: 'new',
      category: 'customer',
      title: 'New Customer',
      message: 'Emma Wilson has created a new account',
      time: '5 hours ago',
      icon: 'Users',
      color: 'blue',
      badge: 'New'
    },
    {
      status: 'info',
      category: 'system',
      title: 'System Update',
      message: 'System maintenance completed successfully',
      time: '1 day ago',
      icon: 'Bell',
      color: 'purple'
    },
    {
      status: 'canceled',
      category: 'booking',
      title: 'Booking Cancellation',
      message: 'John Smith has canceled their booking for tomorrow at 2:00 PM',
      time: '10 minutes ago',
      icon: 'Calendar',
      color: 'red',
      badge: 'New'
    },
    {
      status: 'canceled',
      category: 'booking',
      title: 'Booking Cancellation',
      message: 'John Smith has canceled their booking for tomorrow at 2:00 PM',
      time: '10 minutes ago',
      icon: 'Calendar',
      color: 'red',
      badge: 'New'
    },
    {
      status: 'canceled',
      category: 'booking',
      title: 'Booking Cancellation',
      message: 'John Smith has canceled their booking for tomorrow at 2:00 PM',
      time: '10 minutes ago',
      icon: 'Calendar',
      color: 'red',
      badge: 'New'
    },
    {
      status: 'canceled',
      category: 'booking',
      title: 'Booking Cancellation',
      message: 'John Smith has canceled their booking for tomorrow at 2:00 PM',
      time: '10 minutes ago',
      icon: 'Calendar',
      color: 'red',
      badge: 'New'
    }
  ];
