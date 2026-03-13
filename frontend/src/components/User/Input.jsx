
function Input({ value, onChange, placeholder, type , className="" , name="" }) {
  return (
    <input
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
     className={` ${className}`}
    />
  );
}
export default Input;
