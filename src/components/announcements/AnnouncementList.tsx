import type { Announcement } from "@/types";
import { AnnouncementCard } from "./AnnouncementCard";

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">お知らせ</h2>
      <ul className="space-y-3">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </ul>
    </section>
  );
}
