"use client";

import { useEffect, useState } from "react";
import { TEvent, TEndpointResponse } from "@/types";
import axios from "axios";
import EventCard from "@/components/EventCard";
import { motion } from "framer-motion";

export default function Home() {
  const [events, setEvents] = useState<TEvent[]>([]);

  useEffect(() => {
    axios
      .get("https://api.hackthenorth.com/v3/events")
      .then((res) => setEvents(res.data));
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="p-8">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {events.map((event: TEvent, index: number) => (
          <motion.div
            key={event.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <EventCard event={event} allEvents={events} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}