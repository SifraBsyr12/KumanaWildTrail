import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/adminDashboard-ui/Card";
import { Button } from "@/components/ui/adminDashboard-ui/Button";
import { RefreshCwIcon } from "lucide-react";
import { Calendar } from "@/components/ui/adminDashboard-ui/Calendar";
import SpeciesSelection from "./SummeryComponets/SpeciesSelection";
import SummaryCards from "./SummeryComponets/SummaryCards";
import DataTable from "./SummeryComponets/DataTable";
import Recommendations from "./SummeryComponets/Recommendations";
import { formatDate } from "./SummeryComponets/utils";
import AnimalTimeActivityChart from "./SummeryComponets/AnimalTimeActivityChart";

const token = localStorage.getItem("token");
const BACKEND_URL = "http://localhost:8080";

const SightingSummary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedAnimal, setSelectedAnimal] = useState("leopard");
  const [sightingsData, setSightingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hotspots, setHotspots] = useState({});
  const [viewMode, setViewMode] = useState("month");
  const [daysWithData, setDaysWithData] = useState([]);

  // Data fetching function
  const fetchData = useCallback(
    async (url, setData) => {
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(response.data) ? response.data : [];
        setData(data);
        return data;
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
        setData([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Fetch last 30 days data
  useEffect(() => {
    fetchData(
      `${BACKEND_URL}/api/sightings/last-30-days`,
      setSightingsData
    ).then((data) => {
      if (data.length > 0) {
        const latestDate = new Date(data[data.length - 1].date);
        setSelectedDate(latestDate);
        setSelectedMonth(
          new Date(latestDate.getFullYear(), latestDate.getMonth(), 1)
        );
      }
    });
  }, [fetchData]);

  // Fetch month data
  useEffect(() => {
    fetchData(
      `${BACKEND_URL}/api/sightings/month?year=${selectedMonth.getFullYear()}&month=${
        selectedMonth.getMonth() + 1
      }`,
      setSightingsData
    );
  }, [selectedMonth, fetchData]);

  // Data normalization
  const normalizedData = useMemo(() => {
    return sightingsData
      .filter(
        (entry) => entry && entry.date && entry.animals && entry.locations
      )
      .map((entry) => ({
        date: new Date(entry.date),
        animals: {
          elephant: entry.animals?.elephant || 0,
          leopard: entry.animals?.leopard || entry.animals?.tiger || 0,
          bear: entry.animals?.bear || entry.animals?.["sloth bear"] || 0,
        },
        locations: {
          elephant: entry.locations?.elephant || {
            lat: null,
            lon: null,
            name: "No sightings",
          },
          leopard: entry.locations?.leopard ||
            entry.locations?.tiger || {
              lat: null,
              lon: null,
              name: "No sightings",
            },
          bear: entry.locations?.bear ||
            entry.locations?.["sloth bear"] || {
              lat: null,
              lon: null,
              name: "No sightings",
            },
        },
      }));
  }, [sightingsData]);

  // Track days with data
  useEffect(() => {
    if (normalizedData.length > 0) {
      const days = normalizedData.map(
        (entry) =>
          new Date(
            entry.date.getFullYear(),
            entry.date.getMonth(),
            entry.date.getDate()
          )
      );
      setDaysWithData(days);
    }
  }, [normalizedData]);

  // Date and month handlers
  const handleDateSelect = useCallback(
    (date) => {
      if (!date) return;

      const hasData = daysWithData.some(
        (day) =>
          day.getDate() === date.getDate() &&
          day.getMonth() === date.getMonth() &&
          day.getFullYear() === date.getFullYear()
      );

      if (hasData) {
        setSelectedDate(date);
        setViewMode("day");
      }
    },
    [daysWithData]
  );

  const handleMonthSelect = useCallback((month) => {
    setSelectedMonth(month);
    setViewMode("month");
  }, []);

  // Data filtering
  const filteredData = useMemo(() => {
    return viewMode === "month"
      ? normalizedData.filter(
          (entry) =>
            entry.date.getFullYear() === selectedMonth.getFullYear() &&
            entry.date.getMonth() === selectedMonth.getMonth()
        )
      : normalizedData.filter(
          (entry) => entry.date.toDateString() === selectedDate.toDateString()
        );
  }, [normalizedData, viewMode, selectedMonth, selectedDate]);

  // Calculations
  const { totalSightings, averageSightings, maxSightings, peakDay } =
    useMemo(() => {
      const total = filteredData.reduce(
        (sum, day) => sum + day.animals[selectedAnimal],
        0
      );
      const avg = filteredData.length
        ? (total / filteredData.length).toFixed(1)
        : 0;
      const max = filteredData.length
        ? Math.max(...filteredData.map((day) => day.animals[selectedAnimal]))
        : 0;
      const peak = filteredData.find(
        (day) => day.animals[selectedAnimal] === max
      );

      return {
        totalSightings: total,
        averageSightings: avg,
        maxSightings: max,
        peakDay: peak,
      };
    }, [filteredData, selectedAnimal]);

  // Available months calculation
  const availableMonths = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 11,
      1
    );
    const months = [];
    for (
      let date = new Date(currentMonth);
      date >= startDate;
      date.setMonth(date.getMonth() - 1)
    ) {
      months.push(new Date(date));
    }
    return months.sort((a, b) => b - a);
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    fetchData(
      viewMode === "month"
        ? `${BACKEND_URL}/api/sightings/month?year=${selectedMonth.getFullYear()}&month=${
            selectedMonth.getMonth() + 1
          }`
        : `${BACKEND_URL}/api/sightings/last-30-days`, setSightingsData);
  }, [fetchData, viewMode, selectedMonth]);

  // Loading and error states
  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-safari-teal/5 to-white">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">Loading data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-safari-teal/5 to-white">
        <CardContent className="p-6 text-center">
          <div className="text-red-500">{error}</div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleRefresh}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!loading && !error && normalizedData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-safari-teal/5 to-white">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">No sighting data available.</div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-safari-teal/5 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="font-playfair text-lg font-bold text-safari-forest flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <span>Wildlife Sighting Dashboard</span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-white hover:bg-gray-50"
            onClick={handleRefresh}
          >
            <RefreshCwIcon className="h-3.5 w-3.5 mr-1" />
            Refresh Data
          </Button>
        </CardTitle>
        <CardDescription>
          Comprehensive wildlife tracking with location mapping and trend
          analysis
          <b>
            {" "}
            (
            {viewMode === "month"
              ? "Monthly View"
              : `Daily View - ${formatDate(selectedDate)}`}
            )
          </b>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SpeciesSelection
          selectedAnimal={selectedAnimal}
          setSelectedAnimal={setSelectedAnimal}
          filteredData={filteredData}
        />

        <SummaryCards
          totalSightings={totalSightings}
          averageSightings={averageSightings}
          maxSightings={maxSightings}
          peakDay={peakDay}
          hotspots={hotspots}
          setHotspots={setHotspots}
          selectedAnimal={selectedAnimal}
          selectedMonth={selectedMonth}
          viewMode={viewMode}
          selectedDate={selectedDate}
        />

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <Card className="bg-gradient-to-br from-safari-teal/5 to-white">
              <CardContent className="p-4">
                <Calendar
                  selected={viewMode === "day" ? selectedDate : undefined}
                  onSelect={handleDateSelect}
                  daysWithData={daysWithData}
                  mode="single"
                  defaultMonth={selectedMonth}
                  onMonthChange={handleMonthSelect}
                  className="rounded-md"
                />
                {viewMode === "day" && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setViewMode("month")}
                  >
                    Show Full Month
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-500">
                  {selectedAnimal.charAt(0).toUpperCase() +
                    selectedAnimal.slice(1)}{" "}
                  Analysis
                </h3>
              </div>
              <select
                className="border rounded text-sm px-2 py-1 bg-white hover:bg-gray-50"
                value={selectedAnimal}
                onChange={(e) => setSelectedAnimal(e.target.value)}
              >
                {["elephant", "leopard", "bear"].map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <DataTable
              filteredData={filteredData}
              totalSightings={totalSightings}
              selectedAnimal={selectedAnimal}
              viewMode={viewMode}
            />
            {/* <Recommendations
              peakDay={peakDay}
              selectedAnimal={selectedAnimal}
              viewMode={viewMode}
              selectedDate={selectedDate}
            /> */}

            <AnimalTimeActivityChart selectedAnimal={selectedAnimal} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SightingSummary;
