import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/adminDashboard-ui/Card";
import axios from "axios";

const BACKEND_URL = "http://localhost:8080";

const HOURS = ["08", "09", "10", "11", "12", "13", "14", "15"];

const AnimalTimeActivityChart = ({ selectedAnimal }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHourlySightings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BACKEND_URL}/api/sightings/time-distribution?animal=${selectedAnimal}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const sightings = Array.isArray(res.data) ? res.data : [];

        const hourlyCount = HOURS.reduce((acc, hour) => {
          acc[hour] = 0;
          return acc;
        }, {});

        sightings.forEach((entry) => {
          const hour = new Date(entry.dateTime)
            .getHours()
            .toString()
            .padStart(2, "0");
          if (HOURS.includes(hour)) {
            hourlyCount[hour]++;
          }
        });

        const chartData = HOURS.map((hour) => ({
          hour: `${hour}:00`,
          sightings: hourlyCount[hour],
        }));

        setHourlyData(chartData);
      } catch (err) {
        console.error("Failed to fetch hourly sightings", err);
        setHourlyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHourlySightings();
  }, [selectedAnimal]);

  const recommendationText = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return "";

    const peak = [...hourlyData].sort((a, b) => b.sightings - a.sightings)[0];
    if (!peak || peak.sightings === 0)
      return `No significant sightings for ${selectedAnimal} during park hours.`;

    const formattedAnimal =
      selectedAnimal.charAt(0).toUpperCase() + selectedAnimal.slice(1);
    return `According to data from the last 30 days, ${formattedAnimal}s are most likely to be spotted around ${peak.hour}. Adjest your visit accordingly for the best chance of seeing them.`;
  }, [hourlyData, selectedAnimal]);

  return (
    <Card className="mt-6 bg-gradient-to-br from-safari-teal/5 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-safari-forest text-sm font-semibold">
          Time-of-Day Activity for{" "}
          {selectedAnimal.charAt(0).toUpperCase() + selectedAnimal.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="text-gray-500 text-sm">Loading chart...</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="sightings" fill="#347358" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {recommendationText && (
              <div className="mt-4 p-4 border border-safari-teal rounded-xl text-safari-forest bg-white shadow-sm text-sm font-semibold">
              {recommendationText}
            </div>
            
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimalTimeActivityChart;
