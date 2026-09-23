import React, { useState } from 'react';
import { CameraFeedDTO } from '../../types/cameraRegistry';
import { getGoogleMapsUrl } from '../../utils/formatters';
import { 
  Video, 
  VideoOff, 
  RefreshCw, 
  ExternalLink, 
  Play, 
  Square, 
  Radio, 
  AlertCircle, 
  Clock, 
  MapPin 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { startCameraStream, stopCameraStream, checkCameraHealth } from '../../services/cameraRegistryService';

interface RealCameraFeedProps {
  feed: CameraFeedDTO;
  authToken?: string | null;
  onFeedUpdated?: () => void;
}

export const RealCameraFeed: React.FC<RealCameraFeedProps> = ({ feed, authToken, onFeedUpdated }) => {
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleStartStream = async () => {
    setLoadingAction(true);
    setActionMessage(null);
    const res = await startCameraStream(feed.cameraId, authToken);
    setActionMessage(res.message || null);
    setLoadingAction(false);
    if (onFeedUpdated) onFeedUpdated();
  };

  const handleStopStream = async () => {
    setLoadingAction(true);
    setActionMessage(null);
    const res = await stopCameraStream(feed.cameraId, authToken);
    setActionMessage(res.message || null);
    setLoadingAction(false);
    if (onFeedUpdated) onFeedUpdated();
  };

  const handleHealthCheck = async () => {
    setLoadingAction(true);
    setActionMessage(null);
    const res = await checkCameraHealth(feed.cameraId, authToken);
    setActionMessage(res.message || null);
    setLoadingAction(false);
    if (onFeedUpdated) onFeedUpdated();
  };

  const getStatusBadge = () => {
    switch (feed.status) {
      case 'ONLINE':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            &bull; ONLINE
          </span>
        );
      case 'CONNECTING':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 shrink-0">
            <RefreshCw className="w-3 h-3 animate-spin" />
            &bull; CONNECTING...
          </span>
        );
      case 'ACCESS_RESTRICTED':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-3 h-3" />
            &bull; ACCESS RESTRICTED
          </span>
        );
      case 'PUBLIC_STREAM_VERIFIED':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center gap-1.5 shrink-0">
            <Video className="w-3 h-3" />
            &bull; STREAM VERIFIED
          </span>
        );
      case 'DISCOVERY_PENDING':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shrink-0">
            <Clock className="w-3 h-3" />
            &bull; DISCOVERY PENDING
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 shrink-0">
            <VideoOff className="w-3 h-3" />
            &bull; OFFLINE
          </span>
        );
      case 'ERROR':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-3 h-3" />
            &bull; CONNECTION ERROR
          </span>
        );
      case 'NOT_CONFIGURED':
      default:
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shrink-0">
            <VideoOff className="w-3 h-3" />
            &bull; NOT CONFIGURED
          </span>
        );
    }
  };

  const renderPlaybackWindow = () => {
    if (feed.status === 'NOT_CONFIGURED') {
      return (
        <div className="aspect-video w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-3 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700">
            <VideoOff className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="text-xs font-bold text-white leading-snug">Camera feed not configured.</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Provide an authorized RTSP/HLS/WebRTC/MJPEG stream to connect this camera.
            </p>
          </div>
        </div>
      );
    }

    if (feed.status === 'CONNECTING') {
      return (
        <div className="aspect-video w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          <span className="text-xs font-bold text-slate-200">Connecting to camera stream...</span>
        </div>
      );
    }

    if (feed.status === 'OFFLINE' || feed.status === 'ACCESS_RESTRICTED') {
      return (
        <div className="aspect-video w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-2">
          <VideoOff className="w-8 h-8 text-rose-400" />
          <h4 className="text-xs font-bold text-white">Camera feed unavailable</h4>
          <p className="text-[11px] text-slate-400 max-w-xs">
            {feed.statusMessage || 'Stream endpoint is currently offline or access is restricted.'}
          </p>
        </div>
      );
    }

    if (feed.status === 'ERROR') {
      return (
        <div className="aspect-video w-full rounded-2xl bg-slate-900/90 border border-rose-900/40 p-6 flex flex-col items-center justify-center text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <h4 className="text-xs font-bold text-white">Camera Connection Error</h4>
          <p className="text-[11px] text-slate-400 max-w-xs">{feed.statusMessage || 'Failed to establish stream connection.'}</p>
        </div>
      );
    }

    if (feed.status === 'ONLINE') {
      if (feed.playbackType === 'MJPEG' && feed.playbackUrl) {
        return (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={feed.playbackUrl}
              alt={feed.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE MJPEG STREAM
            </div>
          </div>
        );
      }

      if ((feed.playbackType === 'HLS' || feed.playbackType === 'WEBRTC') && feed.playbackUrl) {
        return (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <video
              src={feed.playbackUrl}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE {feed.playbackType} FEED
            </div>
          </div>
        );
      }

      if (feed.playbackType === 'RTSP_GATEWAY_NEEDED') {
        return (
          <div className="aspect-video w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Radio className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-xs font-bold text-white">RTSP Stream Reachable</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                RTSP TCP stream connection verified backend-side. Web browsers cannot play raw RTSP directly without a media gateway (e.g. RTSP-to-HLS/WebRTC converter).
              </p>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="aspect-video w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-2">
        <VideoOff className="w-6 h-6 text-slate-500" />
        <h4 className="text-xs font-bold text-white">Camera feed unavailable</h4>
        <span className="text-[11px] text-slate-400">Stream preview currently unavailable.</span>
      </div>
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg font-sans">
      <div className="space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] text-brand-400 font-bold tracking-wider block">
              {feed.cameraId} &bull; {feed.monitoringPointId}
            </span>
            <h3 className="text-sm font-bold text-white leading-snug mt-0.5">
              {feed.name}
            </h3>
          </div>
          {getStatusBadge()}
        </div>

        {/* Real Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span className="truncate">{feed.location}</span>
        </div>

        {/* Source Metadata */}
        {feed.sourceName && (
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-medium">Source:</span>
              <span className="font-bold text-slate-200">{feed.sourceName}</span>
            </div>
            {feed.sourceType && (
              <div className="flex justify-between items-center text-slate-400 text-[10px]">
                <span>Type:</span>
                <span className="font-mono">{feed.sourceType}</span>
              </div>
            )}
            {feed.sourceVerification && (
              <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                Verification: {feed.sourceVerification}
              </p>
            )}
          </div>
        )}

        {/* Live Feed Video Window */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Live Feed</span>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">{feed.streamType} Stream</span>
          </div>
          {renderPlaybackWindow()}
        </div>
      </div>

      {/* Metadata & Actions Footer */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        {actionMessage && (
          <p className="text-[11px] text-blue-400 font-mono italic truncate">
            {actionMessage}
          </p>
        )}

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>
              Last Connection:{' '}
              {feed.lastSuccessfulConnection
                ? new Date(feed.lastSuccessfulConnection).toLocaleString()
                : feed.lastSeen
                ? new Date(feed.lastSeen).toLocaleString()
                : 'Never'}
            </span>
          </div>
          <span className="text-slate-500">{feed.enabled ? 'Enabled' : 'Disabled'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartStream}
            disabled={loadingAction}
            className="flex-1 text-[11px] py-1.5 border-slate-700 text-slate-200 hover:bg-slate-800 font-bold"
            leftIcon={<Play className="w-3 h-3 text-emerald-400" />}
          >
            Start Feed
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleStopStream}
            disabled={loadingAction}
            className="flex-1 text-[11px] py-1.5 border-slate-700 text-slate-200 hover:bg-slate-800 font-bold"
            leftIcon={<Square className="w-3 h-3 text-rose-400" />}
          >
            Stop Feed
          </Button>

          <button
            onClick={handleHealthCheck}
            disabled={loadingAction}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Check Stream Health"
          >
            <RefreshCw className={`w-4 h-4 text-blue-400 ${loadingAction ? 'animate-spin' : ''}`} />
          </button>

          <a
            href={getGoogleMapsUrl(feed.latitude, feed.longitude, feed.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Open Google Maps Location"
          >
            <ExternalLink className="w-4 h-4 text-brand-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
