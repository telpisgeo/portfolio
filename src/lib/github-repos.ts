export type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  pushed_at: string;
  topics: string[];
};

type RawGithubRepo = GithubRepo & {
  fork: boolean;
  archived: boolean;
};

export async function getGithubRepos(username: string, limit = 4): Promise<GithubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];

    const data = (await res.json()) as RawGithubRepo[];
    return data
      .filter((repo) => !repo.fork && !repo.archived)
      .slice(0, limit)
      .map(({ name, description, html_url, homepage, language, pushed_at, topics }) => ({
        name,
        description,
        html_url,
        homepage,
        language,
        pushed_at,
        topics: topics ?? [],
      }));
  } catch {
    return [];
  }
}
