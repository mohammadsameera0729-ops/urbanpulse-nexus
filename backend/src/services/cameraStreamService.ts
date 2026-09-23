import net from 'net';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import { Camera, ICamera, CameraStatus, StreamType } from '../models/Camera';

export interface CameraFeedDTO {
  cameraId: string;
  monitoringPointId: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  streamType: StreamType;
  playbackType: 'HLS' | 'MJPEG' | 'WEBRTC' | 'RTSP_GATEWAY_NEEDED' | 'UNCONFIGURED';
  playbackUrl?: string;
  status: CameraStatus;
  statusMessage?: string;
  lastSeen?: Date;
  enabled: boolean;
  sourceName?: string;
  sourceType?: string;
  sourceWebsite?: string;
  sourceVerification?: string;
  publicAccess?: boolean;
  streamVerifiedAt?: Date;
  lastSuccessfulConnection?: Date;
  accessStatus?: CameraStatus;
}

/**
 * Validates stream URL format for supported protocols.
 */
export function validateStreamUrl(streamType: StreamType, streamUrl?: string): { isValid: boolean; message?: string } {
  if (!streamUrl || streamUrl.trim() === '') {
    return { isValid: false, message: 'Stream URL is empty' };
  }

  const cleanUrl = streamUrl.trim();

  try {
    if (streamType === 'RTSP') {
      if (!cleanUrl.toLowerCase().startsWith('rtsp://')) {
        return { isValid: false, message: 'RTSP stream URL must begin with rtsp://' };
      }
      return { isValid: true };
    }

    const parsed = new URL(cleanUrl);
    if (!['http:', 'https:', 'ws:', 'wss:'].includes(parsed.protocol)) {
      return { isValid: false, message: `Unsupported protocol ${parsed.protocol} for stream type ${streamType}` };
    }
    return { isValid: true };
  } catch (err: any) {
    return { isValid: false, message: `Invalid stream URL format: ${err.message}` };
  }
}

/**
 * Determines safe browser playback configuration for a camera without exposing raw credentials.
 */
export function determinePlaybackConfig(camera: ICamera): {
  playbackType: CameraFeedDTO['playbackType'];
  playbackUrl?: string;
} {
  if (!camera.streamUrl || camera.streamUrl.trim() === '' || camera.streamType === 'UNKNOWN') {
    return { playbackType: 'UNCONFIGURED' };
  }

  const cleanUrl = camera.streamUrl.trim();

  if (camera.streamType === 'RTSP') {
    return {
      playbackType: 'RTSP_GATEWAY_NEEDED',
    };
  }

  if (camera.streamType === 'MJPEG') {
    return {
      playbackType: 'MJPEG',
      playbackUrl: `/api/cameras/${camera.cameraId}/mjpeg-proxy`,
    };
  }

  if (camera.streamType === 'HLS') {
    return {
      playbackType: 'HLS',
      playbackUrl: cleanUrl,
    };
  }

  if (camera.streamType === 'WebRTC') {
    return {
      playbackType: 'WEBRTC',
      playbackUrl: cleanUrl,
    };
  }

  return { playbackType: 'UNCONFIGURED' };
}

/**
 * Verifies real camera stream reachability and updates status & lastSeen ONLY when stream data is actually reachable.
 */
export async function verifyCameraStreamHealth(camera: ICamera): Promise<ICamera> {
  if (!camera.streamUrl || camera.streamUrl.trim() === '') {
    if (!camera.statusMessage) {
      camera.status = 'NOT_CONFIGURED';
      camera.statusMessage = 'Camera feed not configured. Provide an authorized RTSP/HLS/WebRTC/MJPEG stream to connect this camera.';
    }
    await camera.save();
    return camera;
  }

  const urlValidation = validateStreamUrl(camera.streamType, camera.streamUrl);
  if (!urlValidation.isValid) {
    camera.status = 'ERROR';
    camera.statusMessage = urlValidation.message || 'Invalid camera stream URL configuration.';
    await camera.save();
    return camera;
  }

  const urlString = camera.streamUrl.trim();
  const streamType = camera.streamType;

  if (streamType === 'RTSP') {
    try {
      const parsedUrl = new URL(urlString.replace(/^rtsp:\/\//i, 'http://'));
      const host = parsedUrl.hostname;
      const port = parsedUrl.port ? parseInt(parsedUrl.port, 10) : 554;

      const tcpResult = await new Promise<{ isReachable: boolean; message: string }>((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(3000);

        socket.on('connect', () => {
          socket.destroy();
          resolve({
            isReachable: true,
            message: `RTSP stream endpoint connected on TCP port ${port}. Media gateway required for browser playback.`,
          });
        });

        socket.on('timeout', () => {
          socket.destroy();
          resolve({
            isReachable: false,
            message: `RTSP stream connection timed out on host ${host}:${port}.`,
          });
        });

        socket.on('error', (err) => {
          socket.destroy();
          resolve({
            isReachable: false,
            message: `RTSP stream connection error on host ${host}:${port}: ${err.message}`,
          });
        });

        socket.connect(port, host);
      });

      if (tcpResult.isReachable) {
        camera.status = 'ONLINE';
        camera.statusMessage = tcpResult.message;
        camera.lastSeen = new Date();
        camera.lastSuccessfulConnection = new Date();
        camera.streamVerifiedAt = new Date();
      } else {
        camera.status = 'OFFLINE';
        camera.statusMessage = tcpResult.message;
      }
    } catch (err: any) {
      camera.status = 'ERROR';
      camera.statusMessage = `RTSP configuration error: ${err.message}`;
    }

    await camera.save();
    return camera;
  }

  if (streamType === 'HLS' || streamType === 'MJPEG' || streamType === 'WebRTC') {
    try {
      const parsedUrl = new URL(urlString);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const httpResult = await new Promise<{ isReachable: boolean; message: string }>((resolve) => {
        const req = client.request(
          urlString,
          { method: 'HEAD', timeout: 3500 },
          (res) => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
              resolve({
                isReachable: true,
                message: `Real stream endpoint reachable (HTTP ${res.statusCode}).`,
              });
            } else {
              resolve({
                isReachable: false,
                message: `Stream endpoint returned HTTP error status ${res.statusCode}.`,
              });
            }
          }
        );

        req.on('timeout', () => {
          req.destroy();
          resolve({
            isReachable: false,
            message: 'Stream endpoint connection timed out.',
          });
        });

        req.on('error', (err) => {
          req.destroy();
          resolve({
            isReachable: false,
            message: `Stream endpoint unreachable: ${err.message}`,
          });
        });

        req.end();
      });

      if (httpResult.isReachable) {
        camera.status = 'ONLINE';
        camera.statusMessage = httpResult.message;
        camera.lastSeen = new Date();
        camera.lastSuccessfulConnection = new Date();
        camera.streamVerifiedAt = new Date();
      } else {
        camera.status = 'OFFLINE';
        camera.statusMessage = httpResult.message;
      }
    } catch (err: any) {
      camera.status = 'ERROR';
      camera.statusMessage = `Stream configuration error: ${err.message}`;
    }

    await camera.save();
    return camera;
  }

  camera.status = 'ERROR';
  camera.statusMessage = 'Unsupported stream protocol.';
  await camera.save();
  return camera;
}

/**
 * Builds a sanitized CameraFeedDTO for frontend consumption.
 */
export function buildCameraFeedDTO(camera: ICamera): CameraFeedDTO {
  const playback = determinePlaybackConfig(camera);

  return {
    cameraId: camera.cameraId,
    monitoringPointId: camera.monitoringPointId,
    name: camera.name,
    location: camera.location,
    latitude: camera.latitude,
    longitude: camera.longitude,
    streamType: camera.streamType,
    playbackType: playback.playbackType,
    playbackUrl: playback.playbackUrl,
    status: camera.status,
    statusMessage: camera.statusMessage,
    lastSeen: camera.lastSeen,
    enabled: camera.enabled,
    sourceName: camera.sourceName,
    sourceType: camera.sourceType,
    sourceWebsite: camera.sourceWebsite,
    sourceVerification: camera.sourceVerification,
    publicAccess: camera.publicAccess,
    streamVerifiedAt: camera.streamVerifiedAt,
    lastSuccessfulConnection: camera.lastSuccessfulConnection,
    accessStatus: camera.accessStatus || camera.status,
  };
}
