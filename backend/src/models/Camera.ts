import mongoose, { Schema, Document } from 'mongoose';

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

export interface ICamera extends Document {
  cameraId: string;
  monitoringPointId: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  streamType: StreamType;
  streamUrl?: string;
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
  authUsername?: string;
  authPassword?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CameraSchema: Schema = new Schema(
  {
    cameraId: { type: String, required: true, unique: true, trim: true },
    monitoringPointId: {
      type: String,
      required: true,
      enum: [
        'UP-TRF-01',
        'UP-TRF-02',
        'UP-TRF-03',
        'UP-TRF-04',
        'UP-TRF-05',
        'UP-TRF-06',
        'UP-TRF-07',
        'UP-TRF-08',
        'UP-TRF-10',
        'UP-TRF-11',
        'UP-TRF-12',
        'UP-TRF-19',
      ],
    },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    streamType: {
      type: String,
      enum: ['RTSP', 'HLS', 'WebRTC', 'MJPEG', 'UNKNOWN'],
      default: 'UNKNOWN',
    },
    streamUrl: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: [
        'DISCOVERY_PENDING',
        'PUBLIC_STREAM_VERIFIED',
        'ACCESS_RESTRICTED',
        'OFFLINE',
        'NOT_CONFIGURED',
        'CONNECTING',
        'ONLINE',
        'ERROR',
      ],
      default: 'NOT_CONFIGURED',
    },
    statusMessage: { type: String, trim: true },
    lastSeen: { type: Date },
    enabled: { type: Boolean, default: true },
    sourceName: { type: String, trim: true },
    sourceType: { type: String, trim: true },
    sourceWebsite: { type: String, trim: true },
    sourceVerification: { type: String, trim: true },
    publicAccess: { type: Boolean, default: false },
    streamVerifiedAt: { type: Date },
    lastSuccessfulConnection: { type: Date },
    accessStatus: { type: String, trim: true },
    authUsername: { type: String, trim: true, select: false },
    authPassword: { type: String, trim: true, select: false },
  },
  { timestamps: true }
);

export const Camera = mongoose.models.Camera || mongoose.model<ICamera>('Camera', CameraSchema);

