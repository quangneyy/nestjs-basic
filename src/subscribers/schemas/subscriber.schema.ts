import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type SubscriberDocument = HydratedDocument<Subscriber>

@Schema({ timestamps: true })
export class Subscriber {

    @Prop({ required: true })
    email: string;

    @Prop()
    name: string;

    @Prop()
    skills: string[];

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
