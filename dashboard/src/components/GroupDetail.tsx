import React from 'react';

type GroupDetailProps = {
  groupId?: string;
};

const GroupDetail: React.FC<GroupDetailProps> = ({ groupId }) => {
  return (
    <div>
      <h2>Group Details</h2>
      <p>Group ID: {groupId || 'Not selected'}</p>
      {/* Additional group details will go here */}
    </div>
  );
};

export default GroupDetail;
