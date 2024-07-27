"use client";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface OverviewProps {
  data: any[];
}

const Overview = ({ data }: OverviewProps) => {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
        <XAxis
          dataKey={"name"}
          stroke="#555"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value) => `₹${value}`}
          cursor={{ fill: "rgba(136, 132, 216, 0.1)" }}
        />
        <Legend />
        <Bar
          dataKey="total"
          fill="#84B74E"
          radius={[4, 4, 0, 0]}
          label={{ position: "top", fill: "#888888", fontSize: 12 }}
        />
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
