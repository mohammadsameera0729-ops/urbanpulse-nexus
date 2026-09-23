export type StreamType = 'RTSP' | 'HLS' | 'WebRTC' | 'MJPEG' | 'UNKNOWN';
export type CameraStatus =
  | 'DISCOVERY_PENDING'
  | 'PUBLIC_STREAM_VERIFIED'
  | 'ACCESS_RESTRICTED'
  | 'OFFLINE'
  | 'NOT_CONFIGURED'
  | 'CONNECTING'
  | 'ONLINE'
  | 'ERROR';

export type PlaybackType = 'HLS' | 'MJPEG' | 'WEBRTC' | 'RTSP_GATEWAY_NEEDED' | 'UNCONFIGURED';

export interface CameraRegistration {
  _id?: string;
  cameraId: string;
  monitoringPointId: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  streamType: StreamType;
  playbackType?: PlaybackType;
  playbackUrl?: string;
  streamUrl?: string;
  status: CameraStatus;
  statusMessage?: string;
  lastSeen?: string;
  enabled: boolean;
  sourceName?: string;
  sourceType?: string;
  sourceWebsite?: string;
  sourceVerification?: string;
  publicAccess?: boolean;
  streamVerifiedAt?: string;
  lastSuccessfulConnection?: string;
  accessStatus?: CameraStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CameraFeedDTO {
  cameraId: string;
  monitoringPointId: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  streamType: StreamType;
  playbackType: PlaybackType;
  playbackUrl?: string;
  status: CameraStatus;
  statusMessage?: string;
  lastSeen?: string;
  enabled: boolean;
  sourceName?: string;
  sourceType?: string;
  sourceWebsite?: string;
  sourceVerification?: string;
  publicAccess?: boolean;
  streamVerifiedAt?: string;
  lastSuccessfulConnection?: string;
  accessStatus?: CameraStatus;
}
