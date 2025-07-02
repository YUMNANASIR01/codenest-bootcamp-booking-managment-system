"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, DollarSign,BookOpen,Clock,CheckCircle,  Search, Filter,Calendar,} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Import from constants file
import { bookingData, months,daysOfWeek, getDaysInMonth,  getFirstDayOfMonth, hasDateBookings,getBookingsForDate,  getAvailableTimeSlots, type Booking} from "@/components/constant/booking-constants"
// Calendar component for a single month
const MonthCalendar = ({month, year, title, onDayClick,}: {
  month: number
  year: number
  title: string
  onDayClick: (date: Date, hasBookings: boolean) => void
}) => {
  const daysInMonth = getDaysInMonth(month, year)
  const firstDay = getFirstDayOfMonth(month, year)
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const hasBookings = hasDateBookings(day, month, year)
    days.push(
      <div
        key={day}
        className={`h-8 w-8 flex flex-col items-center justify-center text-sm cursor-pointer rounded-full transition-colors ${
          hasBookings
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300"
            : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
        }`}
        onClick={() => onDayClick(date, hasBookings)}
      >
        <span className="text-xs">{day}</span>
        {hasBookings && (
          <div className="flex space-x-[2px] mt-[1px]">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-gray-600"></span>
            ))}
          </div>
        )}
      </div>,
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <h3 className="text-center font-medium bg-gray-300 py-2 rounded-t-lg text-gray-800">{title}</h3>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4)) // May 2025
  const [activeTab, setActiveTab] = useState("calendar")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showTimeSlots, setShowTimeSlots] = useState(false)
  const [selectedDateHasBookings, setSelectedDateHasBookings] = useState(false)

  // New state for booking data functionality
  const [filteredBookings, setFilteredBookings] = useState(bookingData.bookings)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Booking
    direction: "asc" | "desc"
  } | null>(null)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setCurrentDate(newDate)
  }

  // Handle day click
  const handleDayClick = (date: Date, hasBookings: boolean) => {
    setSelectedDate(date)
    setSelectedDateHasBookings(hasBookings)
    setShowTimeSlots(true)
  }

  // Get existing bookings for selected date
  const getExistingBookings = () => {
    if (!selectedDate) return []
    const day = selectedDate.getDate()
    const month = selectedDate.getMonth()
    const year = selectedDate.getFullYear()
    return getBookingsForDate(day, month, year)
  }

  // Search and filter functionality
  useEffect(() => {
    let result = bookingData.bookings

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (booking) =>
          booking.hallName.toLowerCase().includes(term) ||
          booking.eventType.toLowerCase().includes(term) ||
          booking.date.includes(term) ||
          booking.status.toLowerCase().includes(term),
      )
    }

    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter((booking) => booking.status === statusFilter)
    }

    // Apply sorting
    if (sortConfig !== null) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredBookings(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, statusFilter, sortConfig])

  // Handle sorting
  const requestSort = (key: keyof Booking) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Get sort indicator
  const getSortIndicator = (key: keyof Booking) => {
    if (!sortConfig || sortConfig.key !== key) return null
    return sortConfig.direction === "asc" ? "↑" : "↓"
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex h-16 items-end justify-between border-2 ml-3 mr-2 rounded-[12px] bg-white px-4 pb-4 shadow-sm">
        <h1 className="text-2xl font-semibold">Booking</h1>
        <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
          <BookOpen className="h-5 w-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4 h-full overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-600 text-sm">Upcoming bookings</h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">{bookingData.upcomingBookings}</p>
            <p className="text-sm text-gray-500">+4 from yesterday</p>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-600 text-sm">Current month revenue</h2>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">$ {bookingData.currentMonthRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">5 payments awaiting</p>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-600 text-sm">Current month Available bookings</h2>
              <CheckCircle className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">$ {bookingData.availableBookings.toLocaleString()}</p>
            <p className="text-sm text-gray-500">+12% from last month</p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100">
              <TabsTrigger value="form" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Booking Form
              </TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Booking Data
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Calendar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-4">
              <div className="bg-white rounded-lg p-8 shadow-sm border">
                <div className="max-w-5xl mx-auto">
                  {/* Form Header */}
                  <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-wide ">WEDDING HALL BOOKING FORM</h2>
                    <div className="w-40 h-1 bg-gray-800 mx-auto rounded-full"></div>
                    <p className="text-gray-600 mt-4 text-lg">Fill out the form below to book your perfect venue</p>
                  </div>

                  <form
                    className="space-y-10"
                    onSubmit={(e) => {
                      e.preventDefault()
                      alert("Booking form submitted successfully!")
                    }}
                  >
                    {/* Wedding Hall Information */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center pb-3 border-b-2 border-gray-300 flex items-center justify-center">
                        <BookOpen className="mr-3 h-6 w-6 text-gray-700" />
                        WEDDING HALL INFORMATION
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label htmlFor="hallName" className="block text-sm font-semibold text-gray-700 mb-2">
                            Hall Name *
                          </label>
                          <input
                            type="text"
                            id="hallName"
                            name="hallName"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter hall name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                            Contact Number *
                          </label>
                          <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            required
                            pattern="[0-9]{10}"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter 10-digit contact number"
                          />
                        </div>
                      </div>
                      <div className="mt-8">
                        <label htmlFor="hallAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                          Hall Address *
                        </label>
                        <textarea
                          id="hallAddress"
                          name="hallAddress"
                          required
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                          placeholder="Enter complete hall address with city and pincode"
                        />
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center pb-3 border-b-2 border-blue-300 flex items-center justify-center">
                        <Calendar className="mr-3 h-6 w-6 text-blue-700" />
                        EVENT DETAILS
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="space-y-2">
                          <label htmlFor="bookingDate" className="block text-sm font-semibold text-gray-700 mb-2">
                            Booking Date *
                          </label>
                          <input
                            type="date"
                            id="bookingDate"
                            name="bookingDate"
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="eventTime" className="block text-sm font-semibold text-gray-700 mb-2">
                            Event Start Time *
                          </label>
                          <input
                            type="time"
                            id="eventTime"
                            name="eventTime"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="eventDuration" className="block text-sm font-semibold text-gray-700 mb-2">
                            Event Duration (hours) *
                          </label>
                          <select
                            id="eventDuration"
                            name="eventDuration"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="">Select duration</option>
                            <option value="2">2 hours</option>
                            <option value="3">3 hours</option>
                            <option value="4">4 hours</option>
                            <option value="5">5 hours</option>
                            <option value="6">6 hours</option>
                            <option value="8">8 hours</option>
                            <option value="12">12 hours (Full day)</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Services Required</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              name="services"
                              value="music"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Music & DJ Services</span>
                          </label>
                          <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              name="services"
                              value="catering"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Catering Services</span>
                          </label>
                          <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              name="services"
                              value="decoration"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Decoration Services</span>
                          </label>
                          <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              name="services"
                              value="photography"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Photography</span>
                          </label>
                          <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              name="services"
                              value="security"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Security Services</span>
                          </label>
                          <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              name="services"
                              value="parking"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Parking Management</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Event Type and Guest Details */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center pb-3 border-b-2 border-green-300 flex items-center justify-center">
                        <CheckCircle className="mr-3 h-6 w-6 text-green-700" />
                        EVENT TYPE AND GUEST DETAILS
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                          <label htmlFor="eventType" className="block text-sm font-semibold text-gray-700 mb-2">
                            Event Type *
                          </label>
                          <select
                            id="eventType"
                            name="eventType"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="">Select event type</option>
                            <option value="wedding">Wedding Ceremony</option>
                            <option value="engagement">Engagement Party</option>
                            <option value="reception">Wedding Reception</option>
                            <option value="anniversary">Anniversary Celebration</option>
                            <option value="birthday">Birthday Party</option>
                            <option value="corporate">Corporate Event</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="numberOfGuests" className="block text-sm font-semibold text-gray-700 mb-2">
                            Expected Number of Guests *
                          </label>
                          <input
                            type="number"
                            id="numberOfGuests"
                            name="numberOfGuests"
                            required
                            min="1"
                            max="1000"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter number of guests"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="eventDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                          Event Description
                        </label>
                        <textarea
                          id="eventDescription"
                          name="eventDescription"
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                          placeholder="Describe your event in detail, including any special requirements or themes..."
                        />
                      </div>
                    </div>

                    {/* Special Arrangements */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center pb-3 border-b-2 border-purple-300 flex items-center justify-center">
                        <Clock className="mr-3 h-6 w-6 text-purple-700" />
                        SPECIAL ARRANGEMENTS
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            name="arrangements"
                            value="ladies"
                            className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-2 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">Separate Ladies Section</span>
                        </label>
                        <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            name="arrangements"
                            value="gents"
                            className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-2 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">Separate Gents Section</span>
                        </label>
                        <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            name="arrangements"
                            value="stage"
                            className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-2 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">Stage Setup</span>
                        </label>
                        <label className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            name="arrangements"
                            value="ac"
                            className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-2 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">Air Conditioning</span>
                        </label>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-xl border border-yellow-200 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center pb-3 border-b-2 border-yellow-300 flex items-center justify-center">
                        <DollarSign className="mr-3 h-6 w-6 text-yellow-700" />
                        CONTACT & ADDITIONAL INFORMATION
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700 mb-2">
                            Client Name *
                          </label>
                          <input
                            type="text"
                            id="clientName"
                            name="clientName"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="clientEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="clientEmail"
                            name="clientEmail"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>
                      <div className="mt-8 space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="groomBrideWelcome" className="block text-sm font-semibold text-gray-700 mb-2">
                            Groom & Bride Welcome Details
                          </label>
                          <input
                            type="text"
                            id="groomBrideWelcome"
                            name="groomBrideWelcome"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter welcome ceremony details"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="specialRequest" className="block text-sm font-semibold text-gray-700 mb-2">
                            Special Requests or Requirements
                          </label>
                          <textarea
                            id="specialRequest"
                            name="specialRequest"
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                            placeholder="Any special requests, dietary requirements, accessibility needs, etc."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Budget Information */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-xl border border-indigo-200 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center pb-3 border-b-2 border-indigo-300 flex items-center justify-center">
                        <DollarSign className="mr-3 h-6 w-6 text-indigo-700" />
                        BUDGET INFORMATION
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label htmlFor="budgetRange" className="block text-sm font-semibold text-gray-700 mb-2">
                            Budget Range *
                          </label>
                          <select
                            id="budgetRange"
                            name="budgetRange"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="">Select budget range</option>
                            <option value="under-50k">Under ₹50,000</option>
                            <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                            <option value="1l-2l">₹1,00,000 - ₹2,00,000</option>
                            <option value="2l-5l">₹2,00,000 - ₹5,00,000</option>
                            <option value="5l-10l">₹5,00,000 - ₹10,00,000</option>
                            <option value="above-10l">Above ₹10,00,000</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="paymentPreference" className="block text-sm font-semibold text-gray-700 mb-2">
                            Payment Preference
                          </label>
                          <select
                            id="paymentPreference"
                            name="paymentPreference"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="">Select payment preference</option>
                            <option value="full-advance">Full Payment in Advance</option>
                            <option value="50-50">50% Advance, 50% on Event Day</option>
                            <option value="30-70">30% Advance, 70% on Event Day</option>
                            <option value="installments">Monthly Installments</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="terms"
                          name="terms"
                          required
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                          I agree to the{" "}
                          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                            Terms and Conditions
                          </span>{" "}
                          and
                          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                            {" "}
                            Privacy Policy
                          </span>
                          . I understand that this booking is subject to availability and confirmation from the venue
                          management.
                        </label>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 ">
                      <Button
                        type="button"
                        variant="outline"
                        className="px-8 py-5 text-2lg font-medium border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 bg-transparent"
                        onClick={() => {
                          if (confirm("Are you sure you want to reset the form?")) {
                            ;(document.querySelector("form") as HTMLFormElement)?.reset()
                          }
                        }}
                      >
                        Reset Form
                      </Button>
                      <Button
                        type="submit"
                        className="px-12 py-5 mt-1 text-lg bg-gradient-to-r from-black to-black hover:from-black hover:to-black text-white font-semibold rounded-lg text-2lg  transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        Submit Booking Request
                      </Button>
                    </div>

                    {/* Help Text */}
                    <div className="text-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="mb-2">
                        <strong>Need Help?</strong> Contact us at{" "}
                        <span className="text-blue-600 font-semibold">+91 98765 43210</span> or
                        <span className="text-blue-600 font-semibold"> booking@weddingvenue.com</span>
                      </p>
                      <p>
                        Our team will get back to you within 24 hours to confirm your booking and discuss further
                        details.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4 ">
              <div className="bg-white rounded-lg p-6 border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Booking Data</h3>
                    <p className="text-gray-600 mt-1">Manage all your bookings in one place</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none border border-gray-300 rounded-lg px-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="All">All Status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                      </select>
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("hallName")}
                        >
                          <div className="flex items-center">Hall Name {getSortIndicator("hallName")}</div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("date")}
                        >
                          <div className="flex items-center">Date {getSortIndicator("date")}</div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("eventType")}
                        >
                          <div className="flex items-center">Event Type {getSortIndicator("eventType")}</div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("guests")}
                        >
                          <div className="flex items-center">Guests {getSortIndicator("guests")}</div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("status")}
                        >
                          <div className="flex items-center">Status {getSortIndicator("status")}</div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.hallName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{booking.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{booking.eventType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{booking.guests}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === "Confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm" className="mr-2 bg-transparent">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {currentItems.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No bookings found matching your criteria</p>
                    </div>
                  )}
                </div>

                {/* Enhanced Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <Button variant="outline" onClick={goToPrevious} disabled={currentPage === 1}>
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      className="ml-3 bg-transparent"
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(indexOfLastItem, filteredBookings.length)}</span> of{" "}
                        <span className="font-medium">{filteredBookings.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <Button variant="outline" size="sm" onClick={goToPrevious} disabled={currentPage === 1}>
                          Previous
                        </Button>
                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                className="ml-2"
                                onClick={() => goToPage(page)}
                              >
                                {page}
                              </Button>
                            )
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <span key={page} className="px-2">
                                ...
                              </span>
                            )
                          }
                          return null
                        })}
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2 bg-transparent"
                          onClick={goToNext}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Booking Calendar</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Gray indicates booked days, green indicates available days
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[100px] text-center">
                    {months[currentMonth]} {currentYear}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Three Month Calendar View - Fixed Grid Layout */}
              <div className="grid grid-cols-3 gap-6 border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                <MonthCalendar
                  month={currentMonth}
                  year={currentYear}
                  title={`${months[currentMonth]} ${currentYear}`}
                  onDayClick={handleDayClick}
                />
                <MonthCalendar
                  month={(currentMonth + 1) % 12}
                  year={currentMonth === 11 ? currentYear + 1 : currentYear}
                  title={`${months[(currentMonth + 1) % 12]} ${currentMonth === 11 ? currentYear + 1 : currentYear}`}
                  onDayClick={handleDayClick}
                />
                <MonthCalendar
                  month={(currentMonth + 2) % 12}
                  year={currentMonth >= 10 ? currentYear + 1 : currentYear}
                  title={`${months[(currentMonth + 2) % 12]} ${currentMonth >= 10 ? currentYear + 1 : currentYear}`}
                  onDayClick={handleDayClick}
                />
              </div>

              {/* Legend */}
              <div className="flex gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full border border-gray-300"></div>
                  <span className="text-sm text-gray-600">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full border border-green-200"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex space-x-[1px]">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className="w-1 h-1 rounded-full bg-gray-600"></span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">Has bookings</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Enhanced Time Slots Modal */}
      {showTimeSlots && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <button onClick={() => setShowTimeSlots(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                ✕
              </button>
            </div>

            {selectedDateHasBookings ? (
              <div className="space-y-6">
                {/* Existing Bookings */}
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-4 border-b pb-2">Existing Bookings</h4>
                  <div className="space-y-4">
                    {getExistingBookings().map((booking, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{booking.hallName}</h5>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Event:</strong> {booking.eventType} • <strong>Guests:</strong> {booking.guests}
                        </p>
                        <div className="space-y-2">
                          {booking.timeSlots?.map((slot, slotIndex) => (
                            <div key={slotIndex} className="bg-white p-3 rounded border">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{slot.time}</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {slot.period}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{slot.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Time Slots */}
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-4 border-b pb-2">Still Available</h4>
                  <div className="space-y-4">
                    {getAvailableTimeSlots(selectedDate, selectedDateHasBookings).map((slotGroup, index) => (
                      <div key={index}>
                        <h5 className="font-medium text-gray-700 text-sm mb-2">{slotGroup.period}</h5>
                        <div className="flex flex-wrap gap-2">
                          {slotGroup.times.map((time, idx) => (
                            <button
                              key={idx}
                              className="border border-green-300 bg-green-50 text-green-700 rounded-md py-2 px-4 text-sm hover:bg-green-100 transition-colors"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Day Available for Booking</h4>
                  <p className="text-gray-600">This date is completely available. Choose from the time slots below.</p>
                </div>

                <div className="space-y-6">
                  {getAvailableTimeSlots(selectedDate, selectedDateHasBookings).map((slotGroup, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-700 text-base mb-3 border-b pb-1">{slotGroup.period}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {slotGroup.times.map((time, idx) => (
                          <button
                            key={idx}
                            className="border border-green-300 bg-green-50 text-green-700 rounded-md py-3 px-4 text-sm hover:bg-green-100 transition-colors font-medium"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-3 border-t pt-4">
              <Button variant="outline" onClick={() => setShowTimeSlots(false)}>
                Close
              </Button>
              <Button>{selectedDateHasBookings ? "Book Available Slot" : "Book Now"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}








