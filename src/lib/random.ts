import { Place } from "@/types";

/**
 * Weighted random selection.
 * `boostedIds` will get `boostMultiplier` times the weight of normal items.
 */
export function weightedRandomPick(
  places: Place[],
  count: number,
  boostedIds: string[] = [],
  boostMultiplier: number = 5
): Place[] {
  // Build weighted pool: each place gets a weight
  const weighted = places.map((place) => ({
    place,
    weight: boostedIds.includes(place.id) ? boostMultiplier : 1,
  }));

  const picked: Place[] = [];
  const remaining = [...weighted];

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (let j = 0; j < remaining.length; j++) {
      random -= remaining[j].weight;
      if (random <= 0) {
        picked.push(remaining[j].place);
        remaining.splice(j, 1); // Remove to avoid duplicates
        break;
      }
    }
  }

  return picked;
}
