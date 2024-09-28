import { useEffect } from "react";
import GoogleMapComponent from "./components/googlemaps";
import Modal from "./components/modal";
import DashboardNav from "./nav";
import { initFlowbite } from "flowbite";

const Dashboard = () => {
  useEffect(() => {
    initFlowbite();
  });
  return (
    <>
      <DashboardNav />
      <aside
        id="logo-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-black-olive sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 pb-4 overflow-y-auto bg-black-olive"></div>
      </aside>

      <div class="sm:ml-64 h-screen pt-14 relative">
        <GoogleMapComponent />
        <Modal />
      </div>
    </>
  );
};
export default Dashboard;
