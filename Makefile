# Machine-specific settings live in gitignored .env files (server/.env holds
# ROOT_DIR), so these targets work unchanged on any machine.

.PHONY: prod build deps deploy

# The production shape: one uvicorn process serving both the API and the built
# frontend from client/dist. Bound to 127.0.0.1 -- reach it over Tailscale or an
# SSH tunnel, never by binding 0.0.0.0. No --reload; that is a dev flag.
prod:
	cd server && .venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000

# Build the frontend into client/dist, which main.py serves via app.frontend().
build:
	npm --prefix client run build

# Refresh dependencies. Both commands are cheap no-ops when nothing changed, so
# running them on every deploy costs a second and prevents building against
# packages that are not installed.
deps:
	server/.venv/bin/pip install -r server/requirements.txt
	npm --prefix client install

# Update a deployment in place. Frontend changes take effect as soon as the
# build finishes, because static files are read per request -- a hard refresh
# may be needed, since asset filenames are content-hashed. Python modules are
# imported once, so restart `make prod` after any backend change.
#
# `tailscale serve` is deliberately not here: it writes persistent state into
# tailscaled that outlives the process, so re-applying it per run would leave
# the proxy answering after uvicorn stops. It is one-time setup.
deploy:
	git pull
	$(MAKE) deps
	$(MAKE) build
