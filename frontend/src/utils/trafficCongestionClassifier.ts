import { TrafficStatus, CongestionClassificationResult } from '../types/trafficCongestion';

/**
 * Classifies congestion severity based on traffic observation metrics.
 * Designed as a pure classification function so real camera/vision providers
 * can feed observation metrics into this engine without modifying UI components.
 */
export function classifyCongestionLevel(level: number): CongestionClassificationResult {
  if (level >= 70) {
    return {
      status: 'Heavy',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      severityLabel: 'High Congestion Corridor',
      description: 'High traffic density observed along junction corridor. Signal timing adjustments recommended.',
    };
  }

  if (level >= 40) {
    return {
      status: 'Moderate',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      severityLabel: 'Moderate Flow Volume',
      description: 'Steady vehicle flow with minor intersection queueing. Regular signal cycles applied.',
    };
  }

  return {
    status: 'Normal',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    severityLabel: 'Free-Flow Traffic',
    description: 'Unimpeded vehicle movement across all lanes. Optimal travel conditions.',
  };
}
