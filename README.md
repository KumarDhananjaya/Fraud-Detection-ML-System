<div align="center">
  <div p-4 bg-indigo-600 rounded-xl inline-block>
    <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="60" height="60" alt="Shield icon">
  </div>
  
  <h1 align="center">FraudLens - ML Fraud Detection System</h1>

  <p align="center">
    An end-to-end Machine Learning pipeline and aesthetic web dashboard for real-time credit card fraud detection.
    <br />
    <a href="https://fraud-detection-ml-system-seven.vercel.app/"><strong>View Live Demo »</strong></a>
  </p>
</div>

<hr />

## 🌟 Overview
FraudLens is a full-stack Machine Learning application built to classify credit card transactions as fraudulent or genuine in real-time. It uses an **XGBoost** classifier exposed via a high-performance **FastAPI** backend, and is accessed through a modern, responsive **React + Vite** frontend.

The system is designed to handle 30 specific transaction features (Time, Amount, and V1-V28 PCA features) and instantly calculates the probability of fraudulent activity, providing clear visual risk assessments.

---

## 🚀 Live Demo
**Frontend (Vercel):** [https://fraud-detection-ml-system-seven.vercel.app/](https://fraud-detection-ml-system-seven.vercel.app/)

*(Note: The backend is hosted on a free Render tier. It may take ~50 seconds to wake up if it hasn't been used recently!)*

---

## 💻 Tech Stack

**Frontend:**
- React 19 + Vite
- TypeScript
- Tailwind CSS v4 (Utility-first styling)
- Lucide React (Iconography)
- Axios (API Client)

**Backend:**
- FastAPI (High-performance Python web framework)
- Uvicorn (ASGI web server)
- Pydantic (Data validation)

**Machine Learning:**
- XGBoost (Gradient Boosting framework)
- Scikit-Learn
- Pandas & NumPy

---

## ✨ Features

- **Real-Time Inference:** Instantaneous fraud probability calculation.
- **Modern Dashboard:** A beautiful, responsive UI built with Tailwind CSS.
- **Demo Data Injectors:** Pre-loaded "Demo Genuine" and "Demo Fraud" buttons allow users to easily test the model without manually typing 30 variables.
- **Visual Risk Indicators:** Color-coded results (Emerald for safe, Rose for fraud) with animated probability progress bars.
- **Dynamic Model Metadata:** Automatically fetches and displays the active model algorithm, version, and threshold from the backend.

---

## 🛠️ Local Development

Want to run this project on your local machine? Follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/KumarDhananjaya/Fraud-Detection-ML-System.git
cd Fraud-Detection-ML-System
```

### 2. Setup the Backend (FastAPI)
```bash
# Create a virtual environment (optional but recommended)
python -m venv .venv
source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --reload
```
The backend API will be available at `http://localhost:8000`

### 3. Setup the Frontend (React + Vite)
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will be available at `http://localhost:5173`. It is pre-configured to point to the local backend during development.

---

## 📁 Project Structure

```text
Fraud-Detection-ML-System/
├── app/                      # FastAPI Backend
│   ├── main.py               # API endpoints (health, predict, model)
│   ├── model.py              # ML model inference logic
│   ├── schemas.py            # Pydantic data validation schemas
│   └── services/             # Prediction service
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # Dashboard, Form, and Result components
│   │   ├── lib/              # Utility functions (Tailwind merge)
│   │   ├── App.tsx           # Main application entry
│   │   └── main.tsx          # React DOM renderer
│   ├── package.json          # Node dependencies
│   └── vite.config.ts        # Vite + Tailwind configuration
├── notebooks/                # Jupyter Notebooks for data exploration & training
├── data/                     # Dataset storage (gitignored)
├── results/                  # Saved ML models and evaluation metrics
├── Dockerfile                # Backend containerization
└── requirements.txt          # Python dependencies
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
