
/* 

Group Two
Dr. Porter
CSCI 3300 

simulationEngine.js

Adam

*/


export function requiredScoreForTarget(current, finalWeight, target) {
  return Number(((target - current) / (finalWeight / 100)).toFixed(2));
}

export function generateSimulation(current, finalWeight) {
  let results = [];

  for (let score = 50; score <= 100; score += 10) {
    let final = current + score * (finalWeight / 100);

    results.push({
      score,
      final: Number(final.toFixed(2))
    });
  }

  return results;
}