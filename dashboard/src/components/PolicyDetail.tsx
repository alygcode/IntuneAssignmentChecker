import React from 'react';

type PolicyDetailProps = {
  policyId?: string;
};

const PolicyDetail: React.FC<PolicyDetailProps> = ({ policyId }) => {
  return (
    <div>
      <h2>Policy Details</h2>
      <p>Policy ID: {policyId || 'Not selected'}</p>
      {/* Additional policy details will go here */}
    </div>
  );
};

export default PolicyDetail;
