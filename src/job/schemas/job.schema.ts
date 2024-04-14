import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type JobDocument = Job & mongoose.Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  skills: string[];

  @Prop({ required: true, type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    logo: string;
  };

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ required: false, type: Object })
  createdBy?: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  }

  @Prop({ required: false, type: Object })
  updatedBy?: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  }

  @Prop({ required: false, type: Object })
  deletedBy?: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  }

  createdAt: Date;

  updatedAt: Date;

  isDeleted: boolean;

  deletedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
