import React from 'react';
import { Card } from '../ui/Card';
import { ObjectDetectionCategoryCard } from '../../types/aiDetection';
import { Car, Bus, Truck, Bike, Users, Siren, TrendingUp } from 'lucide-react';

interface ObjectDetectionPanelProps {
  categories: ObjectDetectionCategoryCard[];
}

export const ObjectDetectionPanel: React.FC<ObjectDetectionPanelProps> = ({ categories }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'car':
        return Car;
      case 'bus':
        return Bus;
      case 'truck':
        return Truck;
      case 'motorcycle':
        return Bike;
      case 'pedestrian':
        return Users;
      case 'emergency_vehicle':
        return Siren;
      default:
        return Car;
    }
  };

  // Filter to strictly the 6 requested classes
  const targetTypes = ['car', 'bus', 'truck', 'motorcycle', 'pedestrian', 'emergency_vehicle'];
  const filteredCategories = categories.filter((c) => targetTypes.includes(c.type));

  return (
    <Card className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          AI Object Detection Dashboard
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-brand-950 text-brand-400 border border-brand-500/30">
            6 AI Detection Classes
          </span>
        </h3>
        <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
          Real-time Edge Classification
        </span>
      </div>

      {/* 6 Minimal Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {filteredCategories.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-brand-500/40 transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 truncate">{item.category}</span>
                <div
                  style={{ backgroundColor: `${item.color}20`, color: item.color, borderColor: `${item.color}40` }}
                  className="p-1.5 rounded-lg border shrink-0"
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <p className="text-xl font-mono font-black text-white">
                  {item.count.toLocaleString()}
                </p>
                <div className="flex items-center justify-between text-xs font-mono mt-1">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="text-emerald-400 font-bold">{item.confidence}%</span>
                </div>
              </div>

              {/* Small Trend Indicator */}
              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> Trend:
                </span>
                <span className="font-bold text-emerald-400">{item.trend}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
