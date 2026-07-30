import { useState } from 'react';
import {
  Users,
  Clock,
  Download,
  Flame,
  UserX,
  Calendar,
  BarChart3,
  PieChart,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const MOCK_DATA_SETS = {
  Today: {
    totalServed: '312',
    servedChange: '+8.2%',
    servedPositive: true,
    avgWait: '6.2 mins',
    waitChange: '-1.4 mins',
    waitPositive: true,
    peakHour: '12:00 PM - 1:00 PM',
    peakCount: '84 tickets',
    abandonRate: '1.8%',
    abandonChange: '-0.5%',
    abandonPositive: true,
    hourlyTraffic: [
      { hour: '08:00 AM', volume: 12, wait: 3.2 },
      { hour: '09:00 AM', volume: 24, wait: 4.5 },
      { hour: '10:00 AM', volume: 45, wait: 5.8 },
      { hour: '11:00 AM', volume: 68, wait: 7.2 },
      { hour: '12:00 PM', volume: 95, wait: 9.8, isPeak: true },
      { hour: '01:00 PM', volume: 88, wait: 8.9, isPeak: true },
      { hour: '02:00 PM', volume: 52, wait: 6.1 },
      { hour: '03:00 PM', volume: 38, wait: 5.0 },
      { hour: '04:00 PM', volume: 42, wait: 5.5 },
      { hour: '05:00 PM', volume: 64, wait: 7.0 },
      { hour: '06:00 PM', volume: 50, wait: 6.2 },
      { hour: '07:00 PM', volume: 28, wait: 4.1 },
    ],
    counters: [
      { name: 'Veg Counter', code: 'V', avgWait: 5.8, served: 118, efficiency: 98, status: 'Fastest' },
      { name: 'Non-Veg Counter', code: 'NV', avgWait: 8.2, served: 96, efficiency: 92, status: 'Optimal' },
      { name: 'Beverages & Desserts', code: 'BEV', avgWait: 3.9, served: 64, efficiency: 99, status: 'Fastest' },
      { name: 'Personal Trainer Desk', code: 'PT', avgWait: 10.4, served: 34, efficiency: 86, status: 'High Traffic' },
    ],
    distribution: [
      { label: '< 5 mins', percentage: 48, count: 150, color: 'bg-emerald-500', stroke: '#10b981' },
      { label: '5–10 mins', percentage: 34, count: 106, color: 'bg-blue-500', stroke: '#3b82f6' },
      { label: '10–15 mins', percentage: 12, count: 37, color: 'bg-amber-500', stroke: '#f59e0b' },
      { label: '15+ mins', percentage: 6, count: 19, color: 'bg-rose-500', stroke: '#f43f5e' },
    ],
  },
  'Last 7 Days': {
    totalServed: '1,248',
    servedChange: '+12.4%',
    servedPositive: true,
    avgWait: '8.5 mins',
    waitChange: '-1.8 mins',
    waitPositive: true,
    peakHour: '12:00 PM - 2:00 PM',
    peakCount: '342 tickets',
    abandonRate: '2.4%',
    abandonChange: '-0.8%',
    abandonPositive: true,
    hourlyTraffic: [
      { hour: '08:00 AM', volume: 45, wait: 4.1 },
      { hour: '09:00 AM', volume: 92, wait: 5.6 },
      { hour: '10:00 AM', volume: 140, wait: 7.4 },
      { hour: '11:00 AM', volume: 210, wait: 9.1 },
      { hour: '12:00 PM', volume: 320, wait: 12.5, isPeak: true },
      { hour: '01:00 PM', volume: 290, wait: 11.2, isPeak: true },
      { hour: '02:00 PM', volume: 185, wait: 8.3 },
      { hour: '03:00 PM', volume: 130, wait: 6.8 },
      { hour: '04:00 PM', volume: 165, wait: 7.9 },
      { hour: '05:00 PM', volume: 240, wait: 10.1 },
      { hour: '06:00 PM', volume: 195, wait: 8.7 },
      { hour: '07:00 PM', volume: 98, wait: 5.2 },
    ],
    counters: [
      { name: 'Veg Counter', code: 'V', avgWait: 6.4, served: 412, efficiency: 96, status: 'Optimal' },
      { name: 'Non-Veg Counter', code: 'NV', avgWait: 9.8, served: 380, efficiency: 91, status: 'Optimal' },
      { name: 'Beverages & Desserts', code: 'BEV', avgWait: 4.2, served: 290, efficiency: 99, status: 'Fastest' },
      { name: 'Personal Trainer Desk', code: 'PT', avgWait: 11.5, served: 166, efficiency: 84, status: 'High Traffic' },
    ],
    distribution: [
      { label: '< 5 mins', percentage: 42, count: 524, color: 'bg-emerald-500', stroke: '#10b981' },
      { label: '5–10 mins', percentage: 36, count: 449, color: 'bg-blue-500', stroke: '#3b82f6' },
      { label: '10–15 mins', percentage: 15, count: 187, color: 'bg-amber-500', stroke: '#f59e0b' },
      { label: '15+ mins', percentage: 7, count: 88, color: 'bg-rose-500', stroke: '#f43f5e' },
    ],
  },
  'This Month': {
    totalServed: '5,840',
    servedChange: '+18.9%',
    servedPositive: true,
    avgWait: '9.1 mins',
    waitChange: '-0.9 mins',
    waitPositive: true,
    peakHour: '01:00 PM - 03:00 PM',
    peakCount: '1,420 tickets',
    abandonRate: '3.1%',
    abandonChange: '+0.2%',
    abandonPositive: false,
    hourlyTraffic: [
      { hour: '08:00 AM', volume: 180, wait: 4.8 },
      { hour: '09:00 AM', volume: 380, wait: 6.2 },
      { hour: '10:00 AM', volume: 620, wait: 8.1 },
      { hour: '11:00 AM', volume: 940, wait: 10.5 },
      { hour: '12:00 PM', volume: 1350, wait: 13.8, isPeak: true },
      { hour: '01:00 PM', volume: 1420, wait: 14.2, isPeak: true },
      { hour: '02:00 PM', volume: 980, wait: 10.0 },
      { hour: '03:00 PM', volume: 610, wait: 7.5 },
      { hour: '04:00 PM', volume: 740, wait: 8.8 },
      { hour: '05:00 PM', volume: 1100, wait: 11.4 },
      { hour: '06:00 PM', volume: 890, wait: 9.6 },
      { hour: '07:00 PM', volume: 430, wait: 5.9 },
    ],
    counters: [
      { name: 'Veg Counter', code: 'V', avgWait: 7.1, served: 1980, efficiency: 95, status: 'Optimal' },
      { name: 'Non-Veg Counter', code: 'NV', avgWait: 10.5, served: 1740, efficiency: 89, status: 'High Traffic' },
      { name: 'Beverages & Desserts', code: 'BEV', avgWait: 4.8, served: 1320, efficiency: 98, status: 'Fastest' },
      { name: 'Personal Trainer Desk', code: 'PT', avgWait: 12.8, served: 800, efficiency: 81, status: 'High Traffic' },
    ],
    distribution: [
      { label: '< 5 mins', percentage: 38, count: 2219, color: 'bg-emerald-500', stroke: '#10b981' },
      { label: '5–10 mins', percentage: 38, count: 2219, color: 'bg-blue-500', stroke: '#3b82f6' },
      { label: '10–15 mins', percentage: 16, count: 934, color: 'bg-amber-500', stroke: '#f59e0b' },
      { label: '15+ mins', percentage: 8, count: 468, color: 'bg-rose-500', stroke: '#f43f5e' },
    ],
  },
  Custom: {
    totalServed: '2,110',
    servedChange: '+15.1%',
    servedPositive: true,
    avgWait: '7.8 mins',
    waitChange: '-2.2 mins',
    waitPositive: true,
    peakHour: '11:30 AM - 01:30 PM',
    peakCount: '580 tickets',
    abandonRate: '2.0%',
    abandonChange: '-0.4%',
    abandonPositive: true,
    hourlyTraffic: [
      { hour: '08:00 AM', volume: 80, wait: 3.9 },
      { hour: '09:00 AM', volume: 160, wait: 5.1 },
      { hour: '10:00 AM', volume: 240, wait: 6.8 },
      { hour: '11:00 AM', volume: 380, wait: 8.5 },
      { hour: '12:00 PM', volume: 550, wait: 11.0, isPeak: true },
      { hour: '01:00 PM', volume: 490, wait: 10.1, isPeak: true },
      { hour: '02:00 PM', volume: 310, wait: 7.4 },
      { hour: '03:00 PM', volume: 220, wait: 6.0 },
      { hour: '04:00 PM', volume: 280, wait: 7.1 },
      { hour: '05:00 PM', volume: 410, wait: 9.2 },
      { hour: '06:00 PM', volume: 330, wait: 8.0 },
      { hour: '07:00 PM', volume: 160, wait: 4.8 },
    ],
    counters: [
      { name: 'Veg Counter', code: 'V', avgWait: 6.1, served: 710, efficiency: 97, status: 'Optimal' },
      { name: 'Non-Veg Counter', code: 'NV', avgWait: 9.0, served: 640, efficiency: 93, status: 'Optimal' },
      { name: 'Beverages & Desserts', code: 'BEV', avgWait: 4.0, served: 480, efficiency: 99, status: 'Fastest' },
      { name: 'Personal Trainer Desk', code: 'PT', avgWait: 10.8, served: 280, efficiency: 87, status: 'Optimal' },
    ],
    distribution: [
      { label: '< 5 mins', percentage: 45, count: 950, color: 'bg-emerald-500', stroke: '#10b981' },
      { label: '5–10 mins', percentage: 35, count: 738, color: 'bg-blue-500', stroke: '#3b82f6' },
      { label: '10–15 mins', percentage: 14, count: 295, color: 'bg-amber-500', stroke: '#f59e0b' },
      { label: '15+ mins', percentage: 6, count: 127, color: 'bg-rose-500', stroke: '#f43f5e' },
    ],
  },
};

export const AnalyticsPage = () => {
  const [dateFilter, setDateFilter] = useState('Last 7 Days');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [hoveredHour, setHoveredHour] = useState(null);
  const [activeMetric, setActiveMetric] = useState('volume'); // 'volume' or 'wait'
  const [customDates, setCustomDates] = useState({ start: '2026-07-01', end: '2026-07-27' });
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const currentDataset = MOCK_DATA_SETS[dateFilter] || MOCK_DATA_SETS['Last 7 Days'];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleExport = (type) => {
    setShowExportMenu(false);
    triggerToast(`Exporting Analytics Data as ${type.toUpperCase()}... File download started!`);
  };

  const maxVolume = Math.max(...currentDataset.hourlyTraffic.map((d) => d.volume));
  const maxWait = Math.max(...currentDataset.hourlyTraffic.map((d) => d.wait));

  return (
    <div className="w-full min-w-0 overflow-x-hidden space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-5 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-sm shadow-2xl flex items-center gap-3 border border-zinc-700 dark:border-zinc-200">
            <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Header & Date Filter Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-zinc-200 dark:border-zinc-800/80 pb-6 min-w-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Queue Analytics &amp; Performance Insights
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-950/60 text-blue-400 border border-blue-800/50">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Live Insights
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time queue metrics, customer throughput, wait-time distribution, and counter efficiency.
          </p>
        </div>

        {/* Action & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector Pills */}
          <div className="flex items-center p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
            {['Today', 'Last 7 Days', 'This Month', 'Custom'].map((filterOption) => {
              const isActive = dateFilter === filterOption;
              return (
                <button
                  key={filterOption}
                  type="button"
                  onClick={() => {
                    setDateFilter(filterOption);
                    if (filterOption === 'Custom') {
                      setShowCustomPicker(true);
                    } else {
                      setShowCustomPicker(false);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  {filterOption}
                </button>
              );
            })}
          </div>

          {/* Export CSV / PDF Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Export CSV / PDF</span>
              <ChevronDown className="w-4 h-4 shrink-0 opacity-80" />
            </button>

            {/* Export Dropdown Menu */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-30 p-1.5 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Export raw data (.CSV)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Export report (.PDF)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Date Range Dialog / Inputs (If Custom selected) */}
      {showCustomPicker && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-zinc-900 dark:text-zinc-100 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Calendar className="w-4 h-4 shrink-0 text-blue-500" />
            <span>Selected Custom Date Range:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">From:</span>
              <input
                type="date"
                value={customDates.start}
                onChange={(e) => setCustomDates({ ...customDates, start: e.target.value })}
                className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">To:</span>
              <input
                type="date"
                value={customDates.end}
                onChange={(e) => setCustomDates({ ...customDates, end: e.target.value })}
                className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium"
              />
            </div>
            <button
              type="button"
              onClick={() => triggerToast(`Custom filter applied (${customDates.start} to ${customDates.end})`)}
              className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-500 cursor-pointer"
            >
              Apply Range
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full min-w-0">
        {/* Metric 1: Total Customers Served */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Total Customers Served
            </p>
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {currentDataset.totalServed}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-extrabold text-emerald-500">
              <ArrowUpRight className="w-4 h-4 shrink-0" />
              <span>{currentDataset.servedChange} vs previous period</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Average Wait Time */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Average Wait Time
            </p>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {currentDataset.avgWait}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-extrabold text-emerald-500">
              <ArrowDownRight className="w-4 h-4 shrink-0" />
              <span>{currentDataset.waitChange} efficiency boost</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Peak Hour Traffic */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Peak Hour Traffic
            </p>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              {currentDataset.peakHour}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-extrabold text-amber-400">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span>{currentDataset.peakCount} during rush window</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Abandonment / Skip Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Abandonment / Skip Rate
            </p>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shrink-0">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {currentDataset.abandonRate}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-extrabold text-emerald-500">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Below 5% threshold (Optimal)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Charts & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-w-0">
        {/* CHART 1: Hourly Traffic Flow Chart (Spans 2 Columns on Large Screens) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-6 flex flex-col justify-between min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                  Hourly Traffic Flow Chart
                </h2>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Queue volume distribution across operations hours ({dateFilter})
              </p>
            </div>

            {/* Toggle Metric View (Volume vs Wait Time) */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveMetric('volume')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeMetric === 'volume'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Ticket Volume
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('wait')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeMetric === 'wait'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Avg Wait (Mins)
              </button>
            </div>
          </div>

          {/* Interactive SVG / CSS Bar Chart Container */}
          <div className="relative pt-6 pb-2 min-w-0">
            {/* Hover Tooltip display */}
            {hoveredHour !== null && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs shadow-xl border border-zinc-700 dark:border-zinc-200 z-10 animate-in fade-in duration-150 flex items-center gap-3">
                <span className="text-blue-400 dark:text-blue-600">{currentDataset.hourlyTraffic[hoveredHour].hour}</span>
                <span>•</span>
                <span>Volume: <strong className="text-white dark:text-zinc-950">{currentDataset.hourlyTraffic[hoveredHour].volume} guests</strong></span>
                <span>•</span>
                <span>Avg Wait: <strong>{currentDataset.hourlyTraffic[hoveredHour].wait}m</strong></span>
              </div>
            )}

            {/* Chart Area */}
            <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-3 px-2 border-b border-zinc-200 dark:border-zinc-800">
              {currentDataset.hourlyTraffic.map((item, idx) => {
                const metricValue = activeMetric === 'volume' ? item.volume : item.wait;
                const maxVal = activeMetric === 'volume' ? maxVolume : maxWait;
                const heightPercentage = Math.max((metricValue / maxVal) * 100, 10);
                const isHovered = hoveredHour === idx;

                return (
                  <div
                    key={item.hour}
                    onMouseEnter={() => setHoveredHour(idx)}
                    onMouseLeave={() => setHoveredHour(null)}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative"
                  >
                    {/* Bar */}
                    <div className="w-full max-w-[36px] flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${heightPercentage}%` }}
                        className={`w-full rounded-t-xl transition-all duration-300 ${
                          item.isPeak
                            ? isHovered
                              ? 'bg-amber-400 shadow-lg shadow-amber-500/30'
                              : 'bg-amber-500 dark:bg-amber-500'
                            : isHovered
                            ? 'bg-blue-400 shadow-lg shadow-blue-500/30'
                            : 'bg-blue-600/85 dark:bg-blue-500/80 hover:bg-blue-500'
                        }`}
                      />
                    </div>

                    {/* X-Axis Hour Label */}
                    <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors truncate">
                      {item.hour.split(':')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Peak Hour Highlight Tag */}
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-blue-600"></span>
                  <span>Standard Volume</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-500"></span>
                  <span>Peak Rush Window</span>
                </div>
              </div>
              <span className="hidden sm:inline-block text-zinc-400">Hover bars for detailed timestamps</span>
            </div>
          </div>
        </div>

        {/* CHART 3: Service Time Distribution Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                Wait Time Distribution
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Percentage breakdown of customer wait durations
            </p>
          </div>

          {/* Service Time Distribution Visual Breakdown */}
          <div className="space-y-4">
            {/* Multi-segment Progress Bar */}
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-zinc-100 dark:bg-zinc-800 p-0.5">
              {currentDataset.distribution.map((d) => (
                <div
                  key={d.label}
                  style={{ width: `${d.percentage}%` }}
                  title={`${d.label}: ${d.percentage}% (${d.count} guests)`}
                  className={`${d.color} transition-all duration-500 first:rounded-l-full last:rounded-r-full hover:opacity-85 cursor-pointer`}
                />
              ))}
            </div>

            {/* Distribution Legend List */}
            <div className="space-y-3 pt-2">
              {currentDataset.distribution.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${d.color} shrink-0`}></span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">{d.count} guests</span>
                    <span className="font-black text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-md">
                      {d.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CHART 2 & Service Counter Table: Counter Performance Comparison */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                Counter Performance Comparison
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Average wait time and guest throughput per service counter
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-400">
            SLA Target: <strong className="text-emerald-500">&lt; 10 mins</strong>
          </span>
        </div>

        {/* Counter Visual Progress Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-w-0">
          {currentDataset.counters.map((c) => {
            const barWidth = Math.min((c.avgWait / 15) * 100, 100);
            return (
              <div
                key={c.code}
                className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 transition-all hover:border-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-md text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                      {c.code}
                    </span>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white truncate">{c.name}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black shrink-0 ${
                      c.status === 'Fastest'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : c.status === 'Optimal'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-500 dark:text-zinc-400">Average Wait Time</span>
                    <span className="text-zinc-900 dark:text-white font-black">{c.avgWait} mins</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      style={{ width: `${barWidth}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        c.avgWait <= 6
                          ? 'bg-emerald-500'
                          : c.avgWait <= 10
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 pt-1">
                  <span>Served: <strong className="text-zinc-900 dark:text-white">{c.served} guests</strong></span>
                  <span>SLA Efficiency: <strong className="text-emerald-500">{c.efficiency}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
