import { LucideArrowBigLeft } from "lucide-react";

function Button({ label, onClick, className=""}) {
  return (
    <>
      <button onClick={onClick} className={` ${className}`}>{label}</button>
    </>
  );
}

export default Button