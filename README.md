BDS Sentinel: BDS Outdoor Rescue System (English Version)

This system is an outdoor rescue tactical command platform simulated and developed based on the BDS-3 (BeiDou Navigation Satellite System) Short Message Communication Protocol. It integrates 3D tactical map monitoring, multi-role terminal simulation, two-way satellite link communication, and path navigation planning, aiming to simulate an efficient rescue collaboration process in environments without terrestrial network signals.

🛰️ Core Modules

1. Command Dashboard

3D Tactical Map: Integrated with the Baidu Map WebGL engine, supporting 3D terrain rendering, tilted perspectives, and dark tactical themes.

Real-time Telemetry: Real-time tracking of precise coordinates, altitude, and movement speed of victims (Red) and rescue teams (Blue).

One-click Path Planning: Commanders can select a rescue team and click on an SOS coordinate on the map. The system automatically invokes the BeiDou grid to calculate the optimal hiking rescue path.

Downlink Command Issuance: Simulates the transmission of BeiDou short messages to issue tactical commands to frontline rescue personnel.

2. Victim Terminal

Emergency SOS: One-click trigger for BeiDou short message alerts, automatically attaching current high-precision latitude and longitude.

Two-way Communication: Chat bubbles are aligned on separate sides (local messages on the right, command center replies on the left), following practical operation habits.

Satellite Ephemeris Sync: Simulates BeiDou satellite searching and timing status.

3. Rescue Team Terminal

Tactical Navigation Mode: Automatically activates a navigation guide bar upon receiving tasks from the command center, showing distance, ETA (Estimated Time of Arrival), and bearing.

Collaborative Operation: Real-time reception of the latest messages from victims forwarded by the command center to ensure information symmetry.

4. Data Audit Center

Message Stream Audit: Full logging of all uplink and downlink data transmitted via the BeiDou link for historical review.

Resource Inventory: Real-time statistics of rescue team personnel, carried equipment (e.g., stretchers, drones, satellite terminals), and task status.

🛠️ Tech Stack

Frontend Core: React 18 (Hooks)

Styling: Tailwind CSS (Tactical Dark UI)

Map Engine: Baidu Map JavaScript API GL v1.0

Icon Library: Lucide React

Animations: Tailwind Animate + CSS Keyframes

🚀 Quick Start

1. Clone/Download Project

Save the project code locally:

mkdir bds-sentinel && cd bds-sentinel


2. Environment Configuration

Ensure Node.js (v18+) is installed locally.

3. Install Dependencies

npm install vite @vitejs/plugin-react react react-dom lucide-react


4. Run

npx vite


Visit http://localhost:5173 in your browser.

Note: The system has a built-in Baidu Map AK. If you need to change it, modify the BAIDU_MAP_AK constant in BDS_Rescue_System.jsx.

📂 Recommended Project Structure

src/
├── App.jsx              # Core system logic
├── main.jsx             # React entry point
├── assets/              # Static assets
└── index.css            # Tailwind configuration


📝 Simulation Protocol Notes

The system simulates BDS-3 RDSS communication features:

Communication Latency: Simulates a 1.2s link delay caused by satellite forwarding.

Message Alignment: Uses role identifiers (Receiver/Sender) to achieve automatic side-by-side rendering of terminal dialogues.

Coordinate Offset: Defaults to the BD-09 coordinate system, supporting precise alignment with the NUC (North University of China) campus grid.

📄 Disclaimer

This project is intended only as a UI/UX logic simulation demonstration for BeiDou short message application scenarios and does not possess actual satellite signal transmission capabilities.
