import { useState } from "react";
import { Plus, Trash2, ChevronLeft, Search, Database } from "lucide-react";

function Sidebar({
  isOpen,
  onClose,
  flows,
  currentFlowId,
  onLoadFlow,
  onNewFlow,
  onDeleteFlow,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFlows = flows.filter((flow) =>
    flow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className={`fw-sidebar ${isOpen ? "open" : ""}`}>
      {/* HEADER */}
      <div className="fw-sidebar-header">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-indigo-600 dark:text-indigo-400" />
          <span className="fw-sidebar-title">Cloud Workspace</span>
        </div>
        <button
          className="fw-sidebar-close-btn"
          onClick={onClose}
          title="Collapse Sidebar"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* BODY */}
      <div className="fw-sidebar-body">
        {/* NEW BOARD BUTTON */}
        <button className="fw-sidebar-new-btn" onClick={onNewFlow}>
          <Plus size={16} /> New Board
        </button>

        {/* SEARCH BOX */}
        <div className="relative flex items-center">
          <input
            type="text"
            className="fw-sidebar-search"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
        </div>

        {/* BOARDS LIST */}
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
          <span className="text-xs font-semibold text-gray-400 px-2 uppercase tracking-wider">
            All Diagrams ({filteredFlows.length})
          </span>

          {filteredFlows.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              {searchQuery ? "No matching boards found" : "No cloud boards yet"}
            </div>
          ) : (
            <div className="fw-sidebar-flows-list">
              {filteredFlows.map((flow) => (
                <div
                  key={flow.id}
                  className={`fw-sidebar-flow-item ${
                    flow.id === currentFlowId ? "active" : ""
                  }`}
                  onClick={() => onLoadFlow(flow.id)}
                >
                  <div className="fw-sidebar-flow-content">
                    <span className="fw-sidebar-flow-title">{flow.name}</span>
                    <span className="fw-sidebar-flow-date">
                      {formatDate(flow.updatedAt)}
                    </span>
                  </div>
                  <button
                    className="fw-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete diagram "${flow.name}"?`)) {
                        onDeleteFlow(flow.id);
                      }
                    }}
                    title="Delete Board"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="fw-sidebar-footer">
        <span>Connected to PostgreSQL</span>
        <span>{flows.length} Total</span>
      </div>
    </div>
  );
}

export default Sidebar;
