import React from 'react';
import AssignmentsTable from '../components/AssignmentsTable';
import PolicyDetail from '../components/PolicyDetail';

const PoliciesPage: React.FC = () => {
  return (
    <div>
      <h1>Policies</h1>
      <AssignmentsTable />
      <PolicyDetail />
    </div>
  );
};

export default PoliciesPage;
