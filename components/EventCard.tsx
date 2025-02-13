import { TEvent } from "@/types";

export default function EventCard({ event }: { event: TEvent }) {
  return (
    <div className="bg-slate-950 border border-white" key={event.id}>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
    </div>
  );
}
