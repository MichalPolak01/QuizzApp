FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src /app/src

EXPOSE 8000

CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]
