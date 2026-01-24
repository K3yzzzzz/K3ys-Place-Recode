#!/bin/bash

# ==============================
# FastAPI Auto Setup Script
# ==============================

echo "Starting backend setup..."

APP_DIR="$(pwd)"
USER_NAME="$(whoami)"

SERVICE_NAME="fastapi"

ENV_FILE="$APP_DIR/.env"
VENV_DIR="$APP_DIR/venv"

# ------------------------------
# 1. Create Virtual Environment
# ------------------------------
if [ ! -d "$VENV_DIR" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
else
  echo "Virtual environment already exists."
fi

source "$VENV_DIR/bin/activate"

# ------------------------------
# 2. Install Dependencies
# ------------------------------
echo "Installing Python packages..."

pip install --upgrade pip

pip install \
  fastapi \
  uvicorn \
  passlib[bcrypt] \
  pyjwt \
  pydantic \
  python-dotenv \
  "pydantic[email]"

# ------------------------------
# 3. Create .env (if missing)
# ------------------------------
if [ ! -f "$ENV_FILE" ]; then
  echo "Creating .env file..."

  cat > "$ENV_FILE" << EOF
SITE_CODE=welcome_back!
SECRET_KEY=CHANGE_ME_TO_RANDOM_SECRET
DB_PATH=user.db
PORT=8000
ACCESS_TOKEN_EXPIRE_SECONDS=3600
EOF

  echo "WARNING: Edit .env and change SECRET_KEY"
else
  echo ".env file already exists."
fi


# ------------------------------
# 4. Create systemd Service
# ------------------------------
SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME.service"

echo "Creating systemd service..."

sudo tee "$SERVICE_FILE" > /dev/null << EOF
[Unit]
Description=FastAPI Backend
After=network.target

[Service]
User=$USER_NAME
WorkingDirectory=$APP_DIR
ExecStart=$APP_DIR/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF


# ------------------------------
# 5. Enable & Start Service
# ------------------------------
echo "Enabling service..."

sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl restart $SERVICE_NAME

echo "Setup complete!"
echo "Check status: sudo systemctl status $SERVICE_NAME"
