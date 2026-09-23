import { CameraRegistration, CameraFeedDTO } from '../types/cameraRegistry';

const API_BASE_URL = 'http://localhost:5000/api/cameras';

function getAuthHeader(token?: string | null): HeadersInit {
  const authToken =
    token ||
    localStorage.getItem('urbanpulse_auth_token') ||
    sessionStorage.getItem('urbanpulse_auth_token');

  return {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

export async function fetchCameras(token?: string | null): Promise<CameraFeedDTO[]> {
  try {
    const res = await fetch(API_BASE_URL, {
      headers: getAuthHeader(token),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.cameras)) {
        return data.cameras;
      }
    }
  } catch (err) {
    console.error('Error fetching camera registry:', err);
  }
  return [];
}

export async function fetchCameraFeed(
  cameraId: string,
  token?: string | null
): Promise<CameraFeedDTO | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${cameraId}/feed`, {
      headers: getAuthHeader(token),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.feed) {
        return data.feed;
      }
    }
  } catch (err) {
    console.error(`Error fetching feed for ${cameraId}:`, err);
  }
  return null;
}

export async function registerCamera(
  cameraData: Partial<CameraRegistration>,
  token?: string | null
): Promise<{ success: boolean; camera?: CameraFeedDTO; message?: string }> {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeader(token),
      body: JSON.stringify(cameraData),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, camera: data.camera, message: data.message };
    }
    return { success: false, message: data.message || 'Failed to register camera' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error registering camera' };
  }
}

export async function updateCameraRegistration(
  cameraId: string,
  cameraData: Partial<CameraRegistration>,
  token?: string | null
): Promise<{ success: boolean; camera?: CameraFeedDTO; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/${cameraId}`, {
      method: 'PUT',
      headers: getAuthHeader(token),
      body: JSON.stringify(cameraData),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, camera: data.camera, message: data.message };
    }
    return { success: false, message: data.message || 'Failed to update camera' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error updating camera' };
  }
}

export async function deleteCameraRegistration(
  cameraId: string,
  token?: string | null
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/${cameraId}`, {
      method: 'DELETE',
      headers: getAuthHeader(token),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message };
    }
    return { success: false, message: data.message || 'Failed to delete camera' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error deleting camera' };
  }
}

export async function checkCameraHealth(
  cameraId: string,
  token?: string | null
): Promise<{ success: boolean; feed?: CameraFeedDTO; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/${cameraId}/health-check`, {
      method: 'POST',
      headers: getAuthHeader(token),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, feed: data.feed, message: data.message };
    }
    return { success: false, message: data.message || 'Health check failed' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error performing health check' };
  }
}

export async function startCameraStream(
  cameraId: string,
  token?: string | null
): Promise<{ success: boolean; feed?: CameraFeedDTO; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/${cameraId}/start`, {
      method: 'POST',
      headers: getAuthHeader(token),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, feed: data.feed, message: data.message };
    }
    return { success: false, message: data.message || 'Stream start failed' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error starting camera stream' };
  }
}

export async function stopCameraStream(
  cameraId: string,
  token?: string | null
): Promise<{ success: boolean; feed?: CameraFeedDTO; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/${cameraId}/stop`, {
      method: 'POST',
      headers: getAuthHeader(token),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, feed: data.feed, message: data.message };
    }
    return { success: false, message: data.message || 'Stream stop failed' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error stopping camera stream' };
  }
}
