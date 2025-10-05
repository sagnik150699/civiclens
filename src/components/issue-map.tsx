
'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import type { IssueReport } from '@/lib/data';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { ISSUE_CATEGORIES } from '@/lib/constants';
import { MapPin } from 'lucide-react';
import type { IssuePriority } from '@/lib/data';

// Default icon to prevent leaflet/next.js build issues
// This is a workaround for a known issue with react-leaflet and webpack.
const defaultIcon = new L.Icon({
    iconUrl: '/leaflet/marker-icon.png',
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    shadowUrl: '/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;


const priorityColors: Record<IssuePriority, string> = {
  High: '#ef4444', // red-500
  Medium: '#f59e0b', // yellow-500
  Low: '#22c55e', // green-500
};

const getMarkerIcon = (issue: IssueReport): L.Icon => {
    const CategoryIcon = ISSUE_CATEGORIES.find(c => c.value === issue.category)?.icon || MapPin;
    const color = priorityColors[issue.priority];

    const iconMarkup = renderToStaticMarkup(
        <div className="rounded-full p-1 shadow-lg" style={{ backgroundColor: color }}>
            <CategoryIcon className="h-4 w-4 text-white" strokeWidth={2}/>
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'bg-transparent border-0',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};


export default function IssueMap({ issues }: { issues: IssueReport[] }) {
    
    // Default center to the world view if no issues, otherwise average the locations
    const center: [number, number] = issues.length > 0
        ? [
            issues.reduce((acc, issue) => acc + issue.location.lat, 0) / issues.length,
            issues.reduce((acc, issue) => acc + issue.location.lng, 0) / issues.length
          ]
        : [0, 0]; // Default to world view

    const zoom = issues.length > 0 ? 11 : 2; // Zoom out for world view

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '256px', width: '100%', borderRadius: '0.5rem' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues.map(issue => (
        issue.location.lat !== 0 && issue.location.lng !== 0 && (
          <Marker 
            key={issue.id} 
            position={[issue.location.lat, issue.location.lng]}
            icon={getMarkerIcon(issue)}
          >
            <Popup>
                <b>{ISSUE_CATEGORIES.find(c => c.value === issue.category)?.label || 'Issue'}</b>
                <br />
                {issue.description}
                <br />
                <span style={{ color: priorityColors[issue.priority] }}>
                    Priority: {issue.priority}
                </span>
            </Popup>
            <Tooltip>
                {issue.description}
            </Tooltip>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
