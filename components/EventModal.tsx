import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Users, Link, ExternalLink, Share2 } from "lucide-react";
import { TEvent } from "@/types";
import { TEventColors, TEventLabels } from "./EventCard";

interface EventModalProps {
  event: TEvent;
  isOpen: boolean;
  onClose: () => void;
  allEvents: TEvent[];
  onEventChange: (newEvent: TEvent) => void;
  isAuthenticated: boolean;
}

export default function EventModal({
  event,
  isOpen,
  onClose,
  allEvents,
  onEventChange,
  isAuthenticated,
}: EventModalProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Accessibility is always nice
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const startDateTime = formatDate(event.start_time);
  const endDateTime = formatDate(event.end_time);
  const isSameDay = startDateTime.date === endDateTime.date;

  const relatedEvents = event.related_events
    .map((id) => allEvents.find((e) => e.id === id))
    .filter(
      (e) =>
        e !== undefined &&
        (isAuthenticated || !e.permission || e.permission !== "private")
    ) as TEvent[];

  const handleRelatedEventClick = (relatedEvent: TEvent) => {
    onEventChange(relatedEvent);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?event=${event.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: event.name,
          text: event.description,
          url: shareUrl,
        })
        .catch((error) => {
          console.log("Error sharing:", error);
          copyToClipboard(shareUrl);
        });
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // You might want to add a toast notification here
        console.log("Share link copied to clipboard!");
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-[#1f1f1f] rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white pr-8">
                  {event.name}
                </h2>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-lg w-fit ${
                    TEventColors[event.event_type]
                  }`}
                >
                  {TEventLabels[event.event_type]}
                </span>
              </div>

              {event.description && (
                <p className="text-gray-400">{event.description}</p>
              )}

              <div className="flex justify-between items-center gap-3 text-gray-300">
                {event.speakers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users size={16} className="shrink-0" />
                    <p className="text-sm">
                      {event.speakers.map((speaker) => speaker.name).join(", ")}
                    </p>
                  </div>
                )}
                <div className="flex gap-4 ml-auto">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-sm text-gray-300 hover:text-gray-200 transition-colors"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                  {event.public_url && (
                    <a
                      href={event.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Link size={16} />
                      Public Link
                    </a>
                  )}
                  {isAuthenticated && (
                    <a
                      href={event.private_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink size={16} />
                      Private
                    </a>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 text-gray-300">
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

              {relatedEvents.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">
                    Related Events
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {relatedEvents.map((relatedEvent) => (
                      <div
                        key={relatedEvent.id}
                        className="flex items-center justify-between py-3 rounded-xl bg-black/20 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                        onClick={() => handleRelatedEventClick(relatedEvent)}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              TEventColors[relatedEvent.event_type].split(
                                " "
                              )[1]
                            }`}
                          />
                          <span className="text-gray-400 text-sm line-clamp-1">
                            {relatedEvent.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mr-3">
                          <span
                            className={`text-sm font-medium px-3 flex-shrink-0 py-1 rounded-lg w-fit ${
                              relatedEvent.permission === "private"
                                ? "bg-purple-400/10 text-purple-400"
                                : "bg-blue-400/10 text-blue-400"
                            }`}
                          >
                            {relatedEvent.permission === "private"
                              ? "Private"
                              : "Public"}
                          </span>
                          <span
                            className={`text-sm font-medium px-3 flex-shrink-0 py-1 rounded-lg w-fit ${
                              TEventColors[relatedEvent.event_type]
                            }`}
                          >
                            {TEventLabels[relatedEvent.event_type]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}