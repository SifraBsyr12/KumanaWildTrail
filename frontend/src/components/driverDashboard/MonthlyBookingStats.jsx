// Updated component with pie chart & calendar + stats layout side-by-side
import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = {
  accepted: '#10B981', // emerald-500
  pending: '#F59E0B',  // amber-500
  rejected: '#EF4444', // red-500
};

export default function MonthlyBookingStats({ bookings, calendarComponent }) {
  const stats = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const monthlyBookings = bookings.filter(b => new Date(b.date).getMonth() === thisMonth);

    const count = { accepted: 0, pending: 0, rejected: 0 };
    const tourCount = {};

    monthlyBookings.forEach(b => {
      count[b.status] = (count[b.status] || 0) + 1;
      tourCount[b.tourType] = (tourCount[b.tourType] || 0) + 1;
    });

    const mostBookedTour = Object.entries(tourCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      total: monthlyBookings.length,
      breakdown: [
        { name: 'Accepted', value: count.accepted, color: COLORS.accepted },
        { name: 'Pending', value: count.pending, color: COLORS.pending },
        { name: 'Rejected', value: count.rejected, color: COLORS.rejected },
      ],
      mostBookedTour,
    };
  }, [bookings]);

  return (
    <div className="bg-white p-6  rounded-xl ">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Monthly Booking Overview</h3>

      <div className="grid grid-cols-1 gap-6">
        {/* Calendar (if passed as a prop) */}
        <div>
          {calendarComponent}
        </div>

        {/* Stats Summary + Pie Chart */}
        <div className="flex flex-col justify-center items-center space-y-6">
          <div className="grid grid-cols-3 gap-4 w-full text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-gray-600 text-sm">Total</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-green-600">{stats.breakdown[0].value}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-yellow-500">{stats.breakdown[1].value}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>

          <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.breakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-500">Most Booked Tour</div>
            <div className="text-lg font-semibold text-gray-800">{stats.mostBookedTour}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
