import React, { useEffect, useState } from "react";
import { handleError, handleSucess } from "../../utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
    const [events, setEvents] = useState([]); // Store all events
    const [recommendedEvents, setRecommendedEvents] = useState([]); // Store multiple recommended events
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [preferences, setPreferences] = useState("");
    const [location, setLocation] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Fetch events from backend
    const fetchEvents = async () => {
        try {
            const response = await fetch("https://scraped-site-backend.onrender.com/api/event", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            if (result.success) {
                setEvents(result.data);
            } else {
                handleError(result.message || "Failed to fetch events");
            }
        } catch (error) {
            handleError("Something went wrong while fetching events");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle "Get Ticket" button click
    const handleGetTicket = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    // Handle email submission
    const handleEmailSubmit = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email.");
            return;
        }

        try {
            const response = await fetch(`https://scraped-site-backend.onrender.com/api/email/${selectedEvent._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (result.success) {
                handleSucess("Redirecting to ticket site...");
                setTimeout(() => {
                    window.open(selectedEvent.link, "_blank"); // Open ticket site in new tab
                }, 2000);
            } else {
                handleError(result.message || "Error saving email.");
            }
        } catch (error) {
            handleError("Something went wrong in email submit.");
        }

        setShowModal(false);
    };

    // Handle Event Recommendation Request
    const getRecommendation = async () => {
        if (!preferences || !location || !phoneNumber) {
            toast.error("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch("https://scraped-site-backend.onrender.com/api/recommend-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ preferences, location, phoneNumber }),
            });

            const data = await response.json();

            if (data.success) {
                setRecommendedEvents(data.recommendations); // ✅ Store all recommended events
                toast.success("✅ Recommended events found!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("❌ Error fetching recommendation.");
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Upcoming Events</h1>

            {/* Event Recommendation Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Find Events Based on Your Interests</h2>
                <input 
                    type="text"
                    placeholder="Enter your interests (e.g. music, tech)"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="w-full p-2 mb-4 border rounded bg-gray-700 text-white"
                />
                <input 
                    type="text"
                    placeholder="Enter your city"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 mb-4 border rounded bg-gray-700 text-white"
                />
                <input 
                    type="text"
                    placeholder="Enter your WhatsApp number in format +91XXXXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 mb-4 border rounded bg-gray-700 text-white"
                />
                <button 
                    onClick={getRecommendation}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                    Get Recommendations
                </button>

                {/* Show Recommended Events */}
                {recommendedEvents.length > 0 && (
                    <div className="mt-4 bg-gray-700 p-4 rounded-lg text-white">
                        <h3 className="text-lg font-bold">🎟 Recommended Events:</h3>
                        <ul>
                            {recommendedEvents.map((event, index) => (
                                <li key={index} className="mt-2">
                                    <p className="text-lg">{event.title}</p> 
                                    <a 
                                        href={event.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-400 underline mt-1 block"
                                    >
                                        View Event
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* All Events Listing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {events.map((event, index) => (
                    <div key={index} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                        <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                        <h2 className="text-lg font-bold">{event.title}</h2>
                        <p className="text-sm text-gray-400">{event.location}</p>
                        <p className="text-sm text-gray-400">{event.date}</p>
                        <button 
                            onClick={() => handleGetTicket(event)}
                            className="mt-4 block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            Get Ticket
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal for Email Input */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Enter Your Email</h2>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email..."
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        />
                        <button 
                            onClick={handleEmailSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            Continue to Ticket Site
                        </button>
                        <button 
                            onClick={() => setShowModal(false)}
                            className="mt-2 w-full bg-gray-500 hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Home;
