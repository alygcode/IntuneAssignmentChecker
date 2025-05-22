import React from 'react';

type DeviceDetailProps = {
  deviceId?: string;
};

const DeviceDetail: React.FC<DeviceDetailProps> = ({ deviceId }) => {
  return (
    <div>
      <h2>Device Details</h2>
      <p>Device ID: {deviceId || 'Not selected'}</p>
      {/* Additional device details will go here */}
    </div>
  );
};

export default DeviceDetail;
