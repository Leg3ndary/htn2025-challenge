"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Link, ExternalLink } from "lucide-react";
import { TEvent } from "@/types";
import EventModal from "@/components/EventModal";

// So that tailwind can actually compile the colours
export const TEventColors = {
  workshop: "bg-yellow-400/10 text-yellow-400",
  activity: "bg-blue-400/10 text-blue-400",
  tech_talk: "bg-green-400/10 text-green-400",
};

export const TEventLabels = {
  workshop: "Workshop",
  activity: "Activity",
  tech_talk: "Tech Talk",
};

// I don't usually name my things oddly but just so you know I'm human!
function FunnyDivider() {
  return <div className="bg-gray-400 h-[1px] rounded-full w-full my-3" />;
}

export default function EventCard({
  event,
  allEvents,
}: {
  event: TEvent;
  allEvents: TEvent[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(event);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const startDateTime = formatDate(event.start_time);
  const endDateTime = formatDate(event.end_time);
  const isSameDay = startDateTime.date === endDateTime.date;

  const handleEventChange = (newEvent: TEvent) => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalEvent(newEvent);
      setIsModalOpen(true);
    }, 70); // So that its fast but not too fast
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setModalEvent(event);
          setIsModalOpen(true);
        }}
        className="bg-[#1f1f1f] rounded-xl p-5 h-full min-h-64 flex flex-col border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg line-clamp-1 font-bold text-white">
              {event.name}
            </h2>
            <span
              className={`text-sm font-medium px-2 mb-1 mx-1 py-1 rounded-lg flex-shrink-0 ${
                TEventColors[event.event_type]
              }`}
            >
              {TEventLabels[event.event_type]}
            </span>
          </div>

          {event.description && (
            <p className="text-gray-400 line-clamp-3">{event.description}</p>
          )}
        </div>

        <div className="mt-auto space-y-2">
          <FunnyDivider />
          <div className="flex justify-between ">
            {event.speakers.length > 0 && (
              <div className="flex items-center gap-2 text-gray-300">
                <Users size={16} className="shrink-0" />
                <p className="text-sm">
                  {event.speakers.map((speaker) => speaker.name).join(", ")}
                </p>
              </div>
            )}
            <div className="flex gap-3 ml-auto">
              {event.public_url && (
                <a
                  href={event.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link size={16} />
                  Public
                </a>
              )}
              <a
                href={event.private_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
                Private
              </a>
            </div>
          </div>
          <div className="flex justify-between text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="shrink-0" />
              <p className="text-sm">
                {isSameDay
                  ? startDateTime.date
                  : `${startDateTime.date} - ${endDateTime.date}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="shrink-0" />
              <p className="text-sm">
                {startDateTime.time} - {endDateTime.time}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <EventModal
        event={modalEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allEvents={allEvents}
        onEventChange={handleEventChange}
      />
    </>
  );
}
