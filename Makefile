# Machine-specific settings live in gitignored .env files (server/.env holds
# ROOT_DIR), so these targets work unchanged on any machine.

.PHONY: prod build deps deploy restart

# The production shape: one uvicorn process serving both the API and the built
# frontend from client/dist. Bound to 127.0.0.1 -- reach it over Tailscale or an
# SSH tunnel, never by binding 0.0.0.0. No --reload; that is a dev flag.
#
# On the server this command is run by systemd (explorer.service), not by hand.
# Running it there while the unit is active fails with "Address already in use".
# Use `make restart` on the server; keep this target for trying the production
# shape locally.
prod:
	cd server && .venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000

# Restart the app on the server. systemd owns the process, so this replaces the
# old "Ctrl+C and re-run make prod" loop. Needs sudo because explorer.service is
# a system unit; that is the accepted cost of `Restart=always` and start-on-boot.
restart:
	sudo systemctl restart explorer

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
# imported once, so a backend change needs the process replaced.
#
# The restart is unconditional even though frontend-only changes do not need
# one. Restarting when it was unnecessary costs a couple of seconds; skipping it
# when it was necessary means chasing a bug that is already fixed in the source
# but not in the running process. Always-correct beats optimal here. Making it
# conditional is a deliberate follow-up, not something to guess at per deploy.
#
# `tailscale serve` is deliberately not here: it writes persistent state into
# tailscaled that outlives the process, so re-applying it per run would leave
# the proxy answering after uvicorn stops. It is one-time setup. That reasoning
# does NOT extend to the restart below -- a restart is not persistent state, it
# is exactly what a backend change requires.
deploy:
	git pull
	$(MAKE) deps
	$(MAKE) build
	$(MAKE) restart
