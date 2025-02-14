"use client";

import { useEffect, useState } from "react";
import { TEvent } from "@/types";
import axios from "axios";
import EventCard from "@/components/EventCard";
import { FilterBar } from "@/components/FilterBar";
import { motion, AnimatePresence } from "framer-motion";
import SignIn from "@/components/SignIn";

export default function Home() {
  const [allEvents, setAllEvents] = useState<TEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TEvent[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");

    axios.get("https://api.hackthenorth.com/v3/events").then((res) => {
      setAllEvents(res.data);
      setFilteredEvents(res.data);
    });
  }, []);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setShowSignIn(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      {showSignIn && <SignIn onSignIn={handleSignIn} />}

      <div className="p-8 py-16 flex flex-col items-center relative">
        {!isAuthenticated ? (
          <button
            onClick={() => setShowSignIn(true)}
            className="absolute top-4 right-4 px-4 py-2 bg-black/20 text-white rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={handleSignOut}
            className="absolute top-4 right-4 px-4 py-2 bg-black/20 text-white rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
          >
            Sign Out
          </button>
        )}

        <FilterBar events={allEvents} onFilterChange={setFilteredEvents} isAuthenticated={isAuthenticated} />

        <AnimatePresence mode="wait">
          <motion.div
            key="event-grid"
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredEvents.map((event: TEvent) => (
              <motion.div
                key={event.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                layout
              >
                <EventCard event={event} allEvents={allEvents} isAuthenticated={isAuthenticated}/>
              </motion.div>
            ))}
            {filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-gray-400 py-12"
              >
                No events found matching your filters
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
