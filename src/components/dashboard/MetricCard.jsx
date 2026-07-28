import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const colorClasses = {
  blue: "from-blue-500 to-blue-600",
  cyan: "from-cyan-500 to-cyan-600",
  green: "from-green-500 to-green-600",
  amber: "from-amber-500 to-amber-600",
};

const bgColorClasses = {
  blue: "bg-blue-500/10",
  cyan: "bg-cyan-500/10",
  green: "bg-green-500/10",
  amber: "bg-amber-500/10",
};

export default function MetricCard({ title, value, change, trend, icon: Icon, color }) {
  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${bgColorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 bg-gradient-to-br ${colorClasses[color]} bg-clip-text text-transparent`} style={{WebkitTextFillColor: 'transparent'}} />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {change}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}