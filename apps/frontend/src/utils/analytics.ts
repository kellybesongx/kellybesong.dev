export function trackEvent(eventName: string, payload: Record<string, unknown>) {
  console.log("ANALYTICS EVENT:", {
    event: eventName,
    ...payload,
  });
}
