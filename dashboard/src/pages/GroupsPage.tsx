import React from 'react';
import AssignmentsTable from '../components/AssignmentsTable';
import GroupDetail from '../components/GroupDetail';

const GroupsPage: React.FC = () => {
  return (
    <div>
      <h1>Groups</h1>
      <AssignmentsTable />
      <GroupDetail />
    </div>
  );
};

export default GroupsPage;
