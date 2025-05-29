import React, { useMemo } from 'react';
import { useTableState, useTableDispatch, AssignmentData } from '../../contexts/TableDataContext'; // Added useTableDispatch
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0'];

const AssignmentsPie: React.FC = () => {
  const { originalData, pieChartFilter } = useTableState(); // Also get pieChartFilter for styling active slice
  const dispatch = useTableDispatch();

  const dataForPie = useMemo(() => {
    if (!originalData || originalData.length === 0) {
      return [];
    }
    const counts = originalData.reduce((acc, item) => {
      const key = item.type || 'Unknown Type'; 
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [originalData]);

  const handlePieClick = (sliceData: any) => {
    // sliceData from recharts Pie onClick usually has the payload property, 
    // which contains the original data object for that slice.
    // The data object we constructed for the pie is { name: string, value: number }
    // So, sliceData.name should be the assignment type.
    if (sliceData && sliceData.name) {
      dispatch({ type: 'SET_PIE_FILTER', payload: sliceData.name });
    }
  };

  if (!dataForPie || dataForPie.length === 0) {
    return (
      <div>
        <h3>Assignments Distribution by Type</h3>
        <p>No data available to display the pie chart.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Assignments Distribution by Type</h3>
      <div className="chart-container" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dataForPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={(entry) => `${entry.name} (${entry.value})`}
              onClick={handlePieClick} // Added onClick handler
              // Add styling for active slice if needed, e.g., by modifying Cell fill
            >
              {dataForPie.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  // Example: dim non-active slices if a filter is active
                  opacity={pieChartFilter && pieChartFilter !== entry.name ? 0.5 : 1} 
                  style={{ cursor: 'pointer' }} // Add cursor pointer to indicate clickability
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              // Optional: Enhance legend to show active filter or allow clearing
              // For example, by wrapping Legend in a custom component or adding a clear button nearby
            />
          </PieChart>
        </ResponsiveContainer>
        {pieChartFilter && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p>Filtering by type: <strong>{pieChartFilter}</strong> (click the slice again or <button onClick={() => dispatch({ type: 'SET_PIE_FILTER', payload: pieChartFilter })}>clear</button>)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPie;
