import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function ComparisonChart({ simulations }) {
  const chartData = simulations
    .slice(0, 15)
    .reverse()
    .map((sim) => ({
      name: format(new Date(sim.created_date), 'MM/dd HH:mm'),
      waitTime: sim.avg_waiting_time || 0,
      throughput: sim.throughput || 0,
      score: sim.optimization_score || 0,
    }));

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Performance Over Time</CardTitle>
        <p className="text-sm text-slate-600">Tracking key metrics across all simulations</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="waitTime" 
              stroke="#EF4444" 
              strokeWidth={3}
              name="Wait Time (min)"
              dot={{ fill: '#EF4444', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="throughput" 
              stroke="#06B6D4" 
              strokeWidth={3}
              name="Throughput (pax/hr)"
              dot={{ fill: '#06B6D4', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Optimization Score"
              dot={{ fill: '#10B981', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}