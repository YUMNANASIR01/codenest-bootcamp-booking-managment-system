// Type definitions
export type TimeSlotGroup = {
  period: string
  times: string[]
}

export type Booking = {
  id: number
  hallName: string
  date: string
  eventType: string
  guests: number
  status: string
  timeSlots?: {
    time: string
    period: string
    details: string
  }[]
}

// Expanded booking data with multiple months
export const bookingData = {
  upcomingBookings: 18,
  currentMonthRevenue: 3450,
  availableBookings: 15234,
  bookings: [
    // May 2025 bookings
    {
      id: 1,
      hallName: "Grand Ballroom",
      date: "2025-05-15",
      eventType: "Wedding",
      guests: 250,
      status: "Confirmed",
      timeSlots: [
        { time: "09:00 AM - 12:00 PM", period: "Morning", details: "Wedding ceremony setup and ceremony" },
        { time: "06:00 PM - 11:00 PM", period: "Evening", details: "Reception party with dinner and dancing" },
      ],
    },
    {
      id: 2,
      hallName: "Garden Pavilion",
      date: "2025-05-20",
      eventType: "Engagement",
      guests: 120,
      status: "Pending",
      timeSlots: [
        { time: "02:00 PM - 05:00 PM", period: "Afternoon", details: "Engagement ceremony with refreshments" },
      ],
    },
    {
      id: 3,
      hallName: "Royal Hall",
      date: "2025-05-25",
      eventType: "Anniversary",
      guests: 80,
      status: "Confirmed",
      timeSlots: [
        { time: "07:00 PM - 11:00 PM", period: "Night", details: "50th anniversary celebration with family dinner" },
      ],
    },
    {
      id: 4,
      hallName: "Grand Ballroom",
      date: "2025-05-28",
      eventType: "Reception",
      guests: 300,
      status: "Confirmed",
      timeSlots: [
        { time: "04:00 PM - 07:00 PM", period: "Afternoon", details: "Wedding reception with cocktail hour" },
      ],
    },
    // June 2025 bookings
    {
      id: 5,
      hallName: "Ocean View",
      date: "2025-06-05",
      eventType: "Wedding",
      guests: 200,
      status: "Pending",
      timeSlots: [
        { time: "10:00 AM - 01:00 PM", period: "Morning", details: "Beach wedding ceremony with brunch" },
        { time: "06:00 PM - 12:00 AM", period: "Night", details: "Reception dinner with live music" },
      ],
    },
    {
      id: 6,
      hallName: "Crystal Palace",
      date: "2025-06-12",
      eventType: "Corporate Event",
      guests: 150,
      status: "Confirmed",
      timeSlots: [{ time: "09:00 AM - 05:00 PM", period: "Full Day", details: "Annual company conference with lunch" }],
    },
    {
      id: 7,
      hallName: "Garden Pavilion",
      date: "2025-06-18",
      eventType: "Birthday",
      guests: 90,
      status: "Confirmed",
      timeSlots: [
        { time: "03:00 PM - 08:00 PM", period: "Afternoon", details: "50th birthday celebration with dinner" },
      ],
    },
    // July 2025 bookings
    {
      id: 8,
      hallName: "Grand Ballroom",
      date: "2025-07-04",
      eventType: "Wedding",
      guests: 280,
      status: "Confirmed",
      timeSlots: [
        { time: "11:00 AM - 02:00 PM", period: "Morning", details: "Independence Day wedding ceremony" },
        { time: "07:00 PM - 01:00 AM", period: "Night", details: "Reception with fireworks viewing" },
      ],
    },
    {
      id: 9,
      hallName: "Royal Hall",
      date: "2025-07-10",
      eventType: "Engagement",
      guests: 140,
      status: "Confirmed",
      timeSlots: [
        { time: "05:00 PM - 09:00 PM", period: "Evening", details: "Summer engagement party with outdoor setup" },
      ],
    },
    {
      id: 10,
      hallName: "Ocean View",
      date: "2025-07-15",
      eventType: "Anniversary",
      guests: 100,
      status: "Pending",
      timeSlots: [
        { time: "06:30 PM - 10:30 PM", period: "Evening", details: "25th anniversary celebration with sunset view" },
      ],
    },
    {
      id: 11,
      hallName: "Crystal Palace",
      date: "2025-07-22",
      eventType: "Wedding",
      guests: 220,
      status: "Confirmed",
      timeSlots: [{ time: "04:00 PM - 11:00 PM", period: "Evening", details: "Summer wedding with garden ceremony" }],
    },
    {
      id: 12,
      hallName: "Garden Pavilion",
      date: "2025-07-28",
      eventType: "Reception",
      guests: 180,
      status: "Confirmed",
      timeSlots: [{ time: "12:00 PM - 04:00 PM", period: "Afternoon", details: "Post-wedding reception brunch" }],
    },
    // August 2025 bookings
    {
      id: 13,
      hallName: "Grand Ballroom",
      date: "2025-08-08",
      eventType: "Corporate Event",
      guests: 200,
      status: "Confirmed",
      timeSlots: [
        { time: "08:00 AM - 06:00 PM", period: "Full Day", details: "Product launch event with presentations" },
      ],
    },
    {
      id: 14,
      hallName: "Royal Hall",
      date: "2025-08-14",
      eventType: "Wedding",
      guests: 160,
      status: "Pending",
      timeSlots: [{ time: "03:00 PM - 09:00 PM", period: "Afternoon", details: "Intimate wedding celebration" }],
    },
    {
      id: 15,
      hallName: "Ocean View",
      date: "2025-08-20",
      eventType: "Birthday",
      guests: 75,
      status: "Confirmed",
      timeSlots: [{ time: "07:00 PM - 11:00 PM", period: "Night", details: "Milestone birthday party with live band" }],
    },
  ],
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

// Utility functions
export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay()
}

export const hasDateBookings = (date: number, month: number, year: number) => {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`
  return bookingData.bookings.some((booking) => booking.date === dateStr)
}

export const getBookingsForDate = (date: number, month: number, year: number) => {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`
  return bookingData.bookings.filter((booking) => booking.date === dateStr)
}

// Available time slots configuration
export const getAvailableTimeSlots = (date: Date, hasBookings: boolean): TimeSlotGroup[] => {
  // For dates with bookings, show fewer available slots
  if (hasBookings) {
    return [
      { period: "Morning", times: ["9:00 AM", "10:00 AM"] },
      { period: "Afternoon", times: ["1:00 PM", "3:00 PM"] },
      { period: "Evening", times: ["8:00 PM", "9:00 PM"] },
    ]
  }

  // For available dates - return more slots
  return [
    { period: "Morning", times: ["9:00 AM", "10:00 AM", "11:00 AM"] },
    { period: "Afternoon", times: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"] },
    { period: "Evening", times: ["5:00 PM", "6:00 PM", "7:00 PM"] },
    { period: "Night", times: ["8:00 PM", "9:00 PM", "10:00 PM"] },
  ]
}
