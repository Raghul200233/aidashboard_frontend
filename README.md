# 🚀 AI-Powered Data Dashboard

## 📊 Ask Questions. Get Insights. No SQL Required.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

An intelligent data dashboard that lets you upload any CSV file and ask questions in plain English. The system understands your data structure automatically and provides instant answers with visualizations.

---

## ✨ **Demo**
User: "What is the total revenue?"
AI: Total Revenue: $542,891.47

User: "Show top 5 products by revenue as bar chart"
AI: [Generates bar chart automatically]

User: "Compare ORD5 and ORD80"
AI: [Shows side-by-side comparison table]

User: "What is the profit margin percentage?"
AI: Average Profit Margin: 32.5%

User: "Is there a correlation between price and quantity?"
AI: Correlation: -0.42 (moderate negative relationship)

text

---

## 🔥 **Key Features**

| Category | Features |
|----------|----------|
| **Natural Language** | Ask anything about your data in plain English |
| **20+ Question Types** | Count, List, Total, Average, Top/Bottom, Distribution, Trend, Compare, Filter, Multi-Condition, OR Logic, Record Lookup, Compare Records, Profit Margin, Correlation, Forecast, Text Search, Time Intelligence, Quarter Analysis |
| **Auto Visualizations** | Bar charts, Pie charts, Line charts, Scatter plots |
| **Smart Understanding** | Auto-detects column types, builds profiles, matches synonyms |
| **Any Dataset** | Works with sales, healthcare, HR, inventory, finance data |

---

## 🛠️ **Tech Stack**

| Technology | Purpose |
|------------|---------|
| **Node.js** | Backend runtime |
| **Express.js** | API server |
| **Hugging Face Inference** | AI/NLP for intent parsing |
| **Vanilla JS, HTML, CSS** | Frontend interface |
| **CSV Parser** | Data ingestion |

---

## 📁 **Project Structure**
ai-data-dashboard/
├── server.js # Main server entry point
├── routes/
│ ├── upload.js # File upload handling
│ └── analysis.js # Query processing API
├── utils/
│ └── analyzer.js # Smart query analyzer (20+ patterns)
├── services/
│ └── aiService.js # Hugging Face AI integration
├── public/
│ ├── index.html # Dashboard UI
│ ├── style.css # Styling
│ └── script.js # Frontend logic
├── uploads/ # Temporary CSV storage
└── package.json

text

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v18 or higher)
- Hugging Face API Key (free tier works)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Raghul200233/ai-data-dashboard.git
cd ai-data-dashboard
2. Install dependencies

bash
npm install
3. Set up environment variables
Create a .env file in the root directory:

env
HF_API_KEY=your_huggingface_api_key_here
PORT=3000
4. Run the application

bash
npm start
5. Open your browser

text
http://localhost:3000

🧠 How It Works
text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Upload    │────▶│   Analyze   │────▶│   Build     │
│    CSV      │     │   Columns   │     │  Profiles   │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Return    │◀────│   Execute   │◀────│   Parse     │
│   Answer    │     │   Query     │     │  Question   │
└─────────────┘     └─────────────┘     └─────────────┘
Upload CSV → System reads and stores data
Column Detection → Auto-identifies numeric, date, categorical columns
Profile Building → Extracts unique values, min/max, averages
Question Parsing → NLP identifies intent, columns, filters
Query Execution → SmartAnalyzer routes to appropriate handler
Response Generation → Returns text answer or chart

📝 Roadmap
Support for Excel files (.xlsx, .xls)
Database connections (MySQL, PostgreSQL)
Export results as CSV/PDF
Save and share queries
Multi-file joins
More chart types (heatmap, histogram, box plot)
User accounts and query history

⭐ Show Your Support
If this project helped you, please give it a ⭐ on GitHub!

📄 License
This project is licensed under the MIT License.
Made with ❤️ by Raghul | AI-Powered Data Dashboard
