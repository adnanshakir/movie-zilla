export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getRatingColor = (rating) => {
  if (rating >= 7) return 'green';
  if (rating >= 5) return 'orange';
  return 'red';
};
