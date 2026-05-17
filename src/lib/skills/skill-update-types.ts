export type SkillGitUpdateStatus =
  | { state: "not_git" }
  | {
      state: "up_to_date";
      localSha: string;
      remoteSha: string;
      branch: string;
      checkedAt: string;
    }
  | {
      state: "update_available";
      localSha: string;
      remoteSha: string;
      branch: string;
      checkedAt: string;
    }
  | { state: "git_error"; message: string; checkedAt: string }
  | { state: "skipped"; reason: string };
