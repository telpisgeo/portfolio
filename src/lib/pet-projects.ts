import homeJson from "@/data/home.json";
import type { HomeContent } from "@/lib/home-content";

// The pet-project section/menu item is shown per locale only when that locale
// has at least one project (an empty list in the admin hides it).
export function hasPetProjects(locale: string): boolean {
  if (locale !== "uk" && locale !== "en") return false;
  return ((homeJson as unknown as HomeContent)[locale].petProjects?.items.length ?? 0) > 0;
}
