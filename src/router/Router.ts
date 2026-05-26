import { ComponentType } from 'react';
import CashTable from "../pages/CashTable";
import Settings from "../pages/Settings";
import PokerTable from "../pages/PokerTable";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

interface Route {
  path: string;
  component: ComponentType;
  exact: boolean;
}

export const privateRoutes: Route[] = [
    {path: '/settings', component: Settings, exact: true},
    {path: '/poker-table/:id', component: PokerTable, exact: true},
];

export const publicRoutes: Route[] = [
    {path: '/', component: CashTable, exact: true},
    {path: '/register', component: Register, exact: true},
    {path: '/login', component: Login, exact: true},
    {path: '/cash-table', component: CashTable, exact: true},
];