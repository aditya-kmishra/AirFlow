import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BottleneckHeatmap({ simulations }) {
  const bottleneckCounts = {};
  
  simulations.forEach(sim => {
    (sim.bottlenecks || []).forEach(bottleneck => {
      bottleneckCounts[bottleneck] = (bottleneckCounts[bottleneck] || 0) + 1;
    });
  });

  const chartData = Object.entries(bottleneckCounts)
    .map(([area, count]) => ({
      area: area.replace(/_/g, ' '),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">Bottleneck Analysis</CardTitle>
        <p className="text-sm text-slate-600">Most frequently congested areas</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#64748b" />
            <YAxis dataKey="area" type="category" stroke="#64748b" width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }} 
            />
            <Bar 
              dataKey="count" 
              fill="url(#colorGradient)"
              radius={[0, 8, 8, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}