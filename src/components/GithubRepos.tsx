import { getGithubRepos, type GithubRepo } from "@/lib/github-repos";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { translations, type Locale } from "@/lib/translations";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const GITHUB_USERNAME = "telpisgeo";

const TOPIC_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  "next-js": "Next.js",
  typescript: "TypeScript",
  javascript: "JavaScript",
  tailwindcss: "Tailwind CSS",
  "tailwind-css": "Tailwind CSS",
  react: "React",
  nodejs: "Node.js",
};

function displayTag(tag: string) {
  return TOPIC_LABELS[tag.toLowerCase()] ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}

function repoTags(repo: GithubRepo) {
  const tags = [repo.language, ...repo.topics.map(displayTag)].filter(
    (tag): tag is string => Boolean(tag)
  );
  return Array.from(new Set(tags)).slice(0, 3);
}

function RepoCard({ repo, locale, t }: { repo: GithubRepo; locale: Locale; t: (typeof translations)[Locale] }) {
  const tags = repoTags(repo);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate">{repo.name}</span>
          {repo.homepage && <Badge variant="secondary">{t.githubLiveLabel}</Badge>}
        </CardTitle>
        <CardDescription className="line-clamp-1">
          {repo.description || "—"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {t.githubUpdatedLabel} {formatRelativeTime(repo.pushed_at, locale)}
        </p>

        <div className="flex gap-2 pt-1">
          {repo.homepage && (
            <Button
              render={<a href={repo.homepage} target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
              size="sm"
            >
              {t.githubLiveLabel}
            </Button>
          )}
          <Button
            render={<a href={repo.html_url} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            {t.githubCodeLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RepoCardSkeleton() {
  return (
    <div className="rounded-xl ring-1 ring-foreground/10 p-4 animate-pulse">
      <div className="h-5 w-1/2 rounded bg-muted mb-3" />
      <div className="h-4 w-3/4 rounded bg-muted mb-4" />
      <div className="h-4 w-1/3 rounded bg-muted" />
    </div>
  );
}

export default async function GithubRepos({ locale }: { locale: Locale }) {
  const t = translations[locale];
  const repos = await getGithubRepos(GITHUB_USERNAME);

  return (
    <section className="py-16">
      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-8">
          <h2 className="text-4xl font-medium text-foreground leading-tight">
            {t.githubTitle}
          </h2>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            @{GITHUB_USERNAME}
          </a>
        </div>

        {repos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {repos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} locale={locale} t={t} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <RepoCardSkeleton key={i} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">{t.githubEmptyState}</p>
          </>
        )}
      </div>
    </section>
  );
}
