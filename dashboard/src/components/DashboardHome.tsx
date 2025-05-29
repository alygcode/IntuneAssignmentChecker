import React, { useEffect } from 'react';
import { useTableDispatch, AssignmentData } from '../contexts/TableDataContext';
import AssignmentsTable from './AssignmentsTable'; // Assuming AssignmentsTable is in the same directory or path is correct
// Import AssignmentsPie if it's also to be rendered here
// import AssignmentsPie from './Charts/AssignmentsPie'; 

const DashboardHome: React.FC = () => {
  const dispatch = useTableDispatch();

  useEffect(() => {
    // Mock data should conform to the AssignmentData interface in TableDataContext.tsx
    const mockAssignments: AssignmentData[] = [
      { id: '1', name: 'Policy Alpha', type: 'Configuration Profile', assignedTo: 'Group A', status: 'Active', platform: 'Windows', policyId: 'pol1', targetType: 'group', targetId: 'grpA' },
      { id: '2', name: 'App Beta', type: 'Application', assignedTo: 'User 1', status: 'Pending', platform: 'iOS', policyId: 'appB', targetType: 'user', targetId: 'usr1' },
      { id: '3', name: 'Policy Gamma', type: 'Compliance Policy', assignedTo: 'Group B', status: 'Active', platform: 'macOS', policyId: 'pol3', targetType: 'group', targetId: 'grpB' },
      { id: '4', name: 'Script Delta', type: 'Script', assignedTo: 'All Devices', status: 'Error', platform: 'Android', policyId: 'scrD', targetType: 'all' },
      { id: '5', name: 'Profile Epsilon', type: 'Configuration Profile', assignedTo: 'Group C', status: 'Active', platform: 'Windows', policyId: 'pol5', targetType: 'group', targetId: 'grpC' },
    ];

    dispatch({ type: 'SET_DATA', payload: mockAssignments });
  }, [dispatch]); // dispatch is stable but good practice to include it

  return (
    <div>
      <h1>Intune Assignment Checker Dashboard</h1>
      <p>Welcome to the dashboard. Below is an overview of current assignments.</p>
      
      {/* Render the AssignmentsTable component */}
      <AssignmentsTable />

      {/* Placeholder for where a chart might go */}
      {/* <AssignmentsPie /> */}
    </div>
  );
};

export default DashboardHome;
