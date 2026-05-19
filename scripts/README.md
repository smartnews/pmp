# Operator scripts

Out-of-band tooling for incidents, onboarding, and one-off DB operations. Every script in this directory should:

- Mirror the equivalent application code path exactly (do not invent new business logic here).
- Be idempotent or explicitly print "already exists" / "no-op" when re-run.
- Connect via the standard `DATABASE_URL` env var (no hard-coded hosts).
- Print structured JSON output so it can be piped into incident logs.

## Connecting to Postgres

The RDS hosts are in the SmartNews VPC — you must run from a host that can reach them (SmartNews VPN, an EKS pod, or any other in-VPC machine).

The `DATABASE_URL` (including credentials) is stored in the K8s configmap that the server pod consumes. Read it out at runtime — do not copy/paste it into docs, chat, or tickets.

```bash
# Make sure your kubectl context points at the right cluster + namespace first.
# DEV cluster, namespace: gai-platform
# PRD cluster, namespace: gai-platform

kubectl get configmap llm-ops-server-env-local \
  -n gai-platform \
  -o jsonpath='{.data.DATABASE_URL}'
```

The configmap manifests live at:

- DEV: `kubernetes/dev/server/-env-local-configmap.yaml`
- PRD: `kubernetes/prd/server/-env-local-configmap.yaml`

### Security note

The Postgres credentials for DEV and PRD are stored in plain configmaps, not in AWS Secrets Manager (only ClickHouse credentials are, see `kubernetes/{dev,prd}/server/external-secret.yaml`). This is a separate hardening item — track it as a follow-up. Until that's fixed, keep the credentials inside the configmap and out of any wider-circulating doc.

## Available scripts

### `add-user.ts` — onboard a new user

After the auth-guard fix that rejects unknown emails, the in-app `signupUser` mutation can no longer bootstrap brand-new users (it's behind `AuthGuard` like everything else). Use this script instead.

```bash
# Read the URL out of the configmap and pass it through (don't echo it).
DATABASE_URL=$(kubectl get configmap llm-ops-server-env-local \
  -n gai-platform \
  -o jsonpath='{.data.DATABASE_URL}') \
  npx tsx scripts/add-user.ts \
    --email "newuser@smartnews.com" \
    --name "New User"
```

If you don't have VPN / VPC reachability from your laptop, run the script inside a debug pod in the cluster instead:

```bash
# Spin up a Node container in the cluster, mount nothing, then clone the repo
# or copy the script in, then run as above.
kubectl run -it --rm node-debug \
  --image=node:18-alpine \
  --restart=Never \
  -n gai-platform \
  -- sh
```

What it does (mirrors `UsersService.createUser` exactly):

1. Creates the `User` row (UUID id, lowercased email).
2. Creates an `Organization` named `"<name>'s Organization"` with the user as its first `OrganizationMember` (Admin role).
3. Mints an `ApiKey` (`llm_ops_<32 hex>`) for that organization.

Idempotent: if the email already exists, prints the existing user id and exits 0 without creating duplicates.

Output is JSON. Capture it — the API key is the only place the new key is shown.

If `UsersService.createUser` is ever modified (`apps/server/src/app/identity/users.service.ts`), this script must be updated to match.
