/*!

=========================================================
* Black Dashboard React v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";
import Weeks from "views/weeks.js";
import NewWeek from "views/newWeek.js";
import Login from "views/LoginPage.js";
import Deliveries from "./views/Deliveries";
import WeekStatDetailS from "./views/WeekStatDetails";
import Stock from "./views/stock.js"
import newSup from "./views/newSup";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
    showInSideBar: true
  },
  {
    path: "/icons",
    name: "Icons",
    rtlName: "الرموز",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/admin",
    showInSideBar: false
  },
  {
    path: "/weeks",
    name: "Wochenstatistiken",
    rtlName: "خرائط",
    icon: "tim-icons icon-components",
    component: Weeks,
    layout: "/admin",
    showInSideBar: true
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/admin",
    showInSideBar: false
  },
  {
    path: "/user-profile",
    name: "User Profile",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin",
    showInSideBar: false
  },
  {
    path: "/tables",
    name: "Table List",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-puzzle-10",
    component: TableList,
    layout: "/admin",
    showInSideBar: false
  },
  {
    path: "/typography",
    name: "Typography",
    rtlName: "طباعة",
    icon: "tim-icons icon-align-center",
    component: Typography,
    layout: "/admin",
    showInSideBar: false
  },
  {
    path: "/rtl-support",
    name: "RTL Support",
    rtlName: "ار تي ال",
    icon: "tim-icons icon-world",
    component: Rtl,
    layout: "/rtl",
    showInSideBar: false
  },
  {
    path: "/newWeek",
    name: "Neue Wochenstatistik",
    component: NewWeek,
    layout: "/admin",
    showInSideBar: false
  },
  {
    path: "/deliveries",
    name: "Wareneingänge",
    icon: "tim-icons icon-delivery-fast",
    component: Deliveries,
    layout: "/admin",
    showInSideBar: true
  },
  {
    path: "/week",
    name: "Wochenstatistik",
    component: WeekStatDetailS,
    layout: "/admin",
    showInSideBar: false
  },
  {
    path: "/stock",
    name: "Inventur",
    icon: "tim-icons icon-app",
    component: Stock,
    layout: "/admin",
    showInSideBar: true
  },
  {
    path: "/newSupply",
    name: "Neuer Wareneingang",
    component: newSup,
    layout: "/admin",
    showInSideBar: false
  }
];
export default routes;
