// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium-min";
// import {EventModel} from "./model/EventModel.js";
// export const scrapeEvents = async () => {
//     const url = 'https://www.australia.com/en/events/australias-events-calendar.html'; // Target website

//     // const isLocal= !!process.env.CHROME_EXECUTABLE_PATH
   
//     // Launch Puppeteer
//     const browser = await puppeteer.launch({
//         args: chromium.args,
//         defaultViewport: chromium.defaultViewport,
//         executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
//         headless: chromium.headless, 
//     });
//     const page = await browser.newPage();

//     // Go to the target page
//     await page.goto(url, { waitUntil: 'networkidle2' });

 
//     // Extract event details 
//     const events = await page.evaluate(() => {
//         return Array.from(document.querySelectorAll('.common-events-calendar-results-tile-container')).map(event => {   //common-events-calendar-results-tile-container
//             const title = event.querySelector('.common-events-calendar-results-tile__title')?.innerText.trim() || 'No title';
//              let date = event.querySelector('.ta-image__dates ')?.innerText.trim() || 'No date';
//              date = date.replace(/\n/g, ' ').replace(/\s+/g, ' '); // Remove extra spaces and newlines
//              const location = event.querySelector('.common-events-calendar-results-tile__location')?.innerText.trim() || 'No location';
//             const link = event.querySelector('.common-events-calendar-results-tile__link')?.href || 'No link';
//             const image = event.querySelector('.ta-image-landscape img')?.src || 'No image';

//              return { title, date, location, link, image };
           
//         });  
//     });
//     // console.log(events)



//     //Save events to the database
//     for (const event of events) {
//         const { title, date, location, link, image } = event;
//         try {
//             const existingEvent = await EventModel.findOne({ title, date });
//             if (!existingEvent) {
//                 await EventModel.create({ title, date, location, link, image });
//                 console.log("new Event add sucessfully:", title);
//             } else {
//                 console.log("Event already exists:", title);
//             }
//         } catch (error) {
//             console.error("Error saving event:", error);
//         }
//     }

//     // Close the browser
//     await browser.close();
// };




//use cheerio

import axios from 'axios';
import * as cheerio from 'cheerio';

import { EventModel } from "./model/Eventmodel.js";

export const scrapeEvents = async () => {
    const url = 'https://www.australia.com/en/events/australias-events-calendar.html'; // Target website

    try {
        // Fetch the HTML content of the page
        const { data } = await axios.get(url);

        // Load the HTML into Cheerio
        const $ = cheerio.load(data);

        // Extract event details using Cheerio
        const events = [];
        $('.common-events-calendar-results-tile-container').each((index, element) => {
            const title = $(element).find('.common-events-calendar-results-tile__title').text().trim() || 'No title';
            let date = $(element).find('.ta-image__dates').text().trim() || 'No date';
            date = date.replace(/\n/g, ' ').replace(/\s+/g, ' '); // Clean up the date format
            const location = $(element).find('.common-events-calendar-results-tile__location').text().trim() || 'No location';
            const link = $(element).find('.common-events-calendar-results-tile__link').attr('href') || 'No link';
            const image = $(element).find('.ta-image-landscape img').attr('src') || 'No image';

            events.push({ title, date, location, link, image });
        });

        // Save events to the database
        for (const event of events) {
            const { title, date, location, link, image } = event;
            try {
                const existingEvent = await EventModel.findOne({ title, date });
                if (!existingEvent) {
                    await EventModel.create({ title, date, location, link, image });
                    console.log("New event added successfully:", title);
                } else {
                    console.log("Event already exists:", title);
                }
            } catch (error) {
                console.error("Error saving event:", error);
            }
        }

    } catch (error) {
        console.error("Error fetching the page:", error);
    }
};
