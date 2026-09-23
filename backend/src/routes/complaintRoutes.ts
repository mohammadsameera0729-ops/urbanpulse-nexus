import { Router } from 'express';
import mongoose from 'mongoose';
import { Complaint } from '../models/Complaint';
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Known real geographical coordinates for Vijayawada sub-localities / landmarks
const VIJAYAWADA_LOCALITY_MAP: Array<{ keywords: string[]; lat: number; lng: number }> = [
    { keywords: ['dabakotlu', 'daba kotlu'], lat: 16.5385, lng: 80.6260 },
    { keywords: ['benz circle', 'benzcircle'], lat: 16.5016, lng: 80.6436 },
    { keywords: ['singh nagar', 'singhnagar'], lat: 16.5360, lng: 80.6300 },
    { keywords: ['prakash nagar', 'prakashnagar'], lat: 16.5265, lng: 80.6275 },
    { keywords: ['ramavarappadu', 'ramvarpadu'], lat: 16.5280, lng: 80.6800 },
    { keywords: ['governorpet', 'governor pet'], lat: 16.5115, lng: 80.6235 },
    { keywords: ['moghalrajpuram', 'mogalrajpuram'], lat: 16.5050, lng: 80.6500 },
    { keywords: ['labbipet', 'labbi pet'], lat: 16.5040, lng: 80.6370 },
    { keywords: ['auto nagar', 'autonagar'], lat: 16.4980, lng: 80.6720 },
    { keywords: ['gunadala'], lat: 16.5260, lng: 80.6610 },
    { keywords: ['satyanarayanapuram', 'satyanarayana puram'], lat: 16.5230, lng: 80.6280 },
    { keywords: ['bhavanipuram', 'bhavani puram'], lat: 16.5280, lng: 80.5900 },
    { keywords: ['patamata'], lat: 16.4950, lng: 80.6540 },
    { keywords: ['one town', 'onetown'], lat: 16.5160, lng: 80.6120 },
    { keywords: ['two town', 'twotown'], lat: 16.5180, lng: 80.6200 },
    { keywords: ['kanuru'], lat: 16.4880, lng: 80.6850 },
    { keywords: ['gollapudi'], lat: 16.5450, lng: 80.5750 },
    { keywords: ['gandhinagar', 'gandhi nagar'], lat: 16.5170, lng: 80.6300 },
    { keywords: ['eluru road'], lat: 16.5180, lng: 80.6350 },
    { keywords: ['mg road', 'bandar road'], lat: 16.5030, lng: 80.6400 },
    { keywords: ['tadepalli'], lat: 16.4840, lng: 80.6050 },
    { keywords: ['enikepadu'], lat: 16.5250, lng: 80.7020 },
    { keywords: ['kaleswara rao', 'kr market'], lat: 16.5140, lng: 80.6100 },
    { keywords: ['chuttugunta'], lat: 16.5150, lng: 80.6400 },
    { keywords: ['payakapuram'], lat: 16.5430, lng: 80.6320 },
];

export function isValidVijayawadaCoordinates(lat: any, lng: any): boolean {
    if (typeof lat !== 'number' || typeof lng !== 'number') return false;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
    // Vijayawada regional bounding box validation (approx. 16.3 to 16.7 N, 80.4 to 80.8 E)
    if (lat < 16.30 || lat > 16.70 || lng < 80.40 || lng > 80.80) return false;
    return true;
}

/**
 * Dynamically resolves coordinates for a location string using OpenStreetMap Nominatim & Vijayawada sub-locality dictionary.
 * Uses a multi-pass search candidate strategy with strict Vijayawada regional bounding box validation.
 */
export async function resolveVijayawadaCoordinates(location: string): Promise<{ latitude?: number; longitude?: number }> {
    if (!location || typeof location !== 'string' || !location.trim()) {
        return {};
    }

    const clean = location.trim();
    const lowerClean = clean.toLowerCase();

    // 1. Direct sub-locality match from known Vijayawada neighborhood map
    for (const item of VIJAYAWADA_LOCALITY_MAP) {
        if (item.keywords.some((kw) => lowerClean.includes(kw))) {
            if (isValidVijayawadaCoordinates(item.lat, item.lng)) {
                return { latitude: item.lat, longitude: item.lng };
            }
        }
    }

    // 2. OpenStreetMap Nominatim dynamic geocoding query candidate strategy
    const rawParts = clean.split(/,| near | opposite | behind | next to /i).map(p => p.trim()).filter(Boolean);
    const candidates: string[] = [];

    const normalizedClean = clean
        .replace(/ramvarpadu/i, 'ramavarappadu')
        .replace(/singh nagar/i, 'singhnagar');

    let fullQuery = normalizedClean;
    const lowerFull = fullQuery.toLowerCase();
    if (!lowerFull.includes('vijayawada')) fullQuery += ', Vijayawada';
    if (!lowerFull.includes('andhra pradesh')) fullQuery += ', Andhra Pradesh';
    if (!lowerFull.includes('india')) fullQuery += ', India';
    candidates.push(fullQuery);

    for (const part of rawParts) {
        const cleanedPart = part
            .replace(/^near\s+/i, '')
            .replace(/^opposite\s+/i, '')
            .replace(/^behind\s+/i, '')
            .replace(/ramvarpadu/i, 'ramavarappadu')
            .replace(/singh nagar/i, 'singhnagar')
            .trim();

        if (!cleanedPart || /^\d+$/.test(cleanedPart) || /^plot/i.test(cleanedPart) || /^door/i.test(cleanedPart) || /^h\.?no/i.test(cleanedPart) || /^ground floor/i.test(cleanedPart)) {
            continue;
        }
        let q = cleanedPart;
        const lq = q.toLowerCase();
        if (!lq.includes('vijayawada')) q += ', Vijayawada';
        if (!lq.includes('andhra pradesh')) q += ', Andhra Pradesh';
        if (!lq.includes('india')) q += ', India';
        if (!candidates.includes(q)) candidates.push(q);
    }

    for (const query of candidates) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'UrbanPulseNexus/1.0' }
            });

            if (response.ok) {
                const data: any = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lng = parseFloat(data[0].lon);

                    if (isValidVijayawadaCoordinates(lat, lng)) {
                        return { latitude: lat, longitude: lng };
                    }
                }
            }
        } catch (err) {
            console.error('Nominatim geocoding fetch error:', err);
        }
    }

    // Return empty if unresolvable (do NOT invent fake coordinates or default center)
    return {};
}

/**
 * GET /api/complaints
 * Get complaints belonging to authenticated citizen
 */
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
            });
        }

        const complaints = await Complaint.find({
            citizen: userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            complaints,
        });
    } catch (error) {
        console.error('GET complaints error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch complaints',
        });
    }
});

/**
 * POST /api/complaints
 * Create complaint for authenticated citizen ONLY (citizen ID derived from JWT)
 */
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
            });
        }

        const {
            title,
            description,
            category,
            location,
            priority,
            assignedDepartment,
            latitude,
            longitude,
        } = req.body;

        // Input validation
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Complaint title is required',
            });
        }

        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Complaint description is required',
            });
        }

        if (!category || typeof category !== 'string' || !category.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Complaint category is required',
            });
        }

        if (!location || typeof location !== 'string' || !location.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Complaint location is required',
            });
        }

        const allowedPriorities = ['low', 'medium', 'high', 'critical'];
        let finalPriority: 'low' | 'medium' | 'high' | 'critical' = 'medium';

        if (priority !== undefined && priority !== null) {
            if (!allowedPriorities.includes(priority)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid priority value. Must be low, medium, high, or critical.',
                });
            }
            finalPriority = priority as 'low' | 'medium' | 'high' | 'critical';
        }

        const CATEGORY_TO_DEPARTMENT_MAP: Record<string, string> = {
            'Garbage not collected': 'Public Health & Sanitation',
            'Garbage accumulation / waste dumping': 'Public Health & Sanitation',

            'Water pipeline leakage': 'Water Supply & Sewerage',
            'Water supply problem': 'Water Supply & Sewerage',

            'Pothole / damaged road': 'Roads & Storm Water Drainage',
            'Drainage / waterlogging problem': 'Roads & Storm Water Drainage',

            'Street light not working': 'Street Lighting',

            'Park / greenery maintenance problem': 'Parks & Urban Greenery',
            'Fallen/damaged tree or branch': 'Parks & Urban Greenery',

            'Public safety hazard': 'Public Safety & Emergency Response',
        };

        let resolvedLat: number | undefined = undefined;
        let resolvedLng: number | undefined = undefined;

        if (isValidVijayawadaCoordinates(latitude, longitude)) {
            resolvedLat = latitude;
            resolvedLng = longitude;
        } else {
            const resolvedCoords = await resolveVijayawadaCoordinates(location.trim());
            resolvedLat = resolvedCoords.latitude;
            resolvedLng = resolvedCoords.longitude;
        }

        const resolvedDept =
            (typeof assignedDepartment === 'string' && assignedDepartment.trim()) ||
            CATEGORY_TO_DEPARTMENT_MAP[category.trim()] ||
            'Public Health & Sanitation';

        // Create complaint explicitly using req.user.userId ONLY (ignore any citizen ID from body)
        const complaint = await Complaint.create({
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            location: location.trim(),
            latitude: resolvedLat,
            longitude: resolvedLng,
            priority: finalPriority,
            status: 'pending',
            citizen: userId,
            assignedDepartment: resolvedDept,
            activities: [
                {
                    timestamp: new Date(),
                    author: 'System',
                    role: 'citizen',
                    note: 'Complaint submitted successfully.',
                },
            ],
        });

        return res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully',
            complaint,
        });
    } catch (error: any) {
        console.error('CREATE COMPLAINT ERROR:', error);

        return res.status(500).json({
            success: false,
            message: error?.message || 'Failed to submit complaint',
        });
    }
});

/**
 * GET /api/complaints/:id
 * Get single complaint by ID with strict IDOR protection
 */
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
            });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid complaint ID',
            });
        }

        const complaint = await Complaint.findById(id).populate('citizen', 'fullName email username');

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        // Extract populated citizen ID or reference ID
        const complaintCitizenId = (complaint.citizen as any)?._id
            ? (complaint.citizen as any)._id.toString()
            : complaint.citizen.toString();

        // IDOR Authorization Check: Citizen can ONLY access their own complaint
        if (userRole === 'citizen' && complaintCitizenId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to complaint',
            });
        }

        return res.status(200).json({
            success: true,
            complaint,
        });
    } catch (error) {
        console.error('GET single complaint error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch complaint details',
        });
    }
});

export default router;