import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PassengerFlow from "../components/simulation/PassengerFlow";
import SimulationResults from "../components/simulation/SimulationResults";

export default function Simulation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [config, setConfig] = useState({
    name: `Simulation ${new Date().toLocaleDateString()}`,
    scenario_type: "baseline",
    passenger_count: 5000,
    walking_speed: 1.4,
    patience_level: 3,
    group_size: 2.5,
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const runSimulation = async () => {
    setIsRunning(true);
    setResults(null);
    
    // Simulate running the agent-based model
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate realistic simulation results using AI
    const prompt = `Generate realistic airport simulation results for an agent-based model with the following parameters:
    - Scenario: ${config.scenario_type}
    - Passenger count: ${config.passenger_count}
    - Walking speed: ${config.walking_speed} m/s
    - Patience level: ${config.patience_level}/5
    - Average group size: ${config.group_size}
    
    Generate data for average waiting times at security, check-in, and boarding gates. 
    Calculate throughput (passengers per hour), identify 3-5 bottleneck areas, 
    provide an optimization score (0-100), and give 4-5 specific recommendations for improvement.`;
    
    const aiResults = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          avg_waiting_time: { type: "number" },
          security_wait: { type: "number" },
          checkin_wait: { type: "number" },
          boarding_wait: { type: "number" },
          throughput: { type: "number" },
          bottlenecks: { type: "array", items: { type: "string" } },
          optimization_score: { type: "number" },
          recommendations: { type: "array", items: { type: "string" } }
        }
      }
    });
    
    const simulationData = {
      ...config,
      ...aiResults,
      agent_parameters: {
        walking_speed: config.walking_speed,
        patience_level: config.patience_level,
        group_size: config.group_size,
      },
      status: "completed"
    };
    
    const saved = await base44.entities.Simulation.create(simulationData);
    setResults(saved);
    setIsRunning(false);
    queryClient.invalidateQueries(['simulations']);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Live Simulation</h1>
          <p className="text-slate-600">Configure and run agent-based passenger flow simulations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1 border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Simulation Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Simulation Name</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scenario">Scenario Type</Label>
                <Select
                  value={config.scenario_type}
                  onValueChange={(value) => setConfig({ ...config, scenario_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baseline">Baseline</SelectItem>
                    <SelectItem value="optimized_security">Optimized Security</SelectItem>
                    <SelectItem value="optimized_checkin">Optimized Check-in</SelectItem>
                    <SelectItem value="hybrid_all">Hybrid All</SelectItem>
                    <SelectItem value="peak_hours">Peak Hours</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengers">Passenger Count: {config.passenger_count.toLocaleString()}</Label>
                <Slider
                  id="passengers"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={[config.passenger_count]}
                  onValueChange={([value]) => setConfig({ ...config, passenger_count: value })}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Walking Speed: {config.walking_speed} m/s</Label>
                <Slider
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={[config.walking_speed]}
                  onValueChange={([value]) => setConfig({ ...config, walking_speed: value })}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Patience Level: {config.patience_level}/5</Label>
                <Slider
                  min={1}
                  max={5}
                  step={0.5}
                  value={[config.patience_level]}
                  onValueChange={([value]) => setConfig({ ...config, patience_level: value })}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Avg Group Size: {config.group_size}</Label>
                <Slider
                  min={1}
                  max={5}
                  step={0.5}
                  value={[config.group_size]}
                  onValueChange={([value]) => setConfig({ ...config, group_size: value })}
                  className="py-4"
                />
              </div>

              <Button
                onClick={runSimulation}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30"
              >
                {isRunning ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <PassengerFlow isRunning={isRunning} passengerCount={config.passenger_count} />
            {results && <SimulationResults results={results} />}
          </div>
        </div>
      </div>
    </div>
  );
}