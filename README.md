# RepairLens 🔧

**AI-powered repair-vs-replace assistant for smarter and more sustainable decisions.**

RepairLens uses AI-powered image analysis to identify damaged everyday objects, understand visible issues, estimate repair and replacement costs, and recommend whether repairing or replacing the item makes more sense.

## 💡 Problem

When an everyday object breaks, people often don't know:

* What exactly is wrong with it
* Whether it can be repaired
* How serious the damage is
* Approximately how much a repair might cost
* Whether repairing it is worth the cost compared with replacement

RepairLens aims to make this decision easier using AI-based visual analysis.

## ✨ Features

* 📷 Upload an image of a damaged object
* 🤖 AI-powered visual object identification
* 🔍 Analysis of visible damage and likely issues
* 🛠️ Repairability assessment
* 💰 Estimated repair cost range in INR
* 🛒 Estimated replacement cost range in INR
* ⚖️ Repair vs. replace recommendation
* 📊 Damage severity assessment
* 🎯 AI confidence level
* 🌍 Supports a wide range of everyday physical objects

## 📸 Preview
<img width="863" height="622" alt="WhatsApp Image 2026-08-29 at 14 23 39" src="https://github.com/user-attachments/assets/e84089b6-dd16-439c-a562-61300fb1a061" />
<img width="839" height="476" alt="WhatsApp Image 2026-08-29 at 14 23 54" src="https://github.com/user-attachments/assets/bb8497d3-a5b4-4a39-a781-5d0fbdd85c78" />
<img width="914" height="633" alt="WhatsApp Image 2026-08-29 at 14 23 22" src="https://github.com/user-attachments/assets/eb60bff0-28c7-421a-85a3-e18929387e0d" />




## ⚙️ How It Works

1. **Upload** an image of a damaged object.
2. **RepairLens** sends the image to the backend.
3. **Gemini AI** analyzes the object and visible damage.
4. The system determines the likely issue, severity, and repairability.
5. Repair and replacement cost ranges are estimated.
6. RepairLens provides a **repair, replace, or uncertain** recommendation.

## 🧰 Technologies Used

* **HTML**
* **CSS**
* **JavaScript**
* **Vite**
* **Node.js**
* **Express.js**
* **Google Gemini API**
* **Multer**
* **dotenv**

## 🏗️ Project Structure

```text
RepairLens/
├── index.html
├── style.css
├── main.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/ankitprasad-cse/Repairlens.git
cd Repairlens
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the Gemini API key

Create a `.env` file in the project root:

```text
GEMINI_API_KEY=your_api_key_here
```

**Never commit your `.env` file or expose your API key publicly.**

### 4. Start the backend

```bash
node server.js
```

### 5. Start the Vite frontend

In another terminal:

```bash
npm run dev
```

Then open the local Vite URL provided in the terminal.

## 📌 Important Note

Repair and replacement costs provided by RepairLens are **AI-generated estimates** and should not be treated as professional repair quotations or guarantees.

## 🌱 Sustainability Goal

RepairLens encourages users to consider repair before automatically replacing broken items, helping promote more informed and potentially less wasteful decisions.

## 👥 Team

**RepairLens** was developed as a team project during a student hackathon.

---

⭐ If you find the project interesting, consider giving the repository a star!
