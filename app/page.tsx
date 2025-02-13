"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TEvent, TEndpointResponse } from "@/types";
import axios from "axios";
import EventCard from "@/components/EventCard";

export default function Home() {
  // Not using TEndpoint response here since it's not going to be a single event and even if it is it'll be in a list (unlike the type definition for endpoint response)
  const [events, setEvents] = useState<TEvent[]>([]);

  useEffect(() => {
    axios
      .get("https://api.hackthenorth.com/v3/events")
      .then((res) => setEvents(res.data));
  }, []);

  return (
    <div className="">
      {events.map((event: TEvent) => (
        <EventCard event={event} />
      ))}
    </div>
  );
}
