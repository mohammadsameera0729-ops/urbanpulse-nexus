import React, { useState, useRef, useEffect } from 'react';
import { Camera, VideoOff, RefreshCw, AlertCircle, Play, Square, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

type WebcamStatus = 'OFF' | 'CONNECTING' | 'ONLINE' | 'ERROR';

export const LocalWebcamDemo: React.FC = () => {
  const [status, setStatus] = useState<WebcamStatus>('OFF');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasAutoStartedRef = useRef(false);

  const startWebcam = async () => {
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('ERROR');
      setErrorMessage('Browser webcam access is unavailable.');
      return;
    }

    try {
      setStatus('CONNECTING');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      setStream(mediaStream);
      setStatus('ONLINE');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Local webcam access error:', err);
      setStatus('ERROR');

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage(
          'Camera permission denied. Allow camera access in your browser to use the demo webcam.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No webcam detected on this device.');
      } else {
        setErrorMessage(err.message || 'Failed to access local webcam.');
      }
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
    setStatus('OFF');
    setErrorMessage(null);
  };

  // Auto-start webcam when component mounts
  useEffect(() => {
    if (!hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      startWebcam();
    }
  }, []);

  useEffect(() => {
    if (status === 'ONLINE' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [status, stream]);

  // Clean up media stream tracks when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const renderStatusBadge = () => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            &bull; Status: Camera Online
          </span>
        );
      case 'CONNECTING':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 shrink-0">
            <RefreshCw className="w-3 h-3 animate-spin" />
            &bull; Requesting Permission...
          </span>
        );
      case 'ERROR':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-3 h-3" />
            &bull; Camera Access Error
          </span>
        );
      case 'OFF':
      default:
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5 shrink-0">
            <VideoOff className="w-3 h-3 text-slate-500" />
            &bull; Status: Camera Off
          </span>
        );
    }
  };

  return (
    <div className="p-6 bg-[#111827] border border-slate-800 rounded-3xl space-y-4 shadow-xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                DEMO CAMERA
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Local Browser Webcam
              </h2>
            </div>
          </div>
        </div>
        <div>{renderStatusBadge()}</div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-2.5 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong>Development Demo Camera Notice:</strong> This is a development/demo camera using the administrator's computer webcam. It is <strong>NOT</strong> a Vijayawada traffic camera. Video remains browser-local and is never uploaded or transmitted.
        </div>
      </div>

      {/* Video Preview Container */}
      <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
        {status === 'ONLINE' && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE PREVIEW &bull; LOCAL BROWSER WEBCAM
            </div>
          </>
        )}

        {status === 'CONNECTING' && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Requesting Camera Permission</h4>
              <p className="text-[11px] text-slate-400">
                Please allow camera access in your browser prompt.
              </p>
            </div>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 max-w-md">
            <AlertCircle className="w-8 h-8 text-rose-400" />
            <h4 className="text-xs font-bold text-white">Camera Access Failed</h4>
            <p className="text-[11px] text-rose-300 font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {status === 'OFF' && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-500 border border-slate-800">
              <Camera className="w-8 h-8 text-slate-400" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-xs font-bold text-white">Local Browser Webcam Off</h4>
              <p className="text-[11px] text-slate-400">
                Click "Open Demo Webcam" to grant permission and view your live camera preview.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Control Actions */}
      <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
        <span className="text-slate-400 font-mono text-[11px]">
          Source: {status === 'ONLINE' ? 'Local Browser Webcam' : 'Not Connected'}
        </span>
        <div className="flex items-center gap-3">
          {status !== 'ONLINE' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={startWebcam}
              disabled={status === 'CONNECTING'}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              leftIcon={<Play className="w-4 h-4 fill-current" />}
            >
              Open Demo Webcam
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={stopWebcam}
              className="border-rose-500/40 text-rose-300 hover:bg-rose-500/10 font-bold"
              leftIcon={<Square className="w-4 h-4 fill-current" />}
            >
              Stop Camera
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
