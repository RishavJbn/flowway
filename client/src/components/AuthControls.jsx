import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { FolderOpen, Plus, Trash2, Cloud, CloudLightning, Save } from "lucide-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isValidKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith("pk_");

function AuthControls({
  currentFlowName,
  setCurrentFlowName,
  saveStatus,
  onSave,
  onToggleSidebar,
}) {
  // If Clerk is not set up, show an informative Local/Offline UI
  if (!isValidKey) {
    return (
      <div className="fw-auth-container">
        <div className="fw-auth-card">
          <span className="text-xs font-semibold text-amber-500 flex items-center gap-1" title="Clerk keys not configured in client/.env.local">
            ⚠️ Offline Mode
          </span>
          <div className="fw-divider" />
          <button 
            className="fw-auth-btn"
            onClick={() => alert("To enable online Saving and Cloud Workspace, please paste your Clerk Publishable Key in client/.env.local (and restart your development server)!\n\nFor details, see client/src/components/AuthControls.jsx")}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const getStatusText = () => {
    if (saveStatus === "saving") return "Saving...";
    if (saveStatus === "synced") return "Cloud Synced";
    return "Local Only";
  };

  const getStatusClass = () => {
    if (saveStatus === "saving") return "saving";
    if (saveStatus === "synced") return "synced";
    return "";
  };

  return (
    <div className="fw-auth-container">
      {/* 1. SIGNED OUT STATE */}
      <SignedOut>
        <div className="fw-auth-card">
          <span className="text-xs font-medium text-gray-500">
            Sign in to save online
          </span>
          <SignInButton mode="modal">
            <button className="fw-auth-btn">Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* 2. SIGNED IN STATE */}
      <SignedIn>
        <div className="fw-auth-card">
          {/* Status icon/badge */}
          <div className="flex items-center gap-1.5" title={getStatusText()}>
            {saveStatus === "synced" ? (
              <Cloud size={16} className="text-green-500" />
            ) : saveStatus === "saving" ? (
              <CloudLightning size={16} className="text-amber-500 animate-pulse" />
            ) : (
              <Save size={16} className="text-gray-400" />
            )}
            <span className={`fw-status-badge ${getStatusClass()}`}>
              {getStatusText()}
            </span>
          </div>

          <div className="fw-divider" />

          {/* Flow Title Input */}
          <input
            type="text"
            className="fw-flow-name-input"
            value={currentFlowName}
            onChange={(e) => setCurrentFlowName(e.target.value)}
            placeholder="Untitled Flow"
            title="Rename Flow"
          />

          <div className="fw-divider" />

          {/* Manual Save Button */}
          <button
            className="fw-btn"
            onClick={onSave}
            title="Save Now"
            disabled={saveStatus === "saving"}
          >
            <Save size={18} />
          </button>

          {/* Sidebar Toggle Button */}
          <button
            className="fw-btn"
            onClick={onToggleSidebar}
            title="Open Workspace Sidebar"
          >
            <FolderOpen size={18} />
          </button>

          <div className="fw-divider" />

          {/* Clerk Account Menu */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
}

export default AuthControls;
