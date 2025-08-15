export default function logDetails(message, meta = {}) {
  try { console.log(`[LOG] ${message}`, meta); }
  catch { console.log(`[LOG] ${message}`); }
}