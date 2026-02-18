import { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';


const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const token = localStorage.getItem("token") ;

export default function AdminAddDriverForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    vehicleType: "",
    seatingCapacity: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        vehicleType: form.vehicleType,
        seatingCapacity: parseInt(form.seatingCapacity),
      };
  
      console.log("Sending payload:", payload);
  
      await axios.post(
        `${BASE_URL}/api/admin/register-driver`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      toast.success("Driver added successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        vehicleType: "",
        seatingCapacity: ""
      });
    } catch (err) {
      toast.error("Failed to add driver or email already exists.");
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-10"
    >
      <h2 className="text-xl font-bold mb-4">Add Driver</h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold">Password (Set by Admin)</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
          minLength={6}
        />
      </div>

      {/* Vehicle Type */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold">
          Vehicle Type (Description)
        </label>
        <input
          type="text"
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g., 4x4 Jeep"
          required
        />
      </div>

      {/* Seating Capacity */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold">Seating Capacity</label>
        <input
          type="number"
          name="seatingCapacity"
          value={form.seatingCapacity}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g., 6"
          required
          min={1}
          max={50}
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit
      </button>
    </form>
  );
}
