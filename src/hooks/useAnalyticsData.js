import { useState, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const INITIAL_HOURLY_DATA = [
  { hour: '09:00', tokens: 18, waitMins: 6 },
  { hour: '10:00', tokens: 32, waitMins: 9 },
  { hour: '11:00', tokens: 48, waitMins: 14 },
  { hour: '12:00', tokens: 86, waitMins: 22 },
  { hour: '13:00', tokens: 94, waitMins: 26 },
  { hour: '14:00', tokens: 62, waitMins: 16 },
  { hour: '15:00', tokens: 44, waitMins: 11 },
  { hour: '16:00', tokens: 38, waitMins: 8 },
  { hour: '17:00', tokens: 52, waitMins: 13 },
  { hour: '18:00', tokens: 29, waitMins: 7 },
];

export const INITIAL_COUNTER_STATS = [
  { name: 'Veg Counter', code: 'V', served: 164, avgWait: '12m', efficiency: '96%', color: 'emerald' },
  { name: 'Non-Veg Counter', code: 'NV', served: 142, avgWait: '15m', efficiency: '92%', color: 'rose' },
  { name: 'Beverages & Desserts', code: 'BEV', served: 98, avgWait: '6m', efficiency: '98%', color: 'amber' },
];

export const INITIAL_RECENT_SERVED = [
  { id: 't1', token: '#V-24', guest: 'Sarah', party: 2, counter: 'Veg Counter', joined: '12:35 PM', served: '12:47 PM', waitTime: '12m', status: 'Completed' },
  { id: 't2', token: '#NV-18', guest: 'Angela', party: 1, counter: 'Non-Veg Counter', joined: '12:28 PM', served: '12:45 PM', waitTime: '17m', status: 'Completed' },
  { id: 't3', token: '#B-42', guest: 'Ryan', party: 1, counter: 'Beverages & Desserts', joined: '12:40 PM', served: '12:44 PM', waitTime: '4m', status: 'Completed' },
  { id: 't4', token: '#V-23', guest: 'Pam', party: 2, counter: 'Veg Counter', joined: '12:20 PM', served: '12:34 PM', waitTime: '14m', status: 'Completed' },
  { id: 't5', token: '#NV-17', guest: 'Michael', party: 4, counter: 'Non-Veg Counter', joined: '12:15 PM', served: '12:30 PM', waitTime: '15m', status: 'Completed' },
];

export const useAnalyticsData = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [hourlyData] = useState(INITIAL_HOURLY_DATA);
  const [counterStats] = useState(INITIAL_COUNTER_STATS);
  const [recentServed] = useState(INITIAL_RECENT_SERVED);

  const kpiMetrics = useMemo(() => {
    const totalServed = counterStats.reduce((acc, c) => acc + c.served, 0);
    const avgWaitMinutes = 11;
    const peakHour = '01:00 PM - 02:00 PM';
    const satisfactionRate = '94.8%';
    const noShowRate = '3.2%';

    return {
      totalServed,
      avgWaitMinutes,
      peakHour,
      satisfactionRate,
      noShowRate,
    };
  }, [counterStats]);

  const handleExportCSV = useCallback(() => {
    const csvRows = [
      ['Token', 'Guest', 'Party Size', 'Counter', 'Joined At', 'Served At', 'Wait Time', 'Status'],
      ...recentServed.map((r) => [
        r.token,
        r.guest,
        r.party,
        r.counter,
        r.joined,
        r.served,
        r.waitTime,
        r.status,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `queueit_analytics_${timeRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Analytics exported to CSV');
  }, [recentServed, timeRange]);

  return {
    timeRange,
    setTimeRange,
    hourlyData,
    counterStats,
    recentServed,
    kpiMetrics,
    handleExportCSV,
  };
};

export default useAnalyticsData;
