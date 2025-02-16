import { EventModel } from "../model/Eventmodel.js";


export const getallevents= async(req,res)=>{
    try {
        const event=await EventModel.find()
        
        if(!event){
            return res.status(404).json({
                message:"we cant acces event from database",
            success:false
         })
        }

        return res.status(200).json({
            message:"fetch all the event",
            success:true,
            data:event
        })
 


    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch event",
            success: false,
            error: error.message,
          });
    }

}

export const saveemail=async(req,res)=>{
    try {
        const {email}=req.body
        const {eventid}=req.params
        if (!email || !eventid) {
            return res.status(400).json({ success: false, message: "Missing email or event ID" });
        }

        const event=await EventModel.findById(eventid)
        if(!event){
            return res.status(404).json({ success: false, message: "Event not found" });
            
        } 

         // Check if the email is already registered
         if (event.emails.includes(email)) {
            return res.status(400).json({ success: false, message: "Email already registered for this event" });
        }


        event.emails.push(email);
        await event.save();// Save event


        res.json({ success: true, message: "Email stored successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error we not able to store email" });
    }
}