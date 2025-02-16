// Schedule the scraper to run **every 24 hours** (once a day)

import cron from 'node-cron';
import { scrapeEvents } from '../test.js';

export const refresh=()=>{
    cron.schedule("0 0  * * * *", async () => {
        console.log(" Running scheduled event scraper...");
        await scrapeEvents();
        console.log(" Events updated successfully!");
    });
}  