/**
 * Utility formatters for CircularShield
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

export const formatCurrency = (amount, currency = 'BDT') => {
  if (amount === undefined || amount === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getRiskLevelBadge = (score) => {
  if (score > 60) {
    return {
      variant: 'suspicious',
      label: 'High Risk (Suspicious)',
      color: '#DC4B4B',
    };
  }
  if (score > 25) {
    return {
      variant: 'unverified',
      label: 'Medium Risk (Unverified)',
      color: '#D99A28',
    };
  }
  return {
    variant: 'verified',
    label: 'Low Risk (Verified)',
    color: '#16A36A',
  };
};

export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
