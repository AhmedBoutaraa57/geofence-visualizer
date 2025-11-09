/**
 * Create a circle polygon from center point and radius
 * @param {number} lat - Latitude of center
 * @param {number} lon - Longitude of center
 * @param {number} radiusMeters - Radius in meters
 * @param {number} numPoints - Number of points to approximate circle (default: 32)
 * @returns {Object} GeoJSON Polygon
 */
export function createCirclePolygon(lat, lon, radiusMeters, numPoints = 32) {
  const coordinates = []
  const latRad = (lat * Math.PI) / 180
  
  // Approximate meters to degrees
  // 1 degree latitude ≈ 111,320 meters
  // 1 degree longitude ≈ 111,320 * cos(latitude) meters
  const radiusDegLat = radiusMeters / 111320.0
  const radiusDegLon = radiusMeters / (111320.0 * Math.cos(latRad))
  
  for (let i = 0; i <= numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints
    const dLat = radiusDegLat * Math.cos(angle)
    const dLon = radiusDegLon * Math.sin(angle)
    coordinates.push([lon + dLon, lat + dLat])
  }
  
  return {
    type: 'Polygon',
    coordinates: [coordinates]
  }
}

/**
 * Check if a point is inside a polygon
 * @param {number} lat - Latitude of point
 * @param {number} lon - Longitude of point
 * @param {Object} polygon - GeoJSON Polygon
 * @returns {boolean}
 */
export function pointInPolygon(lat, lon, polygon) {
  if (!polygon || !polygon.coordinates || !polygon.coordinates[0]) {
    return false
  }
  
  const ring = polygon.coordinates[0]
  let inside = false
  
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1]
    const xj = ring[j][0], yj = ring[j][1]
    
    const intersect = ((yi > lon) !== (yj > lon)) &&
      (lat < (xj - xi) * (lon - yi) / (yj - yi) + xi)
    
    if (intersect) inside = !inside
  }
  
  return inside
}

