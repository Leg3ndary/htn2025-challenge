import { TEvent } from "@/types";

export default function EventCard({ event }: { event: TEvent }) {
  return (
    <div className="bg-black rounded-xl p-4 border border-white h-64 space-y-2" key={event.id}>
      <h2 className="text-xl font-black">{event.name}</h2>
      <p className="line-clamp-3">{event.description}</p>
    </div>
  );
}
