import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendWhatsAppNotification = async (number, message) => {
    try {
        const formattedNumber = `whatsapp:${number}`; // Format for Twilio WhatsApp API

        await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: formattedNumber,
            body: message,
        });

        console.log(`✅ WhatsApp message sent to ${number}`);
    } catch (error) {
        console.error("❌ Error sending WhatsApp message:", error.message);
    }
};
