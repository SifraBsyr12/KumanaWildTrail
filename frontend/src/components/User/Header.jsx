import Button from "./Button";
import {Link} from "react-router-dom";


const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* Text Section */}
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-[black]">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-600">
          Your safari adventures await
        </p>
      </div>

      {/* CTA Button */}
   <Link to="/makebooking">  <Button 
      
        label="Make a Booking"
        className="bg-[#4D7C0F] text-white px-4 py-2 rounded-md hover:bg-green-800 text-sm sm:text-base transition-all duration-200"
      /> </Link> 
    </div>
  );
};

export default Header;
