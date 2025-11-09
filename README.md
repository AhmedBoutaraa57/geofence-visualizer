# Geofence Visualization Tool

An interactive web-based map visualization tool for testing and debugging geofencing logic. This tool displays real-time badge locations, geofence boundaries, and visual indicators for geofence events.

## Features

- **Real-time Badge Tracking**: Display badge locations (lat/lon) as points or circles (with radius)
- **Geofence Visualization**: Display geofence boundaries as GeoJSON polygons
- **Event Indicators**: Visual feedback for events:
  - `enter`: Green flash/animation
  - `exit`: Red flash/animation
  - `cross`: Yellow/orange flash (radius extends outside)
  - `inside`: Blue indicator
  - `outside`: Gray indicator
- **Testing Tools**:
  - Manual badge placement by clicking on map
  - Radius adjustment for badges
  - Import/Export test scenarios as JSON
- **Real-time Updates**: MQTT/WebSocket integration for live data
- **Event Log**: History of recent geofence events
- **Statistics Dashboard**: Track badges, geofences, and event counts

## Tech Stack

- **Frontend**: React + Vite
- **Mapping**: Leaflet.js
- **Real-time**: Socket.io (WebSocket)
- **Backend**: Express.js
- **MQTT**: mqtt.js

## Installation

### Prerequisites

- Node.js 18+ and npm
- MQTT broker (e.g., Mosquitto, Mainflux)
- Access to geofence data source

### Setup

1. **Install frontend dependencies**:
```bash
cd geofence-visualizer
npm install
```

2. **Install server dependencies**:
```bash
cd server
npm install
```

3. **Configure MQTT connection** (optional):
   - Set environment variables or edit `server/index.js`:
   ```bash
   export MQTT_BROKER=mqtt://localhost:1883
   export MQTT_USERNAME=your_username
   export MQTT_PASSWORD=your_password
   export MQTT_TOPIC_BADGES=old/assets/+/location
   export MQTT_TOPIC_GEOFENCE=geofence/+
   ```

## Running the Application

### Development Mode

1. **Start the backend server** (in one terminal):
```bash
cd server
npm start
```

2. **Start the frontend dev server** (in another terminal):
```bash
npm run dev
```

3. **Open your browser**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Production Build

1. **Build the frontend**:
```bash
npm run build
```

2. **Serve the built files** (you can use any static file server):
```bash
npm run preview
```

## Usage

### Connecting to MQTT

The tool automatically connects to the MQTT broker configured in the server. Check the connection status in the top-right corner of the interface.

### Adding Badges

1. Click **"+ Add Badge"** in the control panel
2. Enter:
   - MAC address
   - Latitude
   - Longitude
   - Radius (optional, in feet)
3. Click **"Add"**

### Manual Testing

1. Enable **"Test Mode"** in the controls
2. Select a badge from the badge list
3. Click anywhere on the map to move the badge
4. Adjust radius using the slider/input for the selected badge

### Adding Geofences

Geofences can be added by:
1. **Importing from GeoJSON file** (`.geojson` extension):
   - Click "Import GeoJSON" button in the Geofences section
   - Supports standard GeoJSON formats:
     - FeatureCollection (multiple geofences)
     - Feature (single geofence)
     - Polygon/MultiPolygon (direct geometry)
     - Array of geofences
   - Geofence names are extracted from `properties.name` or `properties.id`
   - MAC addresses are extracted from `properties.mac` (optional)
2. Importing from JSON file (see example data format below)
3. Receiving via MQTT/WebSocket

**Note**: The tool specifically supports `.geojson` file extension for geofence imports.

### Import/Export

- **Import Badges/Geofences**: Click "Import Data" and select a JSON file
- **Import Geofences Only**: Click "Import GeoJSON" and select a `.geojson` file
- **Export All Data**: Click "Export Data" to save badges and geofences as JSON
- **Export Geofences as GeoJSON**: Click "Export as GeoJSON" to save geofences in standard GeoJSON format

## Data Formats

### Badge Location Update
```json
{
  "mac": "feed31446a32",
  "latitude": 28.59448340810775683408107756,
  "longitude": 77.200186828551038682855103,
  "radius": 20.5
}
```

### Geofence Boundary (GeoJSON Polygon)

**Standard GeoJSON Format** (for `.geojson` files):
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "DelhiHall1",
        "mac": "feed31446a32"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [77.20018682855103, 28.594483408107756],
          [77.2002, 28.5945],
          [77.2003, 28.594483408107756],
          [77.20018682855103, 28.594483408107756]
        ]]
      }
    }
  ]
}
```

**Custom Format** (for JSON test data files):
```json
{
  "name": "DelhiHall1",
  "mac": "feed31446a32",
  "polygon": {
    "type": "Polygon",
    "coordinates": [[
      [77.20018682855103, 28.594483408107756],
      [77.2002, 28.5945],
      [77.2003, 28.594483408107756],
      [77.20018682855103, 28.594483408107756]
    ]]
  }
}
```

### Geofence Event
```json
{
  "detect": "enter",
  "id": "feed31446a32",
  "hook": "geofence_feed31446a32_DelhiHall1",
  "object": {
    "type": "Polygon",
    "coordinates": [[...]]
  },
  "time": "2025-11-05T03:46:41Z"
}
```

### Test Data File Format
```json
{
  "badges": [
    {
      "mac": "feed31446a32",
      "latitude": 28.59448340810775683408107756,
      "longitude": 77.200186828551038682855103,
      "radius": 20.5
    }
  ],
  "geofences": [
    {
      "name": "DelhiHall1",
      "mac": "feed31446a32",
      "polygon": {
        "type": "Polygon",
        "coordinates": [[[77.20018682855103, 28.594483408107756], ...]]
      }
    }
  ]
}
```

## GeoJSON File Support

The tool fully supports importing geofences from `.geojson` files. Supported formats include:

1. **FeatureCollection** (recommended for multiple geofences):
   ```json
   {
     "type": "FeatureCollection",
     "features": [
       {
         "type": "Feature",
         "properties": { "name": "Geofence1" },
         "geometry": { "type": "Polygon", "coordinates": [...] }
       }
     ]
   }
   ```

2. **Single Feature**:
   ```json
   {
     "type": "Feature",
     "properties": { "name": "Geofence1" },
     "geometry": { "type": "Polygon", "coordinates": [...] }
   }
   ```

3. **Direct Polygon Geometry**:
   ```json
   {
     "type": "Polygon",
     "coordinates": [[...]]
   }
   ```

See `example-geofences.geojson` for a complete example.

## MQTT Topics

The server subscribes to:
- **Badge locations**: `old/assets/+/location` (wildcard for MAC address)
- **Geofence events**: `geofence/+` (wildcard for MAC address)

## Configuration

### Environment Variables

- `MQTT_BROKER`: MQTT broker URL (default: `mqtt://localhost:1883`)
- `MQTT_USERNAME`: MQTT username (optional)
- `MQTT_PASSWORD`: MQTT password (optional)
- `MQTT_TOPIC_BADGES`: Badge location topic (default: `old/assets/+/location`)
- `MQTT_TOPIC_GEOFENCE`: Geofence event topic (default: `geofence/+`)
- `PORT`: Server port (default: `3001`)

## Troubleshooting

### Connection Issues

- **MQTT not connecting**: Check broker URL and credentials
- **WebSocket not connecting**: Ensure server is running on port 3001
- **No data appearing**: Verify MQTT topics match your broker configuration

### Map Issues

- **Map not loading**: Check internet connection (uses OpenStreetMap tiles)
- **Badges not showing**: Verify badge data has valid lat/lon coordinates
- **Geofences not rendering**: Check GeoJSON polygon format

## Development

### Project Structure

```
geofence-visualizer/
├── src/
│   ├── components/
│   │   ├── BadgeLayer.jsx      # Badge visualization
│   │   ├── GeofenceLayer.jsx   # Geofence visualization
│   │   ├── ControlPanel.jsx    # Control panel UI
│   │   ├── EventLog.jsx        # Event log display
│   │   └── StatisticsPanel.jsx  # Statistics dashboard
│   ├── utils/
│   │   └── geometry.js         # Geometry utilities
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── server/
│   └── index.js                # Express + Socket.io server
└── package.json
```

### Adding Features

- **Drawing Tools**: Integrate Leaflet.draw for polygon editing
- **Historical Playback**: Add time-based replay of badge movements
- **Multiple Map Providers**: Add Mapbox, Google Maps support
- **Geofence Editor**: Visual polygon editor on the map

## License

See project license file.

## Support

For issues and questions, refer to the main project documentation or create an issue in the repository.

