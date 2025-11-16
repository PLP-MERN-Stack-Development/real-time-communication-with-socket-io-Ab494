/**
 * String Utilities
 */

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const sanitizeString = (str) => {
  return String(str).trim().slice(0, 500);
};

const escapeHtml = (str) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(str).replace(/[&<>"']/g, (m) => map[m]);
};

module.exports = {
  generateId,
  sanitizeString,
  escapeHtml,
};
