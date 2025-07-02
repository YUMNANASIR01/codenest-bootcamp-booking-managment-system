"use client"

import type React from "react"

import { useState, useMemo, useRef, useEffect } from "react"
import { Bell, Calendar, CreditCard, DollarSign, Filter, ChevronDown, Check, X, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { notifications } from "@/components/constant/notifications"
import { todaysBookings } from "@/components/constant/bookings"

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ElementType> = {
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  Users,
}

// Custom Checkbox Component
const CustomCheckbox = ({
  checked,
  onCheckedChange,
  id,
  className = "",
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id: string
  className?: string
}) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`h-4 w-4 rounded border-2 border-gray-300 cursor-pointer transition-all ${
          checked ? "bg-black border-black" : "bg-white hover:border-gray-400"
        } ${className}`}
        onClick={() => onCheckedChange(!checked)}
      >
        {checked && <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5" />}
      </div>
    </div>
  )
}

// Updated helper functions with simple color names
const getBorderColor = (color: string) => {
  switch (color) {
    case "blue":
      return "#3B82F6"
    case "green":
      return "#10B981"
    case "purple":
      return "#8B5CF6"
    case "orange":
      return "#F97316"
    case "red":
      return "#EF4444"
    case "yellow":
      return "#EAB308"
    case "teal":
      return "#14B8A6"
    case "pink":
      return "#EC4899"
    case "indigo":
      return "#6366F1"
    case "cyan":
      return "#06B6D4"
    default:
      return "#6B7280"
  }
}

const getBgColor = (color: string) => {
  switch (color) {
    case "blue":
      return "#DBEAFE"
    case "green":
      return "#D1FAE5"
    case "purple":
      return "#EDE9FE"
    case "orange":
      return "#FED7AA"
    case "red":
      return "#FEE2E2"
    case "yellow":
      return "#FEF3C7"
    case "teal":
      return "#CCFBF1"
    case "pink":
      return "#FCE7F3"
    case "indigo":
      return "#E0E7FF"
    case "cyan":
      return "#CFFAFE"
    default:
      return "#F3F4F6"
  }
}

const getTextColor = (color: string) => {
  switch (color) {
    case "blue":
      return "#3B82F6"
    case "green":
      return "#10B981"
    case "purple":
      return "#8B5CF6"
    case "orange":
      return "#F97316"
    case "red":
      return "#EF4444"
    case "yellow":
      return "#EAB308"
    case "teal":
      return "#14B8A6"
    case "pink":
      return "#EC4899"
    case "indigo":
      return "#6366F1"
    case "cyan":
      return "#06B6D4"
    default:
      return "#6B7280"
  }
}

export default function DashboardPage() {
  // Filter states - separate for each tab
  const [notificationFilters, setNotificationFilters] = useState({
    categories: [] as string[],
    statuses: [] as string[],
  })

  const [bookingFilters, setBookingFilters] = useState({
    services: [] as string[],
    statuses: [] as string[],
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("notifications")
  const filterRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        buttonRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false)
      }
    }

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterOpen])

  // Get unique values for filtering
  const uniqueNotificationCategories = useMemo(() => {
    const categories = new Set<string>()
    notifications.forEach((item) => categories.add(item.category))
    return Array.from(categories)
  }, [])

  const uniqueBookingServices = useMemo(() => {
    const services = new Set<string>()
    todaysBookings.forEach((item) => services.add(item.service))
    return Array.from(services)
  }, [])

  const uniqueBookingStatuses = useMemo(() => {
    const statuses = new Set<string>()
    todaysBookings.forEach((item) => statuses.add(item.status))
    return Array.from(statuses)
  }, [])

  // Counts for notifications
  const notificationCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    uniqueNotificationCategories.forEach((category) => {
      counts[category] = notifications.filter((item) => item.category === category).length
    })
    return counts
  }, [uniqueNotificationCategories])

  const notificationStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    ;["unread", "read"].forEach((status) => {
      counts[status] = notifications.filter((item) => item.status === status).length
    })
    return counts
  }, [])

  // Counts for bookings
  const bookingServiceCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    uniqueBookingServices.forEach((service) => {
      counts[service] = todaysBookings.filter((item) => item.service === service).length
    })
    return counts
  }, [uniqueBookingServices])

  const bookingStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    uniqueBookingStatuses.forEach((status) => {
      counts[status] = todaysBookings.filter((item) => item.status === status).length
    })
    return counts
  }, [uniqueBookingStatuses])

  // Filtered data
  const filteredNotifications = useMemo(() => {
    if (notificationFilters.categories.length === 0 && notificationFilters.statuses.length === 0) {
      return notifications
    }
    return notifications.filter((item) => {
      const categoryMatch =
        notificationFilters.categories.length === 0 || notificationFilters.categories.includes(item.category)
      const statusMatch =
        notificationFilters.statuses.length === 0 || notificationFilters.statuses.includes(item.status)
      return categoryMatch && statusMatch
    })
  }, [notificationFilters])

  const filteredBookings = useMemo(() => {
    if (bookingFilters.services.length === 0 && bookingFilters.statuses.length === 0) {
      return todaysBookings
    }
    return todaysBookings.filter((item) => {
      const serviceMatch = bookingFilters.services.length === 0 || bookingFilters.services.includes(item.service)
      const statusMatch = bookingFilters.statuses.length === 0 || bookingFilters.statuses.includes(item.status)
      return serviceMatch && statusMatch
    })
  }, [bookingFilters])

  // Filter handlers for notifications
  const handleNotificationCategoryChange = (category: string, checked: boolean) => {
    setNotificationFilters((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, category] : prev.categories.filter((c) => c !== category),
    }))
  }

  const handleNotificationStatusChange = (status: string, checked: boolean) => {
    setNotificationFilters((prev) => ({
      ...prev,
      statuses: checked ? [...prev.statuses, status] : prev.statuses.filter((s) => s !== status),
    }))
  }

  // Filter handlers for bookings
  const handleBookingServiceChange = (service: string, checked: boolean) => {
    setBookingFilters((prev) => ({
      ...prev,
      services: checked ? [...prev.services, service] : prev.services.filter((s) => s !== service),
    }))
  }

  const handleBookingStatusChange = (status: string, checked: boolean) => {
    setBookingFilters((prev) => ({
      ...prev,
      statuses: checked ? [...prev.statuses, status] : prev.statuses.filter((s) => s !== status),
    }))
  }

  // Applied filters based on active tab
  const appliedFilters = useMemo(() => {
    if (activeTab === "notifications") {
      return [
        ...notificationFilters.categories.map((cat) => `Type: ${cat}`),
        ...notificationFilters.statuses.map((status) => `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`),
      ]
    } else {
      return [
        ...bookingFilters.services.map((service) => `Service: ${service}`),
        ...bookingFilters.statuses.map((status) => `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`),
      ]
    }
  }, [activeTab, notificationFilters, bookingFilters])

  // Remove individual filter
  const removeFilter = (filter: string) => {
    const [type, value] = filter.split(": ")

    if (activeTab === "notifications") {
      if (type === "Type") {
        setNotificationFilters((prev) => ({
          ...prev,
          categories: prev.categories.filter((cat) => cat !== value),
        }))
      } else if (type === "Status") {
        const statusValue = value.toLowerCase()
        setNotificationFilters((prev) => ({
          ...prev,
          statuses: prev.statuses.filter((status) => status !== statusValue),
        }))
      }
    } else {
      if (type === "Service") {
        setBookingFilters((prev) => ({
          ...prev,
          services: prev.services.filter((service) => service !== value),
        }))
      } else if (type === "Status") {
        const statusValue = value.toLowerCase()
        setBookingFilters((prev) => ({
          ...prev,
          statuses: prev.statuses.filter((status) => status !== statusValue),
        }))
      }
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    if (activeTab === "notifications") {
      setNotificationFilters({ categories: [], statuses: [] })
    } else {
      setBookingFilters({ services: [], statuses: [] })
    }
  }

  // Get filter counts for button badge
  const totalFilterCount =
    activeTab === "notifications"
      ? notificationFilters.categories.length + notificationFilters.statuses.length
      : bookingFilters.services.length + bookingFilters.statuses.length

  return (
    <div className="flex-1 overflow-hidden">
      <header className="flex h-16 items-end justify-between border-2 ml-3 mr-2 rounded-[12px] bg-white px-4 pb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button className="rounded-full bg-gray-100 p-2">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <main className="p-4 h-full overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Up coming bookings</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">12</p>
            <p className="text-sm text-gray-500">+2 from yesterday</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Pending Payments</h2>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">$ 2,350</p>
            <p className="text-sm text-gray-500">3 payments awaiting</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Total Revenue</h2>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">$ 12,234</p>
            <p className="text-sm text-gray-500">+8% from last month</p>
          </div>
        </div>

        {/* Enhanced Notifications and Bookings Section */}
        <div className="space-y-4 h-full">
          <Tabs defaultValue="notifications" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-[400px] bg-gray-200">
              <TabsTrigger value="notifications" className="relative">
                Notifications
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {filteredNotifications.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="relative">
                Today's Bookings
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {filteredBookings.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <Card className="h-full">
              <CardHeader className="flex flex-col items-start gap-4">
                <div className="flex w-full items-center justify-between">
                  <CardTitle className="text-xl">Recent Activity</CardTitle>

                  {/* Custom Filter Dropdown */}
                  <div className="relative">
                    <Button
                      ref={buttonRef}
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-gray-50 transition-colors bg-transparent"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                      <span className="bg-gray-200 text-gray-700 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalFilterCount}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                    </Button>

                    {/* Filter Dropdown Content */}
                    {isFilterOpen && (
                      <div
                        ref={filterRef}
                        className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50 max-h-[400px] overflow-y-auto"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10 rounded-t-xl">
                          <h3 className="font-semibold text-base text-gray-900">
                            Filter {activeTab === "notifications" ? "Notifications" : "Bookings"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-0.5">
                            Choose which {activeTab === "notifications" ? "notifications" : "bookings"} to display
                          </p>
                        </div>

                        <div className="p-4 space-y-4">
                          {activeTab === "notifications" ? (
                            <>
                              {/* Notification Type Filters */}
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900 mb-2 px-2 py-1 bg-gray-100 rounded-md">
                                  Type
                                </h4>
                                <div className="space-y-1.5">
                                  {uniqueNotificationCategories.map((category) => (
                                    <div
                                      key={category}
                                      className="flex items-center justify-between py-1.5 hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors cursor-pointer"
                                      onClick={() =>
                                        handleNotificationCategoryChange(
                                          category,
                                          !notificationFilters.categories.includes(category),
                                        )
                                      }
                                    >
                                      <div className="flex items-center space-x-2.5">
                                        <CustomCheckbox
                                          id={`notification-${category}`}
                                          checked={notificationFilters.categories.includes(category)}
                                          onCheckedChange={(checked) =>
                                            handleNotificationCategoryChange(category, checked)
                                          }
                                        />
                                        <label
                                          htmlFor={`notification-${category}`}
                                          className="text-sm font-medium text-gray-700 cursor-pointer"
                                        >
                                          {category}
                                        </label>
                                      </div>
                                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full min-w-[24px] text-center">
                                        {notificationCategoryCounts[category] || 0}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Notification Status Filters */}
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900 mb-2 px-2 py-1 bg-gray-100 rounded-md">
                                  Status
                                </h4>
                                <div className="space-y-1.5">
                                  {["unread", "read"].map((status) => (
                                    <div
                                      key={status}
                                      className="flex items-center justify-between py-1.5 hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors cursor-pointer"
                                      onClick={() =>
                                        handleNotificationStatusChange(
                                          status,
                                          !notificationFilters.statuses.includes(status),
                                        )
                                      }
                                    >
                                      <div className="flex items-center space-x-2.5">
                                        <CustomCheckbox
                                          id={`notification-status-${status}`}
                                          checked={notificationFilters.statuses.includes(status)}
                                          onCheckedChange={(checked) => handleNotificationStatusChange(status, checked)}
                                        />
                                        <label
                                          htmlFor={`notification-status-${status}`}
                                          className="text-sm font-medium text-gray-700 cursor-pointer"
                                        >
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </label>
                                      </div>
                                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full min-w-[24px] text-center">
                                        {notificationStatusCounts[status] || 0}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Booking Service Filters */}
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900 mb-2 px-2 py-1 bg-gray-100 rounded-md">
                                  Service
                                </h4>
                                <div className="space-y-1.5">
                                  {uniqueBookingServices.map((service) => (
                                    <div
                                      key={service}
                                      className="flex items-center justify-between py-1.5 hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors cursor-pointer"
                                      onClick={() =>
                                        handleBookingServiceChange(service, !bookingFilters.services.includes(service))
                                      }
                                    >
                                      <div className="flex items-center space-x-2.5">
                                        <CustomCheckbox
                                          id={`booking-${service}`}
                                          checked={bookingFilters.services.includes(service)}
                                          onCheckedChange={(checked) => handleBookingServiceChange(service, checked)}
                                        />
                                        <label
                                          htmlFor={`booking-${service}`}
                                          className="text-sm font-medium text-gray-700 cursor-pointer"
                                        >
                                          {service}
                                        </label>
                                      </div>
                                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full min-w-[24px] text-center">
                                        {bookingServiceCounts[service] || 0}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Booking Status Filters */}
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900 mb-2 px-2 py-1 bg-gray-100 rounded-md">
                                  Status
                                </h4>
                                <div className="space-y-1.5">
                                  {uniqueBookingStatuses.map((status) => (
                                    <div
                                      key={status}
                                      className="flex items-center justify-between py-1.5 hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors cursor-pointer"
                                      onClick={() =>
                                        handleBookingStatusChange(status, !bookingFilters.statuses.includes(status))
                                      }
                                    >
                                      <div className="flex items-center space-x-2.5">
                                        <CustomCheckbox
                                          id={`booking-status-${status}`}
                                          checked={bookingFilters.statuses.includes(status)}
                                          onCheckedChange={(checked) => handleBookingStatusChange(status, checked)}
                                        />
                                        <label
                                          htmlFor={`booking-status-${status}`}
                                          className="text-sm font-medium text-gray-700 cursor-pointer"
                                        >
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </label>
                                      </div>
                                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full min-w-[24px] text-center">
                                        {bookingStatusCounts[status] || 0}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Clear All Button */}
                          {totalFilterCount > 0 && (
                            <div className="pt-2 border-t border-gray-200">
                              <button
                                onClick={clearAllFilters}
                                className="w-full text-sm text-red-600 hover:text-red-800 font-medium px-3 py-2 rounded-md hover:bg-red-50 transition-colors border border-red-200 hover:border-red-300"
                              >
                                Clear All Filters
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Applied Filters Bar */}
                {appliedFilters.length > 0 && (
                  <div className="w-full flex flex-wrap gap-3 items-center">
                    <div className="flex flex-wrap gap-2">
                      {appliedFilters.map((filter, idx) => (
                        <span
                          key={idx}
                          className="flex items-center bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full"
                        >
                          {filter}
                          <X
                            className="h-4 w-4 ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => removeFilter(filter)}
                          />
                        </span>
                      ))}
                    </div>
                    <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Clear All
                    </button>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* Notifications */}
                <TabsContent value="notifications" className="h-full m-0">
                  <div className="px-6 pb-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredNotifications.length} of {notifications.length} notifications
                    </p>
                  </div>
                  <ScrollArea className="h-[350px] px-6">
                    <div className="space-y-2 pb-4">
                      {filteredNotifications.map((notification, index) => {
                        const IconComponent = iconMap[notification.icon] || Bell
                        return (
                          <div
                            key={index}
                            className="bg-white rounded-lg overflow-hidden flex items-start gap-3 hover:bg-gray-50 transition-colors relative border border-gray-200 shadow-sm"
                            style={{
                              borderLeft: `4px solid ${getBorderColor(notification.color)}`,
                              borderRadius: "8px",
                            }}
                          >
                            <div className="flex items-start gap-3 p-3 w-full">
                              <div
                                className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0"
                                style={{ backgroundColor: getBgColor(notification.color) }}
                              >
                                <IconComponent
                                  className="h-4 w-4"
                                  style={{ color: getTextColor(notification.color) }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-gray-900">{notification.title}</h3>
                                <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                              </div>
                              {notification.badge && (
                                <button className="bg-black text-white text-xs px-3 py-1 rounded-full h-6 flex items-center">
                                  {notification.badge}
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Today's Bookings */}
                <TabsContent value="bookings" className="h-full m-0">
                  <div className="px-6 pb-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredBookings.length} of {todaysBookings.length} bookings scheduled for today
                    </p>
                  </div>
                  <ScrollArea className="h-[350px] px-6">
                    <div className="space-y-2 pb-4">
                      {filteredBookings.map((booking, index) => {
                        const IconComponent = Calendar
                        return (
                          <div
                            key={index}
                            className="bg-white rounded-lg overflow-hidden flex items-start gap-3 hover:bg-gray-50 transition-colors relative border border-gray-200 shadow-sm"
                            style={{
                              borderLeft: `4px solid ${getBorderColor(booking.color)}`,
                              borderRadius: "8px",
                            }}
                          >
                            <div className="flex items-start gap-3 p-3 w-full">
                              <div
                                className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0"
                                style={{ backgroundColor: getBgColor(booking.color) }}
                              >
                                <IconComponent className="h-4 w-4" style={{ color: getTextColor(booking.color) }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-gray-900">{booking.name}</h3>
                                <p className="text-xs text-gray-600 mt-0.5">{booking.service}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{booking.duration}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                                    style={{
                                      backgroundColor: getBgColor(booking.color),
                                      color: getTextColor(booking.color),
                                    }}
                                  >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </main>
    </div>
  )
}


// // src\app\dashboard\page.tsx
// "use client"

// import { useState, useMemo } from "react"
// import { Bell, Calendar, CreditCard, DollarSign, Users, Clock, SlidersHorizontal } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"
// import { todaysBookings } from "@/components/constant/bookings"
// import { notifications } from "@/components/constant/notifications"
// import { NotificationFilter } from "@/components/notification-filter/notification-filter"
// import { filterCategories, getNotificationType, type FilterCategory } from "@/components/constant/notification-filters"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// const iconMap = { Calendar, CreditCard, Users, Bell }

// // Color mapping helper function
// const getColorClasses = (color: string) => {
//   switch (color) {
//     case "red":
//       return {
//         bg: "bg-red-100",
//         text: "text-red-500",
//         border: "border-l-red-500",
//       }
//     case "green":
//       return {
//         bg: "bg-green-100",
//         text: "text-green-500",
//         border: "border-l-green-500",
//       }
//     case "blue":
//       return {
//         bg: "bg-blue-100",
//         text: "text-blue-500",
//         border: "border-l-blue-500",
//       }
//     case "orange":
//       return {
//         bg: "bg-orange-100",
//         text: "text-orange-500",
//         border: "border-l-orange-500",
//       }
//     case "purple":
//       return {
//         bg: "bg-purple-100",
//         text: "text-purple-500",
//         border: "border-l-purple-500",
//       }
//     case "teal":
//       return {
//         bg: "bg-teal-100",
//         text: "text-teal-500",
//         border: "border-l-teal-500",
//       }
//     case "yellow":
//       return {
//         bg: "bg-yellow-100",
//         text: "text-yellow-500",
//         border: "border-l-yellow-500",
//       }
//     default:
//       return {
//         bg: "bg-gray-100",
//         text: "text-gray-500",
//         border: "border-l-gray-500",
//       }
//   }
// }

// export default function DashboardPage() {
//   const [isFilterOpen, setIsFilterOpen] = useState(false)
//   const [filters, setFilters] = useState<FilterCategory[]>(filterCategories)

//   const [bookingFilters, setBookingFilters] = useState({
//     service: "all",
//     status: "all",
//     timeSlot: "all",
//   })

//   // Handle filter changes
//   const handleFilterChange = (categoryTitle: string, optionId: string, checked: boolean) => {
//     setFilters((prevFilters) =>
//       prevFilters.map((category) =>
//         category.title === categoryTitle
//           ? {
//               ...category,
//               options: category.options.map((option) => (option.id === optionId ? { ...option, checked } : option)),
//             }
//           : category,
//       ),
//     )
//   }

//   // Filter notifications based on selected filters
//   const filteredNotifications = useMemo(() => {
//     const typeFilters =
//       filters
//         .find((f) => f.title === "Type")
//         ?.options.filter((o) => o.checked)
//         .map((o) => o.label) || []
//     const statusFilters =
//       filters
//         .find((f) => f.title === "Status")
//         ?.options.filter((o) => o.checked)
//         .map((o) => o.label) || []

//     return notifications.filter((notification) => {
//       const notificationType = getNotificationType(notification)
//       const notificationStatus = notification.badge ? "Unread" : "Read"

//       return typeFilters.includes(notificationType) && statusFilters.includes(notificationStatus)
//     })
//   }, [filters])

//   // Helper function to categorize time slots
//   const getTimeSlot = (time: string) => {
//     const [timePart, period] = time.split(' ');
//     const hour = parseInt(timePart.split(':')[0]);
//     const isPM = period === 'PM';

//     let hour24 = hour;
//     if (isPM && hour !== 12) {
//       hour24 = hour + 12;
//     } else if (!isPM && hour === 12) {
//       hour24 = 0;
//     }

//     if (hour24 < 12) return "morning";
//     if (hour24 < 17) return "afternoon";
//     return "evening";
//   }

//   // Filter bookings based on selected filters
//   const filteredBookings = useMemo(() => {
//     return todaysBookings.filter((booking) => {
//       const serviceMatch =
//         bookingFilters.service === "all" || 
//         booking.service === bookingFilters.service;

//       const statusMatch =
//         bookingFilters.status === "all" || 
//         booking.status.toLowerCase() === bookingFilters.status.toLowerCase();

//       const timeMatch = 
//         bookingFilters.timeSlot === "all" || 
//         getTimeSlot(booking.time) === bookingFilters.timeSlot;

//       return serviceMatch && statusMatch && timeMatch;
//     })
//   }, [bookingFilters])

//   // Handle booking filter changes
//   const handleBookingFilterChange = (filterType: string, value: string) => {
//     setBookingFilters((prev) => ({
//       ...prev,
//       [filterType]: value,
//     }))
//   }

//   // Get unique services for filter options
//   const uniqueServices = [...new Set(todaysBookings.map(booking => booking.service))];

//   // Count active filters
//   const activeFiltersCount = filters.reduce(
//     (count, category) => count + category.options.filter((option) => !option.checked).length,
//     0,
//   )

//   return (
//     <div className="flex-1 overflow-hidden">
//       <header className="flex h-16 items-end justify-between border-2 ml-3 mr-2 rounded-[12px] bg-white px-4 pb-4">
//         <h1 className="text-2xl font-semibold">Dashboard</h1>
//         <button className="rounded-full bg-gray-100 p-2">
//           <Bell className="h-5 w-5" />
//         </button>
//       </header>

//       <main className="p-3 h-full overflow-hidden">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
//           <div className="rounded-lg border bg-white p-4 shadow-sm">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">Upcoming bookings</h2>
//               <Calendar className="h-5 w-5 text-gray-400" />
//             </div>
//             <p className="mt-2 text-2xl font-bold">12</p>
//             <p className="text-sm text-gray-500">+2 from yesterday</p>
//           </div>

//           <div className="rounded-lg border bg-white p-4 shadow-sm">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">Pending Payments</h2>
//               <CreditCard className="h-5 w-5 text-gray-400" />
//             </div>
//             <p className="mt-2 text-2xl font-bold">$ 2,350</p>
//             <p className="text-sm text-gray-500">3 payments awaiting</p>
//           </div>

//           <div className="rounded-lg border bg-white p-4 shadow-sm">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">Total Revenue</h2>
//               <DollarSign className="h-5 w-5 text-gray-400" />
//             </div>
//             <p className="mt-2 text-2xl font-bold">$ 12,234</p>
//             <p className="text-sm text-gray-500">+8% from last month</p>
//           </div>
//         </div>

//         {/* Tabs Section */}
//         <div className="space-y-4 h-full ">
//           <Tabs defaultValue="notifications">
//             <TabsList className="grid grid-cols-2 w-[400px] bg-gray-200  h-12 rounded-lg">
//               <TabsTrigger value="notifications" className="flex items-center h-11 font-bold">
//                 Notifications
//                 <div className="ml-2 flex items-center justify-center w-5 h-5 text-white bg-red-500 border-2 border-red-500 rounded-full text-xs font-semibold">
//                   {filteredNotifications.length}
//                 </div>
//               </TabsTrigger>
//               <TabsTrigger value="bookings" className="flex items-center h-11 font-bold">
//                 {"Today's Bookings"}
//                 <div className="ml-2 flex items-center justify-center w-5 h-5 bg-black text-white border-2 border-black rounded-full text-xs font-semibold">
//                   {filteredBookings.length}
//                 </div>
//               </TabsTrigger>
//             </TabsList>

//             <Card className="h-full">
//               <CardHeader>
//                 <CardTitle className="text-xl flex items-center justify-between">
//                   Recent Activity
//                   <div className="relative">
//                     <button
//                       onClick={() => setIsFilterOpen(!isFilterOpen)}
//                       className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
//                     >
//                       <SlidersHorizontal className="h-4 w-4" />
//                       {activeFiltersCount > 0 && (
//                         <Badge
//                           variant="secondary"
//                           className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
//                         >
//                           {activeFiltersCount}
//                         </Badge>
//                       )}
//                     </button>
//                     <NotificationFilter isOpen={isFilterOpen} onFilterChange={handleFilterChange} filters={filters} />
//                   </div>
//                 </CardTitle>
//               </CardHeader>

//               <CardContent>
//                 {/* Notifications */}
//                 <TabsContent value="notifications" className="h-full m-0 ">
//                   <div className="px-6 pb-2">
//                     <p className="text-sm text-muted-foreground">
//                       Showing {filteredNotifications.length} of {notifications.length} notifications
//                     </p>
//                   </div>
//                   <ScrollArea className="h-[800px] px-6">
//                     <div className="space-y-2">
//                       {filteredNotifications.map((notification, index) => {
//                         const Icon = iconMap[notification.icon]
//                         const colorClasses = getColorClasses(notification.color)

//                         return (
//                           <Card
//                             key={index}
//                             className={`h-[80px] flex justify-center border-l-4 ${colorClasses.border}`}
//                           >
//                             <CardContent className="px-4">
//                               <div className="flex items-start justify-between">
//                                 <div className="flex gap-2">
//                                   <div
//                                     className={`flex h-8 w-8 items-center justify-center rounded-full ${colorClasses.bg}`}
//                                   >
//                                     <Icon className={`h-4 w-4 ${colorClasses.text}`} />
//                                   </div>
//                                   <div className="space-y-0.5">
//                                     <h3 className="font-medium text-sm">{notification.title}</h3>
//                                     <p className="text-xs text-muted-foreground">{notification.message}</p>
//                                     <p className="text-xs text-muted-foreground">{notification.time}</p>
//                                   </div>
//                                 </div>
//                                 {notification.badge && <Badge className="text-xs my-auto">{notification.badge}</Badge>}
//                               </div>
//                             </CardContent>
//                           </Card>
//                         )
//                       })}
//                     </div>
//                   </ScrollArea>
//                 </TabsContent>

//                 {/* Today's Bookings */}
//                 <TabsContent value="bookings" className="h-full m-0">
//                   <div className="px-6 pb-4 space-y-4">
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm text-muted-foreground">
//                         Showing {filteredBookings.length} of {todaysBookings.length} bookings scheduled for today
//                       </p>

//                       {/* Booking Filters */}
//                       <div className="flex gap-2">
//                         <Select
//                           value={bookingFilters.service}
//                           onValueChange={(value: string) => handleBookingFilterChange("service", value)}
//                         >
//                           <SelectTrigger className="w-[180px] h-8">
//                             <SelectValue placeholder="Service" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="all">All Services</SelectItem>
//                             {uniqueServices.map(service => (
//                               <SelectItem key={service} value={service}>
//                                 {service}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>

//                         <Select
//                           value={bookingFilters.status}
//                           onValueChange={(value: string) => handleBookingFilterChange("status", value)}
//                         >
//                           <SelectTrigger className="w-[120px] h-8">
//                           <SelectValue placeholder="Status" />
//                           </SelectTrigger>
//                           <SelectContent>
//                           <SelectItem value="all">All Status</SelectItem>
//                           <SelectItem value="confirmed">Confirmed</SelectItem>
//                           <SelectItem value="pending">Pending</SelectItem>
//                           </SelectContent>
//                         </Select>

//                         <Select
//                           value={bookingFilters.timeSlot}
//                           onValueChange={(value: string) => handleBookingFilterChange("timeSlot", value)}
//                         >
//                           <SelectTrigger className="w-[120px] h-8">
//                           <SelectValue placeholder="Time" />
//                           </SelectTrigger>
//                           <SelectContent>
//                           <SelectItem value="all">All Times</SelectItem>
//                           <SelectItem value="morning">Morning</SelectItem>
//                           <SelectItem value="afternoon">Afternoon</SelectItem>
//                           <SelectItem value="evening">Evening</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                   </div>

//                   <ScrollArea className="h-[350px] px-6">
//                     <div className="space-y-2 pb-4">
//                       {filteredBookings.length === 0 ? (
//                         <div className="text-center py-8 text-muted-foreground">
//                           <p>No bookings match the selected filters</p>
//                         </div>
//                       ) : (
//                         filteredBookings.map((booking, index) => {
//                           const colorClasses = getColorClasses(booking.color)

//                           return (
//                             <Card
//                               key={index}
//                               className={`h-[80px] flex justify-center border-l-4 ${colorClasses.border}`}
//                             >
//                               <CardContent className="p-3">
//                                 <div className="flex items-start justify-between">
//                                   <div className="flex gap-2">
//                                     <div
//                                       className={`flex h-8 w-8 items-center justify-center rounded-full ${colorClasses.bg}`}
//                                     >
//                                       <Clock className={`h-4 w-4 ${colorClasses.text}`} />
//                                     </div>
//                                     <div className="space-y-0.5">
//                                       <h3 className="font-medium text-sm">{booking.name}</h3>
//                                       <p className="text-xs text-muted-foreground">
//                                         {`${booking.service} - ${booking.time}`}
//                                       </p>
//                                       <p className="text-xs text-muted-foreground">Duration: {booking.duration}</p>
//                                     </div>
//                                   </div>
//                                   <div className="flex flex-col items-end gap-1">
//                                     <Badge
//                                       variant={booking.status === "Pending" ? "outline" : "secondary"}
//                                       className="text-xs"
//                                     >
//                                       {booking.status}
//                                     </Badge>
//                                     <span className="text-xs text-muted-foreground capitalize">
//                                       {getTimeSlot(booking.time)}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           )
//                         })
//                       )}
//                     </div>
//                   </ScrollArea>
//                 </TabsContent>
//               </CardContent>
//             </Card>
//           </Tabs>
//         </div>
//       </main>
//     </div>
//   )
// }









