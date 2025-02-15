"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Link,
  ExternalLink,
  Share2,
} from "lucide-react";
import { TEvent } from "@/types";
import EventModal from "@/components/EventModal";
import { useRouter, useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";

// So that tailwind can actually compile the colours
export const TEventColors = {
  workshop: "bg-yellow-400/10 text-yellow-400 hover:border-yellow-400",
  activity: "bg-blue-400/10 text-blue-400 hover:border-blue-400",
  tech_talk: "bg-green-400/10 text-green-400 hover:border-green-400",
};

export const TEventLabels = {
  workshop: "Workshop",
  activity: "Activity",
  tech_talk: "Tech Talk",
};

function FunnyDivider() {
  return <div className="bg-gray-400 h-[1px] rounded-full w-full my-3" />;
}

export default function EventCard({
  event,
  allEvents,
  isAuthenticated,
}: {
  event: TEvent;
  allEvents: TEvent[];
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(event);
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type: "success" | "error";
  }>({
    message: "",
    isVisible: false,
    type: "success",
  });

  useEffect(() => {
    const eventId = searchParams.get("event");
    if (eventId && Number(eventId) === event.id) {
      if (!isAuthenticated && event.permission == "private") {
        showToast("Please log in to view private event details", "error");
        return;
      } else {
        setIsModalOpen(true);
      }
    }
  }, [searchParams, event.id]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, isVisible: true, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

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
    }, 70);
  };

  const handleCardClick = () => {
    if (!isAuthenticated && event.permission === "private") {
      showToast("Please log in to view private event details", "error");
      return;
    }

    setModalEvent(event);
    setIsModalOpen(true);
    router.push(`?event=${event.id}`, { scroll: false });
  };

  const handlePrivateLink = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast("Please log in to view private event details", "error");
      return;
    }
    window.open(event.private_url, "_blank");
  };

  useEffect(() => {
    const eventId = searchParams.get("event");
    if (eventId && Number(eventId) === event.id) {
      if (!isAuthenticated && event.permission === "private") {
        showToast("Please log in to view private event details", "success");
        setTimeout(() => {
          router.push("/", { scroll: false });
        }, 100);
        // Not working, unfortunately I'm running out of time so I'll just leave it.
      } else {
        setIsModalOpen(true);
      }
    }
  }, [searchParams, event.id]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push("/", { scroll: false });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      .then(() => showToast("Share link copied to clipboard!", "success"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCardClick}
        className={`bg-[#1f1f1f] rounded-xl p-5 h-full min-h-64 flex flex-col border border-[#1f1f1f] ${
          TEventColors[event.event_type].split(" ")[2]
        } transition-colors cursor-pointer`}
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
          <div className="flex justify-between">
            {event.speakers.length > 0 && (
              <div className="flex items-center gap-2 text-gray-300">
                <Users size={16} className="shrink-0" />
                <p className="text-sm">
                  {event.speakers.map((speaker) => speaker.name).join(", ")}
                </p>
              </div>
            )}
            <div className="flex gap-2 ml-auto">
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link size={16} />
                  Public
                </a>
              )}
              {isAuthenticated && (
                <button
                  onClick={handlePrivateLink}
                  className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink size={16} />
                  Private
                </button>
              )}
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
        onClose={handleModalClose}
        allEvents={allEvents}
        onEventChange={handleEventChange}
        isAuthenticated={isAuthenticated}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onHide={hideToast}
      />
    </>
  );
}
