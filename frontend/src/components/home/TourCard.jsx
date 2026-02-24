import { Clock, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ Added this line

export default function TourCard({ image, title, time, duration, maxPeople }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Safari+Image';
          }}
        />
      </div>

      <div className="p-4 font-aref">
        <h3 className="text-center font-serif text-lg font-medium text-safari-charcoal mb-2">
          {title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-center text-sm text-safari-charcoal">
            <Clock size={16} className="mr-2 text-safari-green" />
            <span>{time}</span>
          </div>

          <div className="flex items-center justify-center text-sm text-safari-charcoal">
            <Calendar size={16} className="mr-2 text-safari-green" />
            <span>{duration}</span>
          </div>

          <div className="flex items-center justify-center text-sm text-safari-charcoal">
            <Users size={16} className="mr-2 text-safari-green" />
            <span>{maxPeople} Max</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link 
            to="/#contact" 
            className="font-aref bg-safari-green text-[#0D722A] px-4 py-1.5 rounded-full text-xs font-medium hover:bg-safari-light-green transition-colors w-full text-center"
          >
            Book Now &gt;&gt;&gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
