import mongoose, { Document, Schema } from 'mongoose';
export interface IComplaint extends Document {
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'in_progress' | 'under_review' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  citizen: mongoose.Types.ObjectId;
  assignedDepartment?: string;
  assignedAgent?: string;
  slaDueDate?: Date;
  remarks?: string;
  activities?: Array<{
    timestamp: Date;
    author: string;
    role: string;
    note: string;
    statusChange?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
const complaintSchema = new Schema<IComplaint>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'under_review', 'resolved', 'rejected'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    citizen: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedDepartment: {
      type: String,
      default: '',
    },
    assignedAgent: {
      type: String,
      default: 'Unassigned',
    },
    slaDueDate: {
      type: Date,
    },
    remarks: {
      type: String,
      default: '',
    },
    activities: [
      {
        timestamp: { type: Date, default: Date.now },
        author: { type: String, default: 'System' },
        role: { type: String, default: 'admin' },
        note: { type: String, default: '' },
        statusChange: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);
complaintSchema.index({ citizen: 1, createdAt: -1 });
complaintSchema.index({ assignedAgent: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ assignedDepartment: 1 });

export const Complaint = mongoose.model<IComplaint>(
  'Complaint',
  complaintSchema
);
export default Complaint;
