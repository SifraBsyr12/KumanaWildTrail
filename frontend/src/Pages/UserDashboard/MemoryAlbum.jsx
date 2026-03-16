import { useRef } from "react";
import Button from "../components/User/Button";

const MemoryAlbum = () => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files);
    // You can add file handling logic here
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    console.log("Dropped files:", droppedFiles);
    // You can also handle dropped files here
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return ( <>  
     
    


    <div className="bg-[#edf1e0] rounded-xl shadow-md p-4 sm:p-6 w-full ml-4">
      
      <div className="ml-1 mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-[black] ">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-600">
          Your safari adventures await
        </p>
      </div>
      <h2 className="text-base sm:text-lg font-semibold mb-1">📸 Memory Album</h2>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        Create and share your safari memories
      </p>

      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="cursor-pointer border-2 border-dashed border-gray-400 rounded-md p-6 sm:p-8 text-center mb-4 bg-white/50 transition-colors hover:bg-white"
      >
        <p className="text-gray-500 text-sm sm:text-base">
          Drag & drop photos here, or click to select
        </p>
        <span className="text-xs text-gray-400 block mt-1">
          Upload up to 10 photos (max 5MB each)
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Button */}
      <Button
        label="Generate Memory"
        className="bg-[#A2BA80] text-white w-full py-2 rounded-md hover:bg-green-700 text-sm sm:text-base transition-all duration-200"
      />
    </div>
     </>
  );
};

export default MemoryAlbum;
