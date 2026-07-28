import Dashboard from '@/pages/Dashboard';
import Simulation from '@/pages/Simulation';
import Analytics from '@/pages/Analytics';
import Scenarios from '@/pages/Scenarios';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Simulation": Simulation,
    "Analytics": Analytics,
    "Scenarios": Scenarios,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};