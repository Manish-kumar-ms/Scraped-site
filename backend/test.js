import puppeteer from 'puppeteer';
import { EventModel } from './model/Eventmodel.js';

export const scrapeEvents = async () => {
    const url = 'https://www.australia.com/en/events/australias-events-calendar.html'; // Target website
   
    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: "new",  // "true" for cloud, but "new" is recommended for stability
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-software-rasterizer"
        ]
      });
    const page = await browser.newPage();

    // Go to the target page
    await page.goto(url, { waitUntil: 'networkidle2' });

 
    // Extract event details 
    const events = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.common-events-calendar-results-tile-container')).map(event => {   //common-events-calendar-results-tile-container
            const title = event.querySelector('.common-events-calendar-results-tile__title')?.innerText.trim() || 'No title';
             let date = event.querySelector('.ta-image__dates ')?.innerText.trim() || 'No date';
             date = date.replace(/\n/g, ' ').replace(/\s+/g, ' '); // Remove extra spaces and newlines
             const location = event.querySelector('.common-events-calendar-results-tile__location')?.innerText.trim() || 'No location';
            const link = event.querySelector('.common-events-calendar-results-tile__link')?.href || 'No link';
            const image = event.querySelector('.ta-image-landscape img')?.src || 'No image';

             return { title, date, location, link, image };
           
        });  
    });
    // console.log(events)



    //Save events to the database
    for (const event of events) {
        const { title, date, location, link, image } = event;
        try {
            const existingEvent = await EventModel.findOne({ title, date });
            if (!existingEvent) {
                await EventModel.create({ title, date, location, link, image });
                console.log("new Event add sucessfully:", title);
            } else {
                console.log("Event already exists:", title);
            }
        } catch (error) {
            console.error("Error saving event:", error);
        }
    }

    // Close the browser
    await browser.close();
};
