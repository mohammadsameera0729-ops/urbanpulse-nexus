import { Router, Request, Response } from 'express';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import { Camera, CameraStatus, StreamType } from '../models/Camera';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { 
  verifyCameraStreamHealth, 
  buildCameraFeedDTO, 
  determinePlaybackConfig 
} from '../services/cameraStreamService';

const router = Router();

export const AUTHORITATIVE_MONITORING_POINTS: Record<string, { name: string; location: string; lat: number; lng: number }> = {
  'UP-TRF-01': {
    name: 'NTR Statue Junction / NTR Circle',
    location: 'NTR Statue Junction, Patamata, Vijayawada, Andhra Pradesh',
    lat: 16.49502,
    lng: 80.65205,
  },
  'UP-TRF-02': {
    name: 'Control Room Circle',
    location: 'Police Control Room Circle, MG Road, Vijayawada, Andhra Pradesh',
    lat: 16.51364,
    lng: 80.62972,
  },
  'UP-TRF-03': {
    name: 'Tammina Poturaju Junction',
    location: 'Tammina Poturaju Junction, Vijayawada, Andhra Pradesh',
    lat: 16.52308,
    lng: 80.61802,
  },
  'UP-TRF-04': {
    name: 'Benz Circle',
    location: 'Benz Circle Junction, Vijayawada, Andhra Pradesh',
    lat: 16.49444,
    lng: 80.66306,
  },
  'UP-TRF-05': {
    name: 'Sitara Junction',
    location: 'Sitara Junction, Vidhyadharapuram, Vijayawada, Andhra Pradesh',
    lat: 16.52904,
    lng: 80.60501,
  },
  'UP-TRF-06': {
    name: 'Mahanadu Junction',
    location: 'Mahanadu Junction, NH65, Vijayawada, Andhra Pradesh',
    lat: 16.51103,
    lng: 80.66205,
  },
  'UP-TRF-07': {
    name: 'Ramavarappadu Junction',
    location: 'Ramavarappadu Ring Junction, Vijayawada, Andhra Pradesh',
    lat: 16.52560,
    lng: 80.67720,
  },
  'UP-TRF-08': {
    name: 'Gollapudi Junction',
    location: 'Gollapudi Y Junction, Vijayawada, Andhra Pradesh',
    lat: 16.54122,
    lng: 80.59254,
  },
  'UP-TRF-10': {
    name: 'Gunadala Bridge Junction',
    location: 'Gunadala Railway Bridge Junction, Vijayawada, Andhra Pradesh',
    lat: 16.52502,
    lng: 80.66104,
  },
  'UP-TRF-11': {
    name: 'Auto Nagar Junction',
    location: 'Auto Nagar Main Gate Junction, Vijayawada, Andhra Pradesh',
    lat: 16.49204,
    lng: 80.67106,
  },
  'UP-TRF-12': {
    name: 'Ramesh Hospital Junction',
    location: 'Ramesh Hospital Junction, Ring Road, Vijayawada, Andhra Pradesh',
    lat: 16.50602,
    lng: 80.65405,
  },
  'UP-TRF-19': {
    name: 'Kanakadurga Flyover / Varadhi Entry',
    location: 'Kanakadurga Flyover Entry, Vijayawada, Andhra Pradesh',
    lat: 16.51278,
    lng: 80.60389,
  },
};

/**
 * Seeds initial verified real camera location record (CWC Vijayawada-I) if absent.
 */
async function ensureInitialVerifiedCameraRecord() {
  try {
    const existing = await Camera.findOne({ cameraId: 'UP-CAM-CWC-VJA-01' });
    if (!existing) {
      await Camera.create({
        cameraId: 'UP-CAM-CWC-VJA-01',
        monitoringPointId: 'UP-TRF-03',
        name: 'CWC Vijayawada-I — Vijayawada Bypass Road',
        location: 'Kedareswar Pet, Vijayawada, Andhra Pradesh',
        latitude: 16.523333,
        longitude: 80.627500,
        sourceName: 'Central Warehousing Corporation',
        sourceType: 'PUBLIC_CAMERA_REFERENCE',
        sourceVerification: 'Real camera location identified, but current public feed is offline/unavailable.',
        publicAccess: false,
        streamUrl: null,
        streamType: 'UNKNOWN',
        status: 'OFFLINE',
        statusMessage: 'Real camera location identified, but current public feed is offline/unavailable.',
        enabled: false,
        accessStatus: 'OFFLINE',
      });
    }
  } catch (err) {
    console.error('Failed to seed CWC camera record:', err);
  }
}

/**
 * GET /api/cameras
 * Returns registered cameras without exposing credentials.
 */
router.get('/', authenticateToken, async (_req: AuthRequest, res) => {
  try {
    await ensureInitialVerifiedCameraRecord();
    const cameras = await Camera.find().sort({ createdAt: -1 });
    const feeds = cameras.map((cam) => buildCameraFeedDTO(cam));

    return res.status(200).json({
      success: true,
      count: feeds.length,
      cameras: feeds,
    });
  } catch (error) {
    console.error('GET /api/cameras error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch camera registry',
    });
  }
});

/**
 * GET /api/cameras/:cameraId
 */
router.get('/:cameraId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const cameraId = Array.isArray(req.params.cameraId) ? req.params.cameraId[0] : String(req.params.cameraId);
    const camera = await Camera.findOne({
      $or: [{ cameraId }, { _id: cameraId.match(/^[0-9a-fA-F]{24}$/) ? cameraId : null }],
    });

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera registration not found',
      });
    }

    return res.status(200).json({
      success: true,
      camera: buildCameraFeedDTO(camera),
    });
  } catch (error) {
    console.error('GET /api/cameras/:cameraId error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch camera',
    });
  }
});

/**
 * GET /api/cameras/:cameraId/feed
 * Returns safe feed representation for browser player.
 */
router.get('/:cameraId/feed', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const cameraId = Array.isArray(req.params.cameraId) ? req.params.cameraId[0] : String(req.params.cameraId);
    const camera = await Camera.findOne({
      $or: [{ cameraId }, { _id: cameraId.match(/^[0-9a-fA-F]{24}$/) ? cameraId : null }],
    });

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera registration not found',
      });
    }

    return res.status(200).json({
      success: true,
      feed: buildCameraFeedDTO(camera),
    });
  } catch (error) {
    console.error('GET /api/cameras/:cameraId/feed error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch camera feed details',
    });
  }
});

/**
 * POST /api/cameras
 * Create a new camera registration
 */
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      cameraId,
      monitoringPointId,
      name,
      streamType = 'HLS',
      streamUrl = '',
      enabled = true,
      authUsername,
      authPassword,
      sourceName,
      sourceType,
      sourceWebsite,
      sourceVerification,
      publicAccess,
    } = req.body;

    if (!cameraId || !monitoringPointId || !name) {
      return res.status(400).json({
        success: false,
        message: 'cameraId, monitoringPointId, and name are required',
      });
    }

    const pointInfo = AUTHORITATIVE_MONITORING_POINTS[monitoringPointId];
    if (!pointInfo) {
      return res.status(400).json({
        success: false,
        message: `Invalid monitoringPointId. Must be one of the 12 authoritative Vijayawada IDs (${Object.keys(AUTHORITATIVE_MONITORING_POINTS).join(', ')})`,
      });
    }

    const existing = await Camera.findOne({ cameraId: cameraId.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Camera with ID "${cameraId}" is already registered.`,
      });
    }

    const hasStream = streamUrl && streamUrl.trim().length > 0;
    const status: CameraStatus = hasStream ? 'CONNECTING' : 'NOT_CONFIGURED';
    const statusMessage = hasStream
      ? 'Stream configured; awaiting verification.'
      : 'Camera feed not configured. Provide an authorized RTSP/HLS/WebRTC/MJPEG stream to connect this camera.';

    const camera = new Camera({
      cameraId: cameraId.trim(),
      monitoringPointId,
      name: name.trim(),
      location: pointInfo.location,
      latitude: pointInfo.lat,
      longitude: pointInfo.lng,
      streamType,
      streamUrl: streamUrl ? streamUrl.trim() : null,
      status,
      statusMessage,
      enabled: Boolean(enabled),
      sourceName: sourceName ? String(sourceName).trim() : 'ADMIN_CONFIGURED_STREAM',
      sourceType: sourceType ? String(sourceType).trim() : 'DIRECT_STREAM',
      sourceWebsite: sourceWebsite ? String(sourceWebsite).trim() : undefined,
      sourceVerification: sourceVerification ? String(sourceVerification).trim() : 'Admin configured camera stream',
      publicAccess: Boolean(publicAccess),
      authUsername: authUsername ? authUsername.trim() : undefined,
      authPassword: authPassword ? authPassword.trim() : undefined,
    });

    await camera.save();

    if (hasStream) {
      await verifyCameraStreamHealth(camera);
    }

    return res.status(201).json({
      success: true,
      message: 'Camera registration created successfully',
      camera: buildCameraFeedDTO(camera),
    });
  } catch (error: any) {
    console.error('POST /api/cameras error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create camera registration',
    });
  }
});

/**
 * PUT /api/cameras/:cameraId
 */
router.put('/:cameraId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const cameraId = Array.isArray(req.params.cameraId) ? req.params.cameraId[0] : String(req.params.cameraId);
    const {
      monitoringPointId,
      name,
      streamType,
      streamUrl,
      enabled,
      authUsername,
      authPassword,
    } = req.body;

    const camera = await Camera.findOne({
      $or: [{ cameraId }, { _id: cameraId.match(/^[0-9a-fA-F]{24}$/) ? cameraId : null }],
    });

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera registration not found',
      });
    }

    if (monitoringPointId && AUTHORITATIVE_MONITORING_POINTS[monitoringPointId]) {
      const pointInfo = AUTHORITATIVE_MONITORING_POINTS[monitoringPointId];
      camera.monitoringPointId = monitoringPointId;
      camera.location = pointInfo.location;
      camera.latitude = pointInfo.lat;
      camera.longitude = pointInfo.lng;
    }

    if (name) camera.name = name.trim();
    if (streamType) camera.streamType = streamType;

    let streamUrlChanged = false;
    if (typeof streamUrl === 'string') {
      const cleanUrl = streamUrl.trim();
      if (camera.streamUrl !== cleanUrl) {
        streamUrlChanged = true;
      }
      camera.streamUrl = cleanUrl;
      if (cleanUrl === '') {
        camera.status = 'NOT_CONFIGURED';
        camera.statusMessage = 'Camera feed not configured. Provide an authorized RTSP/HLS/WebRTC/MJPEG stream to connect this camera.';
      } else {
        camera.status = 'CONNECTING';
        camera.statusMessage = 'Stream URL updated; testing connection...';
      }
    }

    if (typeof enabled === 'boolean') {
      camera.enabled = enabled;
    }

    if (authUsername !== undefined) camera.authUsername = authUsername;
    if (authPassword !== undefined) camera.authPassword = authPassword;

    await camera.save();

    if (streamUrlChanged && camera.streamUrl) {
      await verifyCameraStreamHealth(camera);
    }

    return res.status(200).json({
      success: true,
      message: 'Camera registration updated successfully',
      camera: buildCameraFeedDTO(camera),
    });
  } catch (error: any) {
    console.error('PUT /api/cameras/:cameraId error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update camera registration',
    });
  }
});

/**
 * DELETE /api/cameras/:cameraId
 */
router.delete('/:cameraId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const cameraId = Array.isArray(req.params.cameraId) ? req.params.cameraId[0] : String(req.params.cameraId);
    const result = await Camera.findOneAndDelete({
      $or: [{ cameraId }, { _id: cameraId.match(/^[0-9a-fA-F]{24}$/) ? cameraId : null }],
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Camera registration not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Camera ${cameraId} deleted successfully`,
    });
  } catch (error) {
    console.error('DELETE /api/cameras/:cameraId error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete camera registration',
    });
  }
});

/**
 * POST /api/cameras/:cameraId/start
 * Initiate stream gateway connection
 */
router.post('/:cameraId/start', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const cameraId = Array.isArray(req.params.cameraId) ? req.params.cameraId[0] : String(req.params.cameraId);
    const camera = await Camera.findOne({
      $or: [{ cameraId }, { _id: cameraId.match(/^[0-9a-fA-F]{24}$/) ? cameraId : null }],
    });

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera registration not found',
      });
    }

    if (!camera.streamUrl || camera.streamUrl.trim() === '') {
      camera.status = 'NOT_CONFIGURED';
      camera.statusMessage = 'Camera feed not configured. Provide an authorized RTSP/HLS/WebRTC/MJPEG stream to connect this camera.';
      await camera.save();
      return res.status(400).json({
        success: false,
        message: 'Camera feed not configured',
        feed: buildCameraFeedDTO(camera),
      });
    }

    camera.status = 'CONNECTING';
    camera.statusMessage = 'Initiating camera stream gateway connection...';
    await camera.save();

    await verifyCameraStreamHealth(camera);

    return res.status(200).json({
      success: true,
      message: `Stream start initiated for camera ${camera.cameraId}`,
      feed: buildCameraFeedDTO(camera),
    });
  } catch (error: any) {
    console.error('POST /api/cameras/:cameraId/start error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to start camera stream',
    });
  }
});

/**
 * POST /api/cameras/:cameraId/stop
 * Stop stream gateway connection
 */
router.post('/:cameraId/stop', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const cameraId = Array.isArray(req.params.cameraId) ? req.params.cameraId[0] : String(req.params.cameraId);
    const camera = await Camera.findOne({
      $or: [{ cameraId }, { _id: cameraId.match(/^[0-9a-fA-F]{24}$/) ? cameraId : null }],
    });

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera registration not found',
      });
    }

    if (!camera.streamUrl || camera.streamUrl.trim() === '') {
      camera.status = 'NOT_CONFIGURED';
      camera.statusMessage = 'Camera feed not configured.';
    } else {
      camera.status = 'OFFLINE';
      camera.statusMessage = 'Camera stream stopped by user session.';
    }

    await camera.save();

    return res.status(200).json({
      success: true,
      message: `Stream stopped for camera ${camera.cameraId}`,
      feed: buildCameraFeedDTO(camera),
    });
  } catch (error: any) {
    console.error('POST /api/cameras/:cameraId/stop error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to stop camera stream',
    });
  }
});

/**
 * POST /api/cameras/:cameraId/health-check
 * Perform real stream connection health check
 */
router.post('/:cameraId/health-check', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const cameraId = Array.isArray(req.params.cameraId) ? req.params.cameraId[0] : String(req.params.cameraId);
    const camera = await Camera.findOne({
      $or: [{ cameraId }, { _id: cameraId.match(/^[0-9a-fA-F]{24}$/) ? cameraId : null }],
    });

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: 'Camera registration not found',
      });
    }

    await verifyCameraStreamHealth(camera);

    return res.status(200).json({
      success: true,
      message: camera.statusMessage || 'Health check complete',
      feed: buildCameraFeedDTO(camera),
    });
  } catch (error: any) {
    console.error('POST /api/cameras/:cameraId/health-check error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Health check execution failed',
    });
  }
});

/**
 * GET /api/cameras/:cameraId/mjpeg-proxy
 * Securely proxies MJPEG HTTP streams to browser clients without exposing credentials
 */
router.get('/:cameraId/mjpeg-proxy', async (req: Request, res: Response) => {
  try {
    const cameraId = Array.isArray(req.params.cameraId) ? req.params.cameraId[0] : String(req.params.cameraId);
    const camera = await Camera.findOne({
      $or: [{ cameraId }, { _id: cameraId.match(/^[0-9a-fA-F]{24}$/) ? cameraId : null }],
    }).select('+authUsername +authPassword');

    if (!camera || !camera.streamUrl || camera.streamType !== 'MJPEG') {
      return res.status(404).json({
        success: false,
        message: 'MJPEG camera stream unavailable',
      });
    }

    const targetUrl = new URL(camera.streamUrl);
    const client = targetUrl.protocol === 'https:' ? https : http;

    const proxyReq = client.request(
      camera.streamUrl,
      {
        method: 'GET',
        headers: {
          ...(camera.authUsername && camera.authPassword
            ? {
                Authorization: `Basic ${Buffer.from(`${camera.authUsername}:${camera.authPassword}`).toString('base64')}`,
              }
            : {}),
        },
      },
      (targetRes) => {
        if (targetRes.headers['content-type']) {
          res.setHeader('content-type', targetRes.headers['content-type']);
        }
        res.status(targetRes.statusCode || 200);
        targetRes.pipe(res);
      }
    );

    proxyReq.on('error', (err) => {
      console.error(`MJPEG proxy error for ${cameraId}:`, err);
      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          message: `MJPEG proxy connection failed: ${err.message}`,
        });
      }
    });

    proxyReq.end();
  } catch (err: any) {
    console.error('MJPEG proxy exception:', err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to proxy MJPEG camera stream',
      });
    }
  }
});

export default router;
