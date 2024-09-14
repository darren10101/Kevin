FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements first to leverage caching
COPY requirements.txt .

# Install the required dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Add Python3 to PATH
ENV PATH="/usr/local/bin/python3:$PATH"

# Copy the remaining project files
COPY . .

# Expose the port Flask will run on
EXPOSE 5000

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Command to run the Flask application using python3
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]
