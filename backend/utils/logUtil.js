module.exports = function logDetails(message, meta = {}) {
  const ts = new Date().toISOString();
  try { console.log(`[${ts}] ${message}`, meta); }
  catch { console.log(`[${ts}] ${message}`); }
};
