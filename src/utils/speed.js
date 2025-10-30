import { calculateDistanceKm } from './haversine';

export function calculateSpeedKmH(currentIndex, routeData) {
  if (currentIndex === 0 || routeData.length <= 1) {
    return '0.00';
  }
  
  const currPoint = routeData[currentIndex];
  const prevPoint = routeData[currentIndex - 1];
  
  if (!prevPoint || !currPoint) return '0.00';
  
  const distanceKm = calculateDistanceKm(
    prevPoint.lat, prevPoint.lng,
    currPoint.lat, currPoint.lng
  );
  
  const timeDeltaMs = new Date(currPoint.timestamp).getTime() - 
                      new Date(prevPoint.timestamp).getTime();
  const timeDeltaHours = timeDeltaMs / (1000 * 60 * 60);
  
  if (timeDeltaHours <= 0) return 'N/A';
  
  const speed = distanceKm / timeDeltaHours;
  return speed.toFixed(2);
}

export function calculateETA(currentIndex, routeData) {
  if (!routeData || currentIndex >= routeData.length - 1) {
    return 'Arrived';
  }
  
  const currentPoint = routeData[currentIndex];
  const lastPoint = routeData[routeData.length - 1];
  
  const remainingMs = new Date(lastPoint.timestamp) - new Date(currentPoint.timestamp);
  const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
  
  if (remainingMinutes < 1) return 'Less than 1 min';
  if (remainingMinutes < 60) return `${remainingMinutes} min`;
  
  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;
  return `${hours}h ${mins}m`;
}
