# Sri Lankan Food Price Predictor

full-stack machine learning web application designed to forecast retail food prices and identify the most cost-effective markets across Sri Lanka. Built with React frontend and FastAPI machine learning backend, deployed using AWS.

## Key Features

* **Local Food Price Predictor:** Forecasts expected retail prices for specific foods across various markets and economic centers in Sri Lanka.
* **Cheapest Market Predictor:** Scans multiple regional markets to recommend the top 3 most cost-effective locations to purchase foods.

## Tech Stack
**Frontend** - React <br>
**Backend** - FastAPI (Python) <br>
**ML Model** - Python <br>
**Dataset** - https://data.humdata.org/dataset/wfp-food-prices-for-sri-lanka/resource/3638f0d6-9969-48cf-a919-1d879d037ec6

## Deployment Notes
**Frontend** - AWS Amplify (connected to GitHub) <br> <br>
**Backend** - Hosted on an AWS EC2 Ubuntu instance with Elastic IP managed via PM2 (auto restarts), reverse-proxied through Nginx, and secured with automated SSL certificate renewals via Certbot plus sslip.io dynamic secure mapping for IP-based SSL. <br> <br>
Live link - https://main.d11xh844c5s7xn.amplifyapp.com/ <br>
(Currently EC2 instance stopped to save free tier credits)

## Getting Started Locally
**Prerequisites** - Node.js, npm, Python 3.10+ <br> <br>
**1. Clone Repo** <br> <br>
**2. Run Backend - Execute this commonds one by one** <br> <br>
cd backend <br>
python -m venv venv <br>
source venv/Scripts/activate # for Windows<br>
source venv/bin/activate # for macOS/Linux <br>
pip install -r requirements.txt <br>
uvicorn main:app --reload --port 8000   <br> <br>
**3. change api calls to like this in App.tsx**<br> <br>
'http://127.0.0.1:8000/predict' <br>
'http://127.0.0.1:8000/analyze-markets' <br> <br>
**3. Run Frontend - Execute this commonds one by one** <br> <br>
cd frontend <br>
npm install <br>
npm run dev <br> <br>
**4. Check this running from hit Localhost 5173**
