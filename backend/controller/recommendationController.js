import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { EventModel } from "../model/Eventmodel.js";
import { sendWhatsAppNotification } from "./whatsappController.js";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-pro",
    apiKey: process.env.GOOGLE_API_KEY, // Ensure API Key is loaded
});

export const recommendEvent = async (req, res) => {
    try {
        const { preferences, location, phoneNumber } = req.body;

        if (!preferences || !location || !phoneNumber) {
            return res.status(400).json({ success: false, message: "Missing user details" });
        }

        // 🔹 Query events based on location
        const events = await EventModel.find({ location: { $regex: location, $options: "i" } });

        if (events.length === 0) {
            return res.status(404).json({ success: false, message: "No events found for your preferences" });
        }

        // 🔹 Generate LLM-based recommendation for multiple events
        const prompt = `Based on the user's interest: ${preferences}, recommend the top 3 most relevant events from the list below.
        Provide the result as a JSON array in this format:
        [
            { "title": "Event Name 1", "link": "Event URL 1" },
            { "title": "Event Name 2", "link": "Event URL 2" },
            { "title": "Event Name 3", "link": "Event URL 3" }
        ]
        
        Available events: ${JSON.stringify(events)}`;

        const response = await model.invoke(prompt);
         // ✅ Clean response by removing Markdown if it exists
         const cleanResponse = response.content.replace(/```json|```/g, "").trim();

        let recommendedEvents;
        try {
            recommendedEvents = JSON.parse(response.content);
        } catch (error) {
            console.error("❌ Error parsing LLM response:", error);
            return res.status(500).json({ success: false, message: "Error parsing recommendation from AI" });
        }

        // 🔹 Validate recommendations
        if (!Array.isArray(recommendedEvents) || recommendedEvents.length === 0) {
            return res.status(500).json({ success: false, message: "Invalid recommendation received" });
        }

        // 🔹 Format WhatsApp Message
        const message = recommendedEvents
            .map((event, index) => `🎟 *${index + 1}. ${event.title}*\n🔗 ${event.link}`)
            .join("\n\n");

        // 🔹 Send WhatsApp notification
        await sendWhatsAppNotification(phoneNumber, `🔥 We found some events for you:\n\n${message}`);

        return res.json({ success: true, recommendations: recommendedEvents });

    } catch (error) {
        console.error("❌ Error in recommendEvent:", error);
        return res.status(500).json({ success: false, message: "Error fetching recommendation", error: error.message });
    }
};
