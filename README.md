# 🚗 React Vehicle Route Simulation

A modern, interactive web application built with React and Leaflet that visualizes and simulates a vehicle's movement along a predefined GPS route. It features a real-time dashboard that displays speed, ETA, and progress, complete with full playback controls.

*(Suggestion: Add a screenshot or GIF of your application in action here!)*

---

## ✨ Features

-   **Interactive Map**: Uses OpenStreetMap tiles via React-Leaflet.
-   **Dynamic Route Visualization**:
    -   Displays the **complete** route with a dashed gray line.
    -   Shows the **traveled** path with a solid, vibrant **cyan** line that updates as the vehicle moves.
-   **Real-time Dashboard**: A "glassmorphism" UI panel displays:
    -   Live Coordinates
    -   Timestamp
    -   Vehicle Speed (km/h)
    -   Estimated Time to Arrival (ETA)
    -   Trip Progress (%)
-   **Full Playback Controls**:
    -   Play, Pause, and Reset the simulation.
    -   Adjustable simulation speed via a slider.
-   **Animated Custom Markers**:
    -   Pulsing dots for the **Start** (green) and **End** (red) points.
    -   A floating emoji (🚙) for the vehicle marker.
-   **Accurate Calculations**:
    -   Calculates distance between points using the **Haversine formula** (`haversine.js`).
    -   Calculates speed and ETA based on the data's timestamps (`speed.js`).

---

## 🛠️ Tech Stack

-   **Frontend**: React.js
-   **Mapping**: Leaflet & React-Leaflet
-   **Styling**: Tailwind CSS & Custom CSS (for animations)
-   **Build Tool**: Vite

---

## 🚀 How to Run This Project

### Prerequisites

Before you begin, ensure you have the following installed:
-   **Node.js** (v16.x or higher)
-   **npm** (which comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    cd your-repository-name
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Add Route Data (Required):**
    -   This project requires a `dummy-route.json` file to be placed in the `/public` directory.
    -   The file must be an array of points with `latitude`, `longitude`, and `timestamp`.
    ```json
    [
      {
        "latitude": 17.385044,
        "longitude": 78.486671,
        "timestamp": "2025-10-26T10:00:00Z"
      },
      {
        "latitude": 17.385544,
        "longitude": 78.487471,
        "timestamp": "2025-10-26T10:01:00Z"
      }
    ]
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open `http://localhost:5173` (or the port shown in your terminal) to see the application.

---

## 📁 Project Structure

```
/
├── public/
│   └── dummy-route.json     # REQUIRED: The vehicle's route data
├── src/
│   ├── components/
│   │   ├── Controls.jsx     # The dashboard UI and playback controls
│   │   └── VehicleMap.jsx   # Main component: map logic, data fetching, simulation
│   ├── utils/
│   │   ├── haversine.js     # Function to calculate distance
│   │   └── speed.js         # Functions to calculate speed and ETA
│   ├── App.jsx                # Root component
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles (Tailwind & Leaflet)
│   └── VehicleMap.css         # Styles for map, markers, and animations
└── package.json
```