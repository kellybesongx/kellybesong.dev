export function trackEvent(eventName, payload) {
  console.log("ANALYTICS EVENT:", {
    event: eventName,
    ...payload,
  });
}
