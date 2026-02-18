import axios from "axios";

const BACKEND_URL = "http://localhost:8080";

export const fetchAnimalHotspots = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BACKEND_URL}/api/sightings/hotspots`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching animal hotspots:", error);
    return [];
  }
};

export const getAnimalIcon = (type) => {
  switch (type) {
    case "elephant":
      return "🐘";
    case "leopard":
      return "🐆";
    case "bear":
      return "🐻";
    default:
      return "🦓";
  }
};

export const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

export const formatMonth = (date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);