export const EVENT_COLUMNS = {
  /** EventsPage masonry cards */
  list: 'id, title, date, time, location, description, poster_path, is_published, created_at',
  /** HeroSection upcoming cards — minimal */
  hero: 'id, title, description, poster_path, start_timestamp',
  /** MemberDashboard CRUD */
  dashboard: 'id, title, date, time, location, description, poster_path, created_at',
} as const;

export type EventRow = {
  id: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  poster_path?: string;
  created_at?: string;
  start_timestamp?: string;
  is_published?: boolean;
};

export type EnrichedEvent = EventRow & { posterUrl: string | null };
