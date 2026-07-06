const GITHUB_REPO = "telpisgeo/portfolio";
const GITHUB_BRANCH = "main";

async function githubRequest(path: string, token: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "portfolio-admin",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `GitHub API помилка: ${res.status}`);
  }
  return res.json();
}

// A file is either raw text (committed as utf-8) or already-base64-encoded
// binary data (e.g. an image produced by sharp).
export type CommitFileInput = string | { content: string; encoding: "base64" };

// Commits multiple files atomically in a single commit via the Git Data API,
// so one admin save produces exactly one deploy.
export async function commitFiles(token: string, files: Record<string, CommitFileInput>, message: string) {
  const ref = await githubRequest(`/git/ref/heads/${GITHUB_BRANCH}`, token);
  const baseCommitSha = ref.object.sha;

  const baseCommit = await githubRequest(`/git/commits/${baseCommitSha}`, token);
  const baseTreeSha = baseCommit.tree.sha;

  const treeItems = [];
  for (const [path, file] of Object.entries(files)) {
    const isBinary = typeof file === "object";
    const blob = await githubRequest(`/git/blobs`, token, {
      method: "POST",
      body: JSON.stringify({
        content: isBinary ? file.content : file,
        encoding: isBinary ? "base64" : "utf-8",
      }),
    });
    treeItems.push({ path, mode: "100644", type: "blob", sha: blob.sha });
  }

  const tree = await githubRequest(`/git/trees`, token, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
  });

  const commit = await githubRequest(`/git/commits`, token, {
    method: "POST",
    body: JSON.stringify({ message, tree: tree.sha, parents: [baseCommitSha] }),
  });

  await githubRequest(`/git/refs/heads/${GITHUB_BRANCH}`, token, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
}
