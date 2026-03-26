
'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import type { IssueReport } from '@/lib/data';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { ISSUE_CATEGORIES } from '@/lib/constants';
import { MapPin } from 'lucide-react';
import type { IssuePriority } from '@/lib/data';

const priorityColors: Record<IssuePriority, string> = {
  High: '#ef4444', // red-500
  Medium: '#f59e0b', // yellow-500
  Low: '#22c55e', // green-500
};

const getMarkerIcon = (issue: IssueReport): L.DivIcon => {
  const CategoryIcon = ISSUE_CATEGORIES.find(c => c.value === issue.category)?.icon || MapPin;
  const color = priorityColors[issue.priority];

  const iconMarkup = renderToStaticMarkup(
    <div className="rounded-full p-1 shadow-lg" style={{ backgroundColor: color }}>
      <CategoryIcon className="h-4 w-4 text-white" strokeWidth={2} />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'bg-transparent border-0',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function hasCoordinates(issue: IssueReport) {
  return !(issue.location.lat === 0 && issue.location.lng === 0);
}

function MapViewport({
  issues,
  fallbackCenter,
}: {
  issues: IssueReport[];
  fallbackCenter: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (issues.length === 0) {
      map.setView(fallbackCenter, 2, { animate: true });
      return;
    }

    if (issues.length === 1) {
      map.setView([issues[0].location.lat, issues[0].location.lng], 14, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(issues.map((issue) => [issue.location.lat, issue.location.lng]));
    map.fitBounds(bounds.pad(0.2), { animate: true });
  }, [fallbackCenter, issues, map]);

  return null;
}

export default function IssueMap({ issues }: { issues: IssueReport[] }) {
  const mappedIssues = useMemo(() => issues.filter(hasCoordinates), [issues]);
  const center: [number, number] =
    mappedIssues.length > 0
      ? [
          mappedIssues.reduce((acc, issue) => acc + issue.location.lat, 0) / mappedIssues.length,
          mappedIssues.reduce((acc, issue) => acc + issue.location.lng, 0) / mappedIssues.length,
        ]
      : [20, 0];
  const zoom = mappedIssues.length > 0 ? 11 : 2;

  return (
    <div className="space-y-3">
      <MapContainer center={center} zoom={zoom} style={{ height: '256px', width: '100%', borderRadius: '0.5rem' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport fallbackCenter={center} issues={mappedIssues} />
        {mappedIssues.map((issue) => (
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
            <Tooltip>{issue.description}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
      {mappedIssues.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Reports without coordinates will appear here once a map pin is saved.
        </p>
      )}
    </div>
  );
}
