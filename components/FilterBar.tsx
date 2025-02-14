import { useEffect, useState } from "react";
import { Search, ChevronUp, ChevronDown, RotateCcw } from "lucide-react";
import { TEvent, TEventType } from "@/types";
import { TEventLabels } from "./EventCard";
import { motion, AnimatePresence } from "framer-motion";

interface FilterBarProps {
  events: TEvent[];
  onFilterChange: (filteredEvents: TEvent[]) => void;
}

type SortField = "name" | "start_time" | "event_type";
type SortDirection = "asc" | "desc";

interface FilterState {
  searchTerm: string;
  eventType: TEventType | "all";
  sortField: SortField;
  sortDirection: SortDirection;
  showPrivate: boolean | null;
}

const menuVariants = {
  hidden: {
    opacity: 0,
    y: -5,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" },
  },
};

const STORAGE_KEY = "event_filter_state";

const defaultState: FilterState = {
  searchTerm: "",
  eventType: "all",
  sortField: "start_time",
  sortDirection: "desc",
  showPrivate: null,
};

export function FilterBar({ events, onFilterChange }: FilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(defaultState.searchTerm);
  const [eventType, setEventType] = useState<TEventType | "all">(defaultState.eventType);
  const [sortField, setSortField] = useState<SortField>(defaultState.sortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultState.sortDirection);
  const [showPrivate, setShowPrivate] = useState<boolean | null>(defaultState.showPrivate);
  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);

  // Load saved state from localStorage after component mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setSearchTerm(parsedState.searchTerm);
        setEventType(parsedState.eventType);
        setSortField(parsedState.sortField);
        setSortDirection(parsedState.sortDirection);
        setShowPrivate(parsedState.showPrivate);
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
  }, []);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleReset = () => {
    setSearchTerm(defaultState.searchTerm);
    setEventType(defaultState.eventType);
    setSortField(defaultState.sortField);
    setSortDirection(defaultState.sortDirection);
    setShowPrivate(defaultState.showPrivate);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isFiltered =
    searchTerm !== "" ||
    eventType !== "all" ||
    showPrivate !== null ||
    sortField !== "start_time" ||
    sortDirection !== "desc";

  useEffect(() => {
    if (isEventTypeOpen) setIsPermissionOpen(false);
  }, [isEventTypeOpen]);

  useEffect(() => {
    if (isPermissionOpen) setIsEventTypeOpen(false);
  }, [isPermissionOpen]);

  // Save filter state to localStorage whenever it changes
  useEffect(() => {
    const currentState: FilterState = {
      searchTerm,
      eventType,
      sortField,
      sortDirection,
      showPrivate,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [searchTerm, eventType, sortField, sortDirection, showPrivate]);

  useEffect(() => {
    let filtered = [...events];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.speakers.some((speaker) =>
            speaker.name.toLowerCase().includes(searchLower)
          )
      );
    }

    if (eventType !== "all") {
      filtered = filtered.filter((event) => event.event_type === eventType);
    }

    if (showPrivate !== null) {
      filtered = filtered.filter((event) =>
        showPrivate
          ? event.permission === "private"
          : event.permission === "public"
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "start_time":
          comparison = a.start_time - b.start_time;
          break;
        case "event_type":
          comparison = a.event_type.localeCompare(b.event_type);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    onFilterChange(filtered);
  }, [events, searchTerm, eventType, sortField, sortDirection, showPrivate]);

  return (
    <div className="mb-8 space-y-4 flex flex-col w-full px-4 max-w-[50rem]">
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-grow w-full md:w-[40%]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            placeholder="Search events, descriptions, or speakers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1f1f1f] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsEventTypeOpen(!isEventTypeOpen)}
            className="px-4 py-2 bg-[#1f1f1f] border border-gray-800 rounded-lg text-white hover:border-gray-600 transition-colors flex items-center gap-2"
          >
            <span>
              {eventType === "all" ? "Event Type" : TEventLabels[eventType]}
            </span>
            <motion.div
              animate={{ rotate: isEventTypeOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-gray-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {isEventTypeOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuVariants}
                className="absolute top-full mt-2 w-32 bg-[#1f1f1f] border border-gray-800 rounded-lg shadow-xl overflow-hidden z-10"
              >
                <div className="py-1">
                  {[
                    { value: "all", label: "All Types" },
                    { value: "workshop", label: "Workshop" },
                    { value: "activity", label: "Activity" },
                    { value: "tech_talk", label: "Tech Talk" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setEventType(item.value as TEventType | "all");
                        setIsEventTypeOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white hover:text-[#aaaaaa] transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsPermissionOpen(!isPermissionOpen)}
            className="px-4 py-2 bg-[#1f1f1f] border border-gray-800 rounded-lg text-white hover:border-gray-600 transition-colors flex items-center gap-2"
          >
            <span>
              {showPrivate === null
                ? "Permission"
                : showPrivate
                ? "Private"
                : "Public"}
            </span>
            <motion.div
              animate={{ rotate: isPermissionOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-gray-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {isPermissionOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuVariants}
                className="absolute top-full mt-2 w-32 bg-[#1f1f1f] border border-gray-800 rounded-lg shadow-xl overflow-hidden z-10"
              >
                <div className="py-1">
                  {[
                    { value: null, label: "All Events" },
                    { value: true, label: "Private" },
                    { value: false, label: "Public" },
                  ].map((item) => (
                    <button
                      key={String(item.value)}
                      onClick={() => {
                        setShowPrivate(item.value);
                        setIsPermissionOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white hover:text-[#aaaaaa] transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-400">Sort by:</div>
          <motion.div className="flex gap-2"
          >
            {[
              { field: "name" as SortField, label: "Name" },
              { field: "start_time" as SortField, label: "Date" },
              { field: "event_type" as SortField, label: "Type" },
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className="px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 rounded-md transition-colors flex items-center gap-1.5"
              >
                {label}
                {sortField === field && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: sortDirection === "asc" ? 0 : 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronUp size={16} />
                  </motion.div>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          {isFiltered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={14} />
              Reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}