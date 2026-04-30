/*
Group Two
CSCI 3300
Dr. Porter
Spring 2026

Mackenzie 

utils/Icon.jsx
Reusable SVG icon components across the application 

*/

// Import all ICONS fro assets 
import homeIcon     from '../assets/home.svg';
import chartIcon    from '../assets/chart.svg';
import gradeIcon    from '../assets/grade.svg';
import plusIcon     from '../assets/plus.svg';
import backIcon     from '../assets/back.svg';
import settingsIcon from '../assets/settings.svg';
import githubIcon   from '../assets/github.svg';
import searchIcon   from '../assets/search.svg';
import warningIcon  from '../assets/warning.svg';
import errorIcon    from '../assets/error.svg';
import infoIcon     from '../assets/info.svg';
import trashIcon    from '../assets/trash.svg';
import buildingIcon from '../assets/building.svg';

// Declare the Icons
const icons = {
  home:     homeIcon,
  chart:    chartIcon,
  grade:    gradeIcon,
  plus:     plusIcon,
  back:     backIcon,
  settings: settingsIcon,
  github:   githubIcon,
  search:   searchIcon,
  warning:  warningIcon,
  error:    errorIcon,
  info:     infoIcon,
  trash:    trashIcon,
  building: buildingIcon

};

// Filters for Icons to account for other colors & contrast 
const filters = {
  white:  'brightness(0) invert(1)',
  blue:   'brightness(0) saturate(100%) invert(62%) sepia(80%) saturate(400%) hue-rotate(180deg)',
  purple: 'brightness(0) saturate(100%) invert(55%) sepia(50%) saturate(500%) hue-rotate(220deg)',
  dark:   'brightness(0)',
  muted:  'brightness(0) saturate(0%) invert(60%)',
  red: 'brightness(0) saturate(100%) invert(75%) sepia(50%) saturate(700%) hue-rotate(330deg)',
};

// Create the Icons 
export default function Icon({ name, size = 16, color = 'white', style = {} }) {
  const src = icons[name];
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      style={{
        display:    'inline-block',
        flexShrink: 0,
        minWidth:   size,
        minHeight:  size,
        filter:     filters[color] || filters.white,
        verticalAlign: 'middle',
        ...style,
      }}
    />
  );
}