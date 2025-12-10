# 🌟 NSS ESTIVAL FEST 2K25 – Official Website

A modern, responsive and animated event website built for **NSS Estival Fest 2K25**, hosted by **EMEA College of Arts & Science, Kondotty**.

This website showcases:
- Event details  
- About section  
- Dynamic participant registration  
- Smooth UI animations  
- Fully mobile-friendly design  

---

## 🚀 Features

### 🎭 **Event Categories**
- Fashion Show  
- Group Dance  
- Best Volunteer  
- Treasure Hunt  
- Spot Photography  
- Spot Reel Making  
- Face Painting  

Each event includes:
- Prize amount  
- Participation rules  
- Registration fee  
- Dynamic input fields based on participants count  
- Payment proof upload (QR/UPI)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | TailwindCSS |
| Animations | Motion / Framer Motion |
| Routing | React Router DOM |
| Backend | Supabase |
| Storage | Supabase Storage |

---

## 📦 Installation

Clone the repository:

```sh
git clone https://github.com/yourusername/NSS_ESTIVAL_FEST.git
cd NSS_ESTIVAL_FEST
```
Install dependencies:
```sh
npm install
```

Start development server:
```sh
npm run dev
```
🔧 Environment Variables

Create a .env file in the project root:
```sh
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key

```
📁 Project Structure

```sh
src/
 ├── assets/
 ├── components/
 ├── data/
 ├── layout/
 ├── libs/
 ├── pages/
 └── App.jsx

```

## 📝 Registration System

Each event page dynamically loads:

- **Event title**
- **Participation count**
- **Rules list**
- **Registration fee**
- **Payment information (UPI / QR code)**
- **Upload payment screenshot**
- **Auto-submission to Supabase table:** `registrations`
- **Uploads stored in Supabase Storage**

---

## 📜 Available Scripts

| Command | Action |
|---------|---------|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |


