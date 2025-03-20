FROM python:3.10-slim

# Set environment variables to prevent Python from writing pyc files to disc
# and to ensure that the Poetry installation doesn't require interactive prompts
ENV PYTHONUNBUFFERED 1
ENV POETRY_VIRTUALENVS_CREATE false

WORKDIR /app

RUN pip install --no-cache-dir poetry

COPY pyproject.toml poetry.lock /app/

RUN poetry install --only main
COPY . /app/

EXPOSE 8000

# Run the FastAPI app using uvicorn
CMD ["sh", "-c", "poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000"]
