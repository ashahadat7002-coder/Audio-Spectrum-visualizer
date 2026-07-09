README.md
# 🎵 Audio Spectrum Visualizer

A real-time audio spectrum visualization application built using **HTML5, CSS3, JavaScript, Canvas API, and Web Audio API**.

The application analyzes audio signals in real time and converts frequency data into dynamic visual representations. It provides multiple visualization modes with interactive audio playback controls, creating a foundation for advanced DJ-style audio visualizations.




# ✨ Features

## 🎧 Audio Playback

- Upload local audio files
- Play / Pause / Stop controls
- Real-time playback status
- Song information display
- Seekable progress timeline
- Volume control


## 📊 Real-Time Audio Analysis

- Frequency analysis using Web Audio API
- Real-time data extraction using `AnalyserNode`
- Dynamic rendering using HTML5 Canvas
- Smooth animated spectrum movement


## 🌈 Visualization Modes

### 🔵 Blue Spectrum

A clean minimal spectrum visualization with glowing blue frequency bars.

---

### 🌈 RGB Spectrum

A colorful spectrum visualization where each frequency bar receives a different color based on its position.

---

### 🔴🟢🔵 3-Band Frequency Analyzer

Separates audio frequencies into:

- Bass frequencies
- Mid frequencies
- High frequencies

Inspired by professional audio visualization tools.

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript (ES6+)

## APIs

- Web Audio API
- Canvas API

## Concepts Implemented

- DOM Manipulation
- Event Handling
- Audio Processing
- Frequency Analysis
- Animation Loop
- Responsive Design

---

# ⚙️ How It Works

The application follows this audio processing pipeline:
Audio File

  ↓

HTML Audio Element

  ↓

AudioContext

  ↓

AnalyserNode

  ↓

Frequency Data Array

  ↓

Canvas Renderer

  ↓

Real-Time Visualization


The Web Audio API provides frequency information from the audio stream. This data is processed using JavaScript and displayed visually using the Canvas API.

---

# 📂 Project Structure


Audio-Spectrum-Visualizer/

│
├── index.html
│
├── style.css
│
├── script.js


---

# 🚀 Installation & Usage

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/audio-spectrum-visualizer.git
2. Open the project folder
cd audio-spectrum-visualizer
3. Run the application

Open:

index.html

in your browser.

For the best experience, use a modern browser such as:

Google Chrome
Microsoft Edge

