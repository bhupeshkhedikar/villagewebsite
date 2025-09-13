import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import AboutVillage from "./components/AboutVillage";
import Services from "./components/Services";
import Leadership from "./components/Leadership";
import MandiPrices from "./components/MandiPrices";
import HealthContacts from "./components/HealthContacts";
import EducationPrograms from "./components/EducationPrograms";
import NoticeBoard from "./components/NoticeBoard";
import Events from "./components/UserEventsFeed";
import ProblemReporting from "./components/ProblemReporting";
import Classifieds from "./components/Classifieds";
import ContactsDirectory from "./components/ContactsDirectory";
import Gallery from "./components/Gallery";
import ContactMap from "./components/ContactMap";
import TabsBar from "./components/TabsBar";
import Achievers from "./components/Achievers";

// Admin Components
import AdminPanel from "./components/admin/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <TabsBar />
      <Routes>
        {/* Main Site Routes */}
        <Route
          path="/"
          element={
            <>
              <HeroSlider />
              <NoticeBoard />
              <Leadership />
              <Achievers />
              <AboutVillage />
              <Services />
              <HealthContacts />
              <EducationPrograms />
              <ProblemReporting />
              <Classifieds />
              <ContactsDirectory />
              <Gallery />
              <ContactMap />
            </>
          }
        />

        {/* Admin Panel Route */}
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;