# Geofence Visualization Tool - Project Summary

## Overview

A complete interactive web-based map visualization tool for testing and debugging geofencing logic. The tool provides real-time visualization of badge locations, geofence boundaries, and event indicators.

## Project Structure

```
geofence-visualizer/
├── src/
│   ├── components/
│   │   ├── BadgeLayer.jsx          # Renders badges on map (points/circles)
│   │   ├── GeofenceLayer.jsx        # Renders geofence polygons
│   │   ├── ControlPanel.jsx         # Main control panel UI
│   │   ├── EventLog.jsx              # Event history display
│   │   ├── StatisticsPanel.jsx      # Statistics dashboard
│   │   └── *.css                    # Component styles
│   ├── utils/
│   │   └── geometry.js              # Geometry utilities (circle creation, etc.)
│   ├── App.jsx                      # Main application component
│   ├── App.css                      # Main app styles
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
├── server/
│   ├── index.js                     # Express + Socket.io + MQTT server
│   └── package.json                 # Server dependencies
├── package.json                     # Frontend dependencies
├── vite.config.js                   # Vite configuration
├── index.html                       # HTML entry point
├── README.md                        # Full documentation
├── SETUP.md                         # Quick setup guide
├── example-data.json                # Sample test data
├── start.sh                         # Startup script
└── .gitignore                       # Git ignore rules
```

## Key Features Implemented

### ✅ Core Features

1. **Map Display**
   - Interactive Leaflet.js map
   - OpenStreetMap tiles
   - Zoom and pan controls
   - Click-to-place badges (test mode)

2. **Badge Visualization**
   - Point markers for badges without radius
   - Circle overlays for badges with radius (feet → meters conversion)
   - Color coding by status (green=inside, red=outside, yellow=crossing)
   - Badge labels with MAC addresses
   - Movement trails (last 50 positions)
   - Selection highlighting

3. **Geofence Visualization**
   - GeoJSON polygon rendering
   - Semi-transparent fill with distinct borders
   - Color-coded by geofence
   - Labels showing geofence names
   - Multiple geofence support

4. **Event Indicators**
   - Visual feedback for events:
     - `enter`: Green flash/animation
     - `exit`: Red flash/animation
     - `cross`: Yellow/orange flash
     - `inside`: Blue indicator
     - `outside`: Gray indicator
   - Pulsing animations for recent events (5 seconds)

5. **Real-time Updates**
   - WebSocket connection via Socket.io
   - MQTT proxy server
   - Auto-refresh on new data
   - Connection status indicator

6. **Testing Tools**
   - Manual badge placement (click on map)
   - Radius adjustment slider/input
   - Add/delete badges
   - Add/delete geofences
   - Import/Export JSON test data
   - Test mode toggle

7. **Event Log**
   - Real-time event history
   - Color-coded by event type
   - Timestamp display
   - Badge and geofence information

8. **Statistics Panel**
   - Badge count
   - Geofence count
   - Badge status breakdown (inside/outside/crossing)
   - Event counts by type
   - Events per minute

## Technical Implementation

### Frontend Stack
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Leaflet.js**: Mapping library
- **react-leaflet**: React bindings for Leaflet
- **Socket.io-client**: WebSocket client

### Backend Stack
- **Express.js**: HTTP server
- **Socket.io**: WebSocket server
- **mqtt.js**: MQTT client
- **CORS**: Cross-origin support

### Data Flow

```
MQTT Broker
    ↓
MQTT Client (server/index.js)
    ↓
Socket.io Server
    ↓
WebSocket Connection
    ↓
React Frontend
    ↓
Leaflet Map Rendering
```

### MQTT Topics

- **Badge Locations**: `old/assets/+/location` (wildcard for MAC)
- **Geofence Events**: `geofence/+` (wildcard for MAC)

### Data Formats

All data formats match the specifications in `MAP_VISUALIZATION_PROMPT.md`:
- Badge: `{mac, latitude, longitude, radius?}`
- Geofence: GeoJSON Polygon
- Events: `{detect, id, hook, object, time}`

## Configuration

### Environment Variables

The server supports configuration via:
1. Environment variables
2. `.env` file (in geofence-visualizer directory)
3. Default values

Key variables:
- `MQTT_BROKER_IN`: MQTT broker host (default: localhost)
- `MQTT_BROKER_PORT`: MQTT broker port (default: 1883)
- `MQTT_USERNAME`: MQTT username (optional)
- `MQTT_PASSWORD`: MQTT password (optional)
- `MQTT_TOPIC_BADGES`: Badge topic (default: old/assets/+/location)
- `MQTT_TOPIC_GEOFENCE`: Geofence topic (default: geofence/+)
- `PORT`: Server port (default: 3001)

## Usage

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. Start the application:
   ```bash
   ./start.sh
   # Or manually:
   # Terminal 1: cd server && npm start
   # Terminal 2: npm run dev
   ```

3. Open browser: http://localhost:3000

### Testing Without MQTT

The tool works without MQTT connection:
- Add badges manually
- Import test data
- Use test mode to simulate movements

## Future Enhancements

Potential improvements:
- [ ] Leaflet.draw integration for polygon editing
- [ ] Historical data playback
- [ ] Multiple map providers (Mapbox, Google Maps)
- [ ] Search/filter badges by MAC
- [ ] Screenshot export
- [ ] Shareable URLs with map state
- [ ] Performance optimizations for 100+ badges

## Files Created

### Frontend (React)
- `src/App.jsx` - Main application
- `src/components/BadgeLayer.jsx` - Badge rendering
- `src/components/GeofenceLayer.jsx` - Geofence rendering
- `src/components/ControlPanel.jsx` - Control UI
- `src/components/EventLog.jsx` - Event display
- `src/components/StatisticsPanel.jsx` - Statistics
- `src/utils/geometry.js` - Geometry utilities

### Backend (Node.js)
- `server/index.js` - Express + Socket.io + MQTT server

### Configuration
- `package.json` - Frontend dependencies
- `server/package.json` - Backend dependencies
- `vite.config.js` - Vite config
- `.gitignore` - Git ignore rules

### Documentation
- `README.md` - Full documentation
- `SETUP.md` - Quick setup guide
- `PROJECT_SUMMARY.md` - This file
- `example-data.json` - Sample test data

### Scripts
- `start.sh` - Startup script

## Testing

The tool includes:
- Example test data (`example-data.json`)
- Manual testing capabilities
- Import/export functionality
- Test mode for badge placement

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires WebSocket support

## License

See main project license.

