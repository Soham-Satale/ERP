import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from "recharts";

import API from "../api";

export default function Forecast() {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/forecast/expense`, { headers });
      setForecast(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const trendColor = {
    increasing: "#A8453B",
    decreasing: "#4A7C59",
    stable: "#B8860B",
  };

  const chartData = forecast
    ? [
        ...forecast.history,
        {
          month: "Next",
          expense: null,
          predicted: forecast.predictedNextMonth,
        },
      ]
    : [];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A1A18" }}>
          Forecast
        </h1>
        <p className="text-sm font-normal mt-0.5" style={{ color: "#8A8780" }}>
          AI-powered expense prediction based on last 6 months
        </p>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: "#8A8780" }}>Loading forecast...</p>
      ) : forecast ? (
        <>
          {/* Top cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div
              className="px-5 py-4 transition-all duration-150"
              style={{
                border: "1px solid #E5E3DD",
                borderTop: "2px solid #B8860B",
                borderRadius: "8px",
                background: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(26,26,24,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p className="text-xs font-medium" style={{ color: "#8A8780" }}>
                Predicted Next Month
              </p>
              <p className="text-2xl font-bold mt-1 tracking-tight" style={{ color: "#1A1A18" }}>
                ₹{forecast.predictedNextMonth.toLocaleString("en-IN")}
              </p>
            </div>

            <div
              className="px-5 py-4 transition-all duration-150"
              style={{
                border: "1px solid #E5E3DD",
                borderTop: `2px solid ${trendColor[forecast.trend]}`,
                borderRadius: "8px",
                background: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(26,26,24,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p className="text-xs font-medium" style={{ color: "#8A8780" }}>
                Trend
              </p>
              <p
                className="text-2xl font-bold mt-1 tracking-tight capitalize"
                style={{ color: trendColor[forecast.trend] }}
              >
                {forecast.trend}
              </p>
            </div>

            <div
              className="px-5 py-4 transition-all duration-150"
              style={{
                border: "1px solid #E5E3DD",
                borderTop: "2px solid #3D5A80",
                borderRadius: "8px",
                background: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(26,26,24,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p className="text-xs font-medium" style={{ color: "#8A8780" }}>
                Based On
              </p>
              <p className="text-2xl font-bold mt-1 tracking-tight" style={{ color: "#1A1A18" }}>
                {forecast.basedOnMonths} months
              </p>
            </div>
          </div>

          {/* Chart */}
          <div
            className="mb-6 p-5"
            style={{ border: "1px solid #E5E3DD", borderRadius: "8px", background: "#FFFFFF" }}
          >
            <p className="text-sm font-semibold mb-4" style={{ color: "#1A1A18" }}>
              Expense History + Prediction
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#8A8780" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#8A8780" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #E5E3DD",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                  formatter={(value) =>
                    value ? `₹${Number(value).toLocaleString("en-IN")}` : null
                  }
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <ReferenceLine x="Next" stroke="#E5E3DD" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#A8453B"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#A8453B" }}
                  name="Actual Expense"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#B8860B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 5, fill: "#B8860B" }}
                  name="Predicted"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insight */}
          <div
            className="p-5"
            style={{
              border: "1px solid #E5E3DD",
              borderLeft: "3px solid #B8860B",
              borderRadius: "8px",
              background: "#FFFFFF",
            }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: "#B8860B" }}>
              AI INSIGHT
            </p>
            <p className="text-sm font-medium leading-relaxed" style={{ color: "#1A1A18" }}>
              {forecast.aiInsight}
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm" style={{ color: "#A8453B" }}>Failed to load forecast.</p>
      )}
    </Layout>
  );
}