'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export interface Coordinates {
  lat: number;
  lng: number;
}

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;
const DETAIL_ZOOM = 15;

const markerIcon = L.divIcon({
  html:
    '<div style="display:flex;height:24px;width:24px;align-items:center;justify-content:center;border-radius:9999px;background:#0f766e;border:3px solid #ffffff;box-shadow:0 8px 20px rgba(15,118,110,0.28)"><div style="height:8px;width:8px;border-radius:9999px;background:#ffffff"></div></div>',
  className: 'bg-transparent border-0',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function hasCoordinates(value: Coordinates) {
  return Number.isFinite(value.lat) && Number.isFinite(value.lng) && !(value.lat === 0 && value.lng === 0);
}

function roundCoordinate(value: number) {
  return Number(value.toFixed(6));
}

function MapViewport({ value }: { value: Coordinates }) {
  const map = useMap();
  const hasValue = hasCoordinates(value);

  useEffect(() => {
    if (hasValue) {
      map.setView([value.lat, value.lng], DETAIL_ZOOM, { animate: true });
      return;
    }

    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
  }, [hasValue, map, value.lat, value.lng]);

  return null;
}

function LocationMarker({
  value,
  onChange,
}: {
  value: Coordinates;
  onChange: (value: Coordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onChange({
        lat: roundCoordinate(event.latlng.lat),
        lng: roundCoordinate(event.latlng.lng),
      });
    },
  });

  if (!hasCoordinates(value)) {
    return null;
  }

  return (
    <Marker
      draggable
      icon={markerIcon}
      position={[value.lat, value.lng]}
      eventHandlers={{
        dragend(event) {
          const target = event.target as L.Marker;
          const nextValue = target.getLatLng();
          onChange({
            lat: roundCoordinate(nextValue.lat),
            lng: roundCoordinate(nextValue.lng),
          });
        },
      }}
    />
  );
}

export default function LocationPickerMap({
  value,
  onChange,
  height = 280,
}: {
  value: Coordinates;
  onChange: (value: Coordinates) => void;
  height?: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
      <MapContainer
        center={hasCoordinates(value) ? [value.lat, value.lng] : DEFAULT_CENTER}
        className="z-0"
        scrollWheelZoom
        style={{ height: `${height}px`, width: '100%' }}
        zoom={hasCoordinates(value) ? DETAIL_ZOOM : DEFAULT_ZOOM}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport value={value} />
        <LocationMarker onChange={onChange} value={value} />
      </MapContainer>
    </div>
  );
}
