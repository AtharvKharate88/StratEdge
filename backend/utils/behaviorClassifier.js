export const classifyBehavior = ({ timeSpent, clicks }) => {
  if (timeSpent > 20 && clicks > 5) {
    return "confused";
  }

  if (timeSpent < 10 && clicks <= 2) {
    return "confident";
  }

  return "neutral";
};