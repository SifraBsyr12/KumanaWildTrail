import { useEffect, useState } from 'react'

function BookingCard({ booking, onAccept, onReject, showActions }) {
  return (
    <div className="p-1 rounded-lg border hover:bg-gray-50 mb-1">
      <div className="flex">
        <div className="text-2xl mr-2">📅</div>
        <div className="w-full">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#264653] text-sm">
              {booking.date} — <span className="text-indigo-600">{booking.timeSlot}</span>
            </h3>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                booking.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : booking.status === 'accepted'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-0.5">
            <span className="font-semibold">Customer:</span> {booking.customerName}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Participants:</span> {booking.participants}
          </p>

          {showActions && (
            <div className="flex space-x-1.5 mt-1.5">
              <button
                onClick={onAccept}
                className="flex-1 py-1 bg-[#2a9d8f] hover:bg-[#2a9d8f]/90 text-white text-sm font-semibold rounded"
              >
                Accept
              </button>
              <button
                onClick={onReject}
                className="flex-1 py-1 bg-[#e76f51] hover:bg-[#e76f51]/90 text-white text-sm font-semibold rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DriverBookingDashboard() {
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        date: '2025-06-01',
        timeSlot: '6:00 AM - 9:00 AM',
        customerName: 'John Silva',
        participants: 3,
        status: 'pending',
      },
      {
        id: 2,
        date: '2025-06-02',
        timeSlot: '2:00 PM - 5:00 PM',
        customerName: 'Nimali Perera',
        participants: 4,
        status: 'accepted',
      },
      {
        id: 3,
        date: '2025-06-04',
        timeSlot: '10:00 AM - 1:00 PM',
        customerName: 'Arun Raj',
        participants: 2,
        status: 'pending',
      },
      {
        id: 4,
        date: '2025-06-05',
        timeSlot: '7:00 AM - 10:00 AM',
        customerName: 'Saman Perera',
        participants: 5,
        status: 'pending',
      },
      {
        id: 5,
        date: '2025-06-06',
        timeSlot: '3:00 PM - 6:00 PM',
        customerName: 'Priya Fernando',
        participants: 2,
        status: 'accepted',
      },
      {
        id: 6,
        date: '2025-06-07',
        timeSlot: '11:00 AM - 2:00 PM',
        customerName: 'David Johnson',
        participants: 4,
        status: 'pending',
      },
      {
        id: 7,
        date: '2025-06-08',
        timeSlot: '8:00 AM - 11:00 AM',
        customerName: 'Lisa Chen',
        participants: 3,
        status: 'pending',
      },
      {
        id: 8,
        date: '2025-06-09',
        timeSlot: '4:00 PM - 7:00 PM',
        customerName: 'Mohammed Ali',
        participants: 6,
        status: 'accepted',
      },
    ]
    setBookings(dummyData)
  }, [])

  const handleAccept = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'accepted' } : b))
    )
  }

  const handleReject = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'rejected' } : b))
    )
  }

  const filtered = bookings.filter((b) =>
    activeTab === 'pending'
      ? b.status === 'pending'
      : activeTab === 'accepted'
      ? b.status === 'accepted'
      : b.status !== 'rejected'
  )

  return (
    <div className="scrollbar-hide bg-gray-50 p-1">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h1 className="text-xl font-serif font-semibold text-[#264653] mb-3">
            My Bookings
          </h1>
          
          <div className="scrollbar-hide flex space-x-2 mb-3">
            {['pending', 'accepted', 'all'].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded ${
                  activeTab === tab
                    ? 'bg-[#264653] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              No bookings to show.
            </div>
          ) : (
            <div className="h-[400px] rounded-md border overflow-auto scrollbar-hide p-1">
              {filtered.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onAccept={() => handleAccept(booking.id)}
                  onReject={() => handleReject(booking.id)}
                  showActions={booking.status === 'pending' && activeTab === 'pending'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}