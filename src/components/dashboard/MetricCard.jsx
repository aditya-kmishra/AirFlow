import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const colorClasses = {
  blue: "text-blue-600",
  cyan: "text-cyan-600",
  green: "text-green-600",
  amber: "text-amber-600",
};

const bgColorClasses = {
  blue: "bg-blue-50",
  cyan: "bg-cyan-50",
  green: "bg-green-50",
  amber: "bg-amber-50",
};

export default function MetricCard({ title, value, change, trend, icon: Icon, color }) {
  return (
    <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 group rounded-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-md ${bgColorClasses[color]}`}>
            <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
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
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-serif font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}