// Calculate "time ago"
export const TimeAgo = (timestamp) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(timestamp)) / 1000); // in seconds

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};
