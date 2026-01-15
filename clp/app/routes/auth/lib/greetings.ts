const lateMessages = [
  "It's late",
  "Winding down for the night?",
  "Late night vibes",
  "Hope you had a good day",
  "Rest and recharge",
  "Take it easy tonight",
  "Night owl mode",
  "A calm end to the day",
  "Thanks for stopping by",
  "Cozy evening energy",
  "Quiet hours",
  "A little late, a lot of calm",
  "Time to unwind",
  "Soft lights, softer vibes",
  "Evening reset",
  "Nighttime glow",
  "Slow and steady tonight",
  "Settle in",
  "Late but welcome",
  "Ending the day on a good note",
  "Hope your day went well",
  "Stay relaxed",
  "Keep it mellow",
  "Comfortable late hours",
  "Low-key night",
  "Moonlit moments",
  "Late-night calm",
  "A peaceful pause",
  "Evening breeze",
  "Take a breath",
  "Soft landing",
  "Nighttime peace",
  "Gentle close to the day",
  "Recharge mode",
  "Quiet and cozy",
  "Ease into rest",
  "Wrap up the day",
  "Hope tomorrow is bright",
  "Stay comfy",
  "Nighttime welcome",
  "Rest well",
  "Easy evening",
  "Cozy up",
  "Slow down a bit",
  "Late-night hello",
  "Sweet dreams soon",
  "Easy does it",
  "Chill hours",
  "Settle for the night",
  "Take it slow",
];

const selectedLateMessage =
  lateMessages[Math.floor(Math.random() * lateMessages.length)];

/**
 * Get time-based greeting based on current hour
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";
  } else {
    return selectedLateMessage;
  }
}
