import os

# Use Render-provided PORT, default to 10000 for local dev
port = int(os.getenv('PORT', '10000'))
workers = int(os.getenv('WEB_CONCURRENCY', '1')) or 1
worker_class = "sync"
bind = f"0.0.0.0:{port}"
# Increase timeout to allow model loading
timeout = int(os.getenv('GUNICORN_TIMEOUT', '120'))

workers = 2
worker_class = "sync"
bind = "0.0.0.0:10000"
timeout = 120
