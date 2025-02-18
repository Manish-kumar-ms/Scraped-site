# 🎟 Event Recommendation & Ticket Booking System  

This project is a **Full Stack MERN Application** that scrapes events from websites, recommends events based on user preferences using **LLM (Gemini AI)**, and sends WhatsApp notifications when events match user interests.  

## 🚀 Features  

## 🌐 Deployment Links

- **Frontend**: [https://scraped-site.onrender.com](https://scraped-site.onrender.com)
- **Backend**: [https://scraped-site-backend.onrender.com](https://scraped-site-backend.onrender.com)

### **🔍 Event Scraping & Listing**  
- Automatically scrapes **Sydney, Australia** events using **Puppeteer**.  
- Displays upcoming events with **title, date, location, image, and link**.  

### **🤖 AI-Powered Event Recommendation**  
- Uses **Google Gemini AI** to suggest events based on user interests.  
- Accepts user preferences (e.g., "music festivals in Sydney").  
- Provides recommended event **title** and **link**.  

### **📩 WhatsApp Notifications**  
- Sends event recommendations to users via **WhatsApp API**.  
- Users receive event details directly in their WhatsApp inbox.  

### **🛒 Ticket Booking with Email Capture**  
- Users **click "Get Ticket"**, enter their email, and are redirected to the **event's official booking site**.  
- Stores user emails for event organizers.  

---

## **🛠 Technologies Used**  

| Stack    | Technologies |
|----------|-------------|
| **Frontend**  | React.js, Tailwind CSS, React Toastify |
| **Backend**   | Node.js, Express.js, LangChain, Google Gemini AI |
| **Database**  | MongoDB, Mongoose |
| **Web Scraping** | Puppeteer |
| **Notifications** | Twilio WhatsApp API |
| **Job Scheduling** | Node-Cron |

---

## **📁 Project Structure**  

```plaintext
event-recommendation-system/
├── backend/
│   ├── controllers/
│   │   ├── eventController.js          # Fetch and store events
│   │   ├── recommendationController.js # LLM-powered event recommendations
│   │   ├── whatsappController.js       # WhatsApp notifications
│   ├── models/
│   │   ├── EventModel.js               # MongoDB event schema
│   ├── routes/
│   │   ├── eventRoutes.js              # Event API endpoints
│   │   ├── recommendationRoutes.js     # Recommendation API endpoints
│   ├── utils/
│   │   ├── scraper.js                   # Puppeteer scraping logic
│   │   ├── refresh.js                   # Cron job to refresh events daily
│   ├── config/
│   │   ├── db.js                        # MongoDB connection
│   ├── index.js                         # Main backend entry point
│   ├── package.json
│   └── .env                             # API keys & environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.jsx            # Event display card
│   │   │   ├── RecommendationForm.jsx   # Form to get AI recommendations
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Main page with events & recommendations
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── styles.css
│   ├── public/
│   ├── package.json
│   └── .env                             # Frontend environment variables
│
├── README.md
├── .gitignore
```




### **4️⃣ Start the Application**  

#### **Run Backend**
```sh
cd backend
npm start
```

#### **Run Frontend**
```sh
cd frontend
npm run dev
```

---

## **📡 API Endpoints**  

### **📌 Events API**  
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/events` | Get all events |
| `POST` | `/api/email/:eventId` | Store user email for an event |

### **📌 AI Recommendation API**  
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/recommend-event` | Get event recommendations based on user preferences |

---

## **📢 WhatsApp Notification Example**  
When a user requests recommendations, they receive:  
```
🎉 Event Recommendation:
1️⃣ Music Festival 🎵
🔗 https://eventsite.com/musicfest

2️⃣ Tech Conference 🏢
🔗 https://eventsite.com/techconf
```


