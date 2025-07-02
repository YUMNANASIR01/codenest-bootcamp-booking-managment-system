export interface Booking {
  name: string
  service: string
  time: string
  duration: string
  status: "Confirmed" | "Pending"
  color: string
}

export const todaysBookings: Booking[] = [
  {
    name: "Sarah Johnson",
    service: "Hair Cut & Styling",
    time: "9:00 AM",
    duration: "1.5 hours",
    status: "Confirmed",
    color: "green",
  },
  {
    name: "Michael Brown",
    service: "Beard Trim",
    time: "11:00 AM",
    duration: "30 minutes",
    status: "Confirmed",
    color: "blue",
  },
  {
    name: "Emma Wilson",
    service: "Full Service",
    time: "2:00 PM",
    duration: "2 hours",
    status: "Pending",
    color: "orange",
  },
  {
    name: "David Lee",
    service: "Hair Wash & Cut",
    time: "4:30 PM",
    duration: "1 hour",
    status: "Confirmed",
    color: "purple",
  },
  {
    name: "Lisa Anderson",
    service: "Color Treatment",
    time: "6:00 PM",
    duration: "2.5 hours",
    status: "Confirmed",
    color: "teal",
  },
  {
    name: "John Doe",
    service: "Manicure & Pedicure",
    time: "7:30 AM",
    duration: "1 hour",
    status: "Pending",
    color: "red",
  },
  {
    name: "Olivia Smith",
    service: "Facial Treatment",
    time: "10:30 AM",
    duration: "1 hour",
    status: "Confirmed",
    color: "green",
  },
  {
    name: "James Miller",
    service: "Shampoo & Blowdry",
    time: "12:30 PM",
    duration: "45 minutes",
    status: "Confirmed",
    color: "yellow",
  },
  {
    name: "Sophia Taylor",
    service: "Pedicure",
    time: "3:00 PM",
    duration: "1 hour",
    status: "Pending",
    color: "brown",
  },
  {
    name: "Ethan Davis",
    service: "Hair Treatment",
    time: "5:00 PM",
    duration: "1.5 hours",
    status: "Confirmed",
    color: "blue",
  },
];