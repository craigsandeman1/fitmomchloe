// Type declarations for lucide-react components
declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    stroke?: string | number;
  }
  
  export type Icon = ComponentType<IconProps>;
  
  // Define all the missing icons
  export const AlertCircle: Icon;
  export const ArrowRight: Icon;
  export const Calendar: Icon;
  export const Check: Icon;
  export const CheckCircle: Icon;
  export const ChevronDown: Icon;
  export const ChevronRight: Icon;
  export const ChevronUp: Icon;
  export const Clock: Icon;
  export const Download: Icon;
  export const Edit2: Icon;
  export const Facebook: Icon;
  export const Filter: Icon;
  export const Info: Icon;
  export const Instagram: Icon;
  export const Lock: Icon;
  export const Loader: Icon;
  export const LogOut: Icon;
  export const Mail: Icon;
  export const MapPin: Icon;
  export const Menu: Icon;
  export const Phone: Icon;
  export const Play: Icon;
  export const Plus: Icon;
  export const Printer: Icon;
  export const Send: Icon;
  export const Trash2: Icon;
  export const User: Icon;
  export const Utensils: Icon;
  export const X: Icon;
  export const XCircle: Icon;
  export const Youtube: Icon;
} 