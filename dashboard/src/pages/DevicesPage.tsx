import React from 'react';
import AssignmentsTable from '../components/AssignmentsTable';
import DeviceDetail from '../components/DeviceDetail';

const DevicesPage: React.FC = () => {
  return (
    <div>
      <h1>Devices</h1>
      <AssignmentsTable />
      <DeviceDetail />
    </div>
  );
};

export default DevicesPage;
