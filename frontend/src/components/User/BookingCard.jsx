// Components/UI/BookingCard.jsx
const colorMap = {
  
};

const BookingCard = ({
  date,
  time,
  status,
  driver,
  color = "white",
  badge,
  buttonLabel,
}) => {
  const bgColorClass = colorMap[color] || "bg-[#F8F8F1]";

  return (
    <div className={`${bgColorClass} rounded-xl shadow-md p-4 sm:p-6 w-full`}>
      <div className="bg-[#E7ECDA] p-4 mb-4 mr-0" >    
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          Safari Booking
        </h2>
        <span className={`text-xs sm:text-sm px-2 py-1 rounded ${badge}`}>
          {status}
        </span>
      </div>

      <p className="text-sm text-gray-600">{date}</p>
     </div>
      <p className="text-sm mt-2">
        <span className="font-semibold">Time Slot:</span> {time}
      </p>

      {driver && (
        <p className="text-sm mt-1">
          <span className="font-semibold">Driver:</span> {driver}
        </p>
      )}

      {buttonLabel && (
        <button className="mt-4 bg-orange-500 text-white w-full py-2 rounded-md hover:bg-orange-600 transition duration-200 text-sm sm:text-base">
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default BookingCard;
