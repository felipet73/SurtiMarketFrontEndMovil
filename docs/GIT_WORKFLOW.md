# Git Workflow

## Objective
Maintain a stable `main` branch and implement all new work through feature/fix branches.

## Rules
- `main` is the stable line.
- Do not commit directly to `main` for new work.
- Every change starts in a new branch.
- Merge only tested/validated branches into `main`.
- Update `CHANGELOG.md` in every branch before merge.

## Branch Naming
- `feature/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`
- `hotfix/<short-description>`

Examples:
- `feature/friends-search-modal`
- `fix/notifications-accept-id`
- `chore/refactor-wallet-pagination`

## Standard Flow
1. Sync `main`.
2. Create branch from `main`.
3. Implement and commit with clear messages.
4. Update `CHANGELOG.md` under `Unreleased`.
5. Open PR / merge request.
6. Review, test, and merge into `main`.
7. Tag stable versions when needed.

## Commands
```bash
# Update main
git checkout main
git pull

# Create branch
git checkout -b feature/my-change

# Commit
git add .
git commit -m "feat: my change"

# Merge back (after review)
git checkout main
git merge --no-ff feature/my-change

# Tag stable baseline/release
git tag -a v1.0.0-baseline -m "Stable baseline"
```

## Changelog Standard
Use this structure in `CHANGELOG.md`:
- `Added`
- `Changed`
- `Fixed`
- `Removed`

