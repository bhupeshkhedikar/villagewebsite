import React, { useState } from "react";
import "./TabsBar.css";
import ProblemFeed from "./ProblemFeed"; 
import ClassifiedsFeed from "./ClassifiedsFeed"; 
import UserEventsFeed from "./UserEventsFeed"; 
import SliderUpload from "./admin/SliderUpload";


const tabs = [
  { id: "home", label: "मुखपृष्ठ", icon: "🏠", gradient: "linear-gradient(135deg, #4f46e5, #9333ea)" },
  { id: "services", label: "तक्रारी", icon: "🛠️", gradient: "linear-gradient(135deg, #16a34a, #22c55e)" },
  { id: "classifieds", label: "जाहिराती", icon: "📢", gradient: "linear-gradient(135deg, #f43f5e, #dc2626)" },
  { id: "notice", label: "सूचना", icon: "📰", gradient: "linear-gradient(135deg, #f59e0b, #f97316)" },
  { id: "events", label: "कार्यक्रम", icon: "📅", gradient: "linear-gradient(135deg, #2563eb, #3b82f6)" },
  { id: "upload", label: "छायाचित्र अपलोड", icon: "📤", gradient: "linear-gradient(135deg, #dc2626, #f43f5e)" }
];

const TabsBar = () => {
  const [active, setActive] = useState("home");
  const [showProblemFeed, setShowProblemFeed] = useState(false);
  const [showClassifiedsFeed, setShowClassifiedsFeed] = useState(false);
  const [showUserEventsFeed, setShowUserEventsFeed] = useState(false);
  const [showSliderUpload, setShowSliderUpload] = useState(false); // ✅ new state

  const handleTabClick = (tabId) => {
    setActive(tabId);
    setShowProblemFeed(false);
    setShowClassifiedsFeed(false);
    setShowUserEventsFeed(false);
    setShowSliderUpload(false);

    if (tabId === "services") setShowProblemFeed(true);
    if (tabId === "classifieds") setShowClassifiedsFeed(true);
    if (tabId === "events") setShowUserEventsFeed(true);
    if (tabId === "upload") setShowSliderUpload(true); // ✅ open popup
  };

  return (
    <>
      <div className="tabs-bar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${active === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="tab-icon" style={{ background: tab.gradient }}>
              {tab.icon}
            </span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Problem Feed Modal */}
      {showProblemFeed && (
        <div className="modal-overlay" onClick={() => setShowProblemFeed(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProblemFeed(false)}>❌</button>
            <ProblemFeed />
          </div>
        </div>
      )}

      {/* Classifieds Feed Modal */}
      {showClassifiedsFeed && (
        <div className="modal-overlay" onClick={() => setShowClassifiedsFeed(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowClassifiedsFeed(false)}>❌</button>
            <ClassifiedsFeed />
          </div>
        </div>
      )}

      {/* User Events Feed Modal */}
      {showUserEventsFeed && (
        <div className="modal-overlay" onClick={() => setShowUserEventsFeed(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUserEventsFeed(false)}>❌</button>
            <UserEventsFeed />
          </div>
        </div>
      )}

      {/* ✅ Slider Upload Modal */}
      {showSliderUpload && (
        <div className="modal-overlay" onClick={() => setShowSliderUpload(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSliderUpload(false)}>❌</button>
            <SliderUpload />
          </div>
        </div>
      )}
    </>
  );
};

export default TabsBar;
