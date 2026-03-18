import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomeScreen } from "./components/HomeScreen";
import { MatchScreen } from "./components/MatchScreen";
import { QueueScreen } from "./components/QueueScreen";
import { LockerScreen } from "./components/LockerScreen";
import { ClinicDashboard } from "./components/ClinicDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomeScreen },
      { path: "search", Component: MatchScreen },
      { path: "queue", Component: QueueScreen },
      { path: "locker", Component: LockerScreen },
      { path: "clinic", Component: ClinicDashboard },
    ],
  },
]);