// AdminPanel.jsx
import React, { useState } from "react";
import ProblemAdminPanel from "./ProblemAdminPanel";
import ClassifiedsAdminPanel from "./ClassifiedsAdminPanel";
import UserEventsAdmin from "./UserEventsAdmin";
import GalleryAdmin from "./GalleryAdmin";
import EventsAdmin from "./EventsAdmin";
import AchieversAdmin from "./AchieversAdmin";
import LeadershipAdmin from "./LeadershipAdmin";
import NoticeBoardAdmin from "./NoticeBoardAdmin";
import SliderUpload from "./SliderUpload";
import ContactsDirectoryAdmin from "./ContactsDirectoryAdmin";
import "./AdminPanel.css";

const adminTabs = [
    { id: "problemReports", label: "तक्रारी", component: <ProblemAdminPanel /> },
    { id: "classifieds", label: "जाहिराती", component: <ClassifiedsAdminPanel /> },
    { id: "userEvents", label: "कार्यक्रम", component: <UserEventsAdmin /> },
    { id: "gallery", label: "गॅलरी", component: <GalleryAdmin /> },
    { id: "events", label: "ईव्हेंट्स", component: <EventsAdmin /> },
    { id: "achievers", label: "सन्मानित", component: <AchieversAdmin /> },
    { id: "leadership", label: "पंचायती सदस्य", component: <LeadershipAdmin /> },
    { id: "noticeBoard", label: "सूचना", component: <NoticeBoardAdmin /> },
    { id: "sliderUpload", label: "स्लायडर", component: <SliderUpload /> },
    { id: "ContactsDirectoryAdmin", label: "संपर्क", component: <ContactsDirectoryAdmin /> },
];

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("problemReports");

    return (
        <div className="admin-panel-container">
            <h2 className="admin-panel-title">🛠️ प्रशासक पॅनेल</h2>
            <div className="admin-tabs-bar">
                {adminTabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`admin-tab-item ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="admin-tab-content">
                {adminTabs.find((t) => t.id === activeTab)?.component}
            </div>
        </div>
    );
};

export default AdminPanel;
