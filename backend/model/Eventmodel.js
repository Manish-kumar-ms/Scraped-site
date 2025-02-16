import mongoose from "mongoose";



const EventSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String, // Fix the typo here
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    image:{
       type:String
    },
    emails: [
        { 
            type: String
         }
        ], // Store emails here
})

export const EventModel=mongoose.model("eventmodel",EventSchema)