import { 
  IncidentSeverity, 
  IncidentStatus, 
  IncidentClassificationResult 
} from '../types/trafficIncident';

/**
 * Pure utility function to classify incident severity, status badges, and impact summary.
 * Keeps classification logic completely decoupled from UI presentation.
 */
export function classifyTrafficIncident(
  severity: IncidentSeverity,
  status: IncidentStatus
): IncidentClassificationResult {
  let severityBadgeClass = 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/40';
  let impactSummary = 'Minor traffic impact observed.';

  switch (severity) {
    case 'Critical':
      severityBadgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold animate-pulse';
      impactSummary = 'Major multi-lane obstruction creating severe corridor delays.';
      break;
    case 'High':
      severityBadgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
      impactSummary = 'Substantial lane blockage significantly restricting traffic flow.';
      break;
    case 'Medium':
      severityBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold';
      impactSummary = 'Partial obstruction with localized traffic queueing.';
      break;
    case 'Low':
      severityBadgeClass = 'bg-slate-500/20 text-slate-300 border-slate-500/40';
      impactSummary = 'Minor incident with minimal traffic impact.';
      break;
  }

  let statusBadgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
  switch (status) {
    case 'Active':
      statusBadgeClass = 'bg-rose-950/60 text-rose-300 border-rose-700/60 font-bold';
      break;
    case 'Monitoring':
      statusBadgeClass = 'bg-amber-950/60 text-amber-300 border-amber-700/60 font-bold';
      break;
    case 'Resolved':
      statusBadgeClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 font-semibold';
      break;
  }

  return {
    severityBadgeClass,
    statusBadgeClass,
    categoryIconColor: severity === 'Critical' || severity === 'High' ? 'text-rose-400' : 'text-amber-400',
    impactSummary,
  };
}
