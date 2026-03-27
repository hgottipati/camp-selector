import { createBrowserRouter } from 'react-router';
import Root from './layouts/Root';
import Home from './pages/Home';
import MapView from './pages/MapView';
import CampgroundDetail from './pages/CampgroundDetail';
import Compare from './pages/Compare';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'map', Component: MapView },
      { path: 'campground/:id', Component: CampgroundDetail },
      { path: 'compare', Component: Compare },
    ],
  },
]);
