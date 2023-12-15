# run the app in prod
# gunicorn -c gunicorn_config.py wsgi:app

bind = "0.0.0.0:5001"

workers = 5

timeout = 300