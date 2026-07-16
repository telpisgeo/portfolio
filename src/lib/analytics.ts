// Shared "don't track this device" flag for all analytics/session-replay
// tools (Amplitude, Vercel Analytics). Run once in the browser console on
// your own machine to stop showing up in your own data:
//   localStorage.setItem("va-disable", "1")
export function isOwnerDevice() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("va-disable") === "1";
}
