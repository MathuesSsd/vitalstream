import React from 'react';
export default function StatusBadge({ status = 'normal' }) {
  const labels = { normal: 'Normal', atencao: 'Atenção', perigo: 'Perigo' };
  return <span className={`status-badge ${status}`}>{labels[status] || status}</span>;
}
