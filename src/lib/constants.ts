import { Lightbulb, SprayCan, Trash2, type LucideIcon, MapPin, X, Car, TreeDeciduous } from 'lucide-react';
import { PotholeIcon } from '@/components/icons/pothole-icon';

export const ISSUE_CATEGORIES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'pothole', label: 'Pothole', icon: PotholeIcon },
  { value: 'streetlight_out', label: 'Streetlight Out', icon: Lightbulb },
  { value: 'trash_overflow', label: 'Trash Overflow', icon: Trash2 },
  { value: 'graffiti', label: 'Graffiti', icon: SprayCan },
  { value: 'abandoned_vehicle', label: 'Abandoned Vehicle', icon: Car },
  { value: 'fallen_tree', label: 'Fallen Tree', icon: TreeDeciduous },
];

export const ISSUE_STATUSES = ["Submitted", "Acknowledged", "In Progress", "Resolved"] as const;
export const ISSUE_PRIORITIES = ["Low", "Medium", "High"] as const;

export const ICONS = {
    pothole: PotholeIcon,
    streetlight_out: Lightbulb,
    trash_overflow: Trash2,
    graffiti: SprayCan,
    abandoned_vehicle: Car,
    fallen_tree: TreeDeciduous,
    mapPin: MapPin,
    x: X
}
