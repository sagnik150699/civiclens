import { Lightbulb, SprayCan, Trash2, type LucideIcon, MapPin, X } from 'lucide-react';
import { PotholeIcon } from '@/components/icons/pothole-icon';

export const ISSUE_CATEGORIES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'pothole', label: 'Pothole', icon: PotholeIcon },
  { value: 'streetlight_out', label: 'Streetlight Out', icon: Lightbulb },
  { value: 'trash_overflow', label: 'Trash Overflow', icon: Trash2 },
  { value: 'graffiti', label: 'Graffiti', icon: SprayCan },
];

export const ISSUE_STATUSES = ["Submitted", "Acknowledged", "In Progress", "Resolved"] as const;
export const ISSUE_PRIORITIES = ["Low", "Medium", "High"] as const;

export const ICONS = {
    pothole: PotholeIcon,
    streetlight_out: Lightbulb,
    trash_overflow: Trash2,
    graffiti: SprayCan,
    mapPin: MapPin,
    x: X
}
