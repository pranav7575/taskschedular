'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function TaskChart({ tasks }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!tasks.length) return;

    const ctx = chartRef.current.getContext('2d');
    
    const statusData = {
      pending: tasks.filter(t => t.status === 'pending').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };

    const priorityData = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pending', 'Completed', 'High', 'Medium', 'Low'],
        datasets: [{
          label: 'Tasks',
          data: [
            statusData.pending,
            statusData.completed,
            priorityData.high,
            priorityData.medium,
            priorityData.low
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 205, 86, 0.7)',
            'rgba(54, 162, 235, 0.7)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(54, 162, 235)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Task Distribution',
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [tasks]);

  return <canvas ref={chartRef} />;
}