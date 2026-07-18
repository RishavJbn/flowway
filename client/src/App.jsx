import { useEffect, useState, useRef } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import Canvas from "./components/Canvas.jsx";
import FloatingToolbar from "./components/FloatingToolbar.jsx";
import AuthControls from "./components/AuthControls.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Menu } from "lucide-react";
import { useAuthSafe as useAuth } from "./hooks/useAuthSafe.js";
import {
  fetchFlows,
  fetchFlow,
  createFlow,
  updateFlow,
  deleteFlow,
} from "./utils/api.js";

function App() {
  const { getToken, isSignedIn } = useAuth();

  /* ---------------- FLOW METADATA ---------------- */
  const [flows, setFlows] = useState([]);
  const [currentFlowId, setCurrentFlowId] = useState(null);
  const [currentFlowName, setCurrentFlowName] = useState("Local Flow");
  const [saveStatus, setSaveStatus] = useState("local"); // "local" | "saving" | "synced"
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isInitialLoad = useRef(true);

  /* ---------------- NODES ---------------- */
  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem("flowway-nodes");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            type: "textNode",
            position: { x: 100, y: 100 },
            data: { label: "Idea", color: "blue", shape: "rounded" },
          },
        ];
  });

  /* ---------------- EDGES ---------------- */
  const [edges, setEdges] = useState(() => {
    const saved = localStorage.getItem("flowway-edges");
    return saved ? JSON.parse(saved) : [];
  });

  /* ---------------- SELECTION ---------------- */
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);

  /* ---------------- CANVAS ---------------- */
  const [canvasTheme, setCanvasTheme] = useState("light");
  const [canvasPattern, setCanvasPattern] = useState("grid");

  /* ---------------- HISTORY ---------------- */
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  /* ---------------- SAVE LOCAL FALLBACK ---------------- */
  useEffect(() => {
    if (!isSignedIn) {
      localStorage.setItem("flowway-nodes", JSON.stringify(nodes));
    }
  }, [nodes, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) {
      localStorage.setItem("flowway-edges", JSON.stringify(edges));
    }
  }, [edges, isSignedIn]);

  /* ---------------- SYNC AUTH STATE ---------------- */
  useEffect(() => {
    const initializeFlows = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          const userFlows = await fetchFlows(token);
          setFlows(userFlows);

          if (userFlows.length > 0) {
            // Load the most recently modified flow
            const active = userFlows[0];
            isInitialLoad.current = true;
            setCurrentFlowId(active.id);
            setCurrentFlowName(active.name);
            setNodes(active.nodes);
            setEdges(active.edges);
            setCanvasTheme(active.theme || "light");
            setCanvasPattern(active.pattern || "grid");
            setSaveStatus("synced");
          } else {
            // No flows yet, create an initial one
            handleNewFlow();
          }
        } catch (err) {
          console.error("Failed to load user flows:", err);
        }
      } else {
        // Restore local storage flow
        const savedNodes = localStorage.getItem("flowway-nodes");
        const savedEdges = localStorage.getItem("flowway-edges");
        isInitialLoad.current = true;
        setNodes(savedNodes ? JSON.parse(savedNodes) : [
          {
            id: "1",
            type: "textNode",
            position: { x: 100, y: 100 },
            data: { label: "Idea", color: "blue", shape: "rounded" },
          },
        ]);
        setEdges(savedEdges ? JSON.parse(savedEdges) : []);
        setCurrentFlowId(null);
        setCurrentFlowName("Local Flow");
        setSaveStatus("local");
      }
    };

    initializeFlows();
  }, [isSignedIn]);

  /* ---------------- AUTO-SAVE TO BACKEND ---------------- */
  useEffect(() => {
    if (!isSignedIn) return;
    
    // Skip autosave triggering on the initial data fetching load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    setSaveStatus("saving");
    const delayDebounceFn = setTimeout(async () => {
      try {
        const token = await getToken();
        if (currentFlowId) {
          await updateFlow(
            currentFlowId,
            {
              name: currentFlowName,
              nodes,
              edges,
              theme: canvasTheme,
              pattern: canvasPattern,
            },
            token
          );
          setSaveStatus("synced");
          setFlows((prev) =>
            prev.map((f) =>
              f.id === currentFlowId ? { ...f, name: currentFlowName } : f
            )
          );
        } else {
          const newFlow = await createFlow(
            {
              name: currentFlowName,
              nodes,
              edges,
              theme: canvasTheme,
              pattern: canvasPattern,
            },
            token
          );
          setCurrentFlowId(newFlow.id);
          setFlows((prev) => [newFlow, ...prev]);
          setSaveStatus("synced");
        }
      } catch (err) {
        console.error("Autosave error:", err);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [nodes, edges, currentFlowName, canvasTheme, canvasPattern, currentFlowId, isSignedIn]);

  /* ---------------- BACKEND ACTIONS ---------------- */
  const handleManualSave = async () => {
    if (!isSignedIn) return;
    try {
      setSaveStatus("saving");
      const token = await getToken();
      if (currentFlowId) {
        await updateFlow(
          currentFlowId,
          {
            name: currentFlowName,
            nodes,
            edges,
            theme: canvasTheme,
            pattern: canvasPattern,
          },
          token
        );
        setSaveStatus("synced");
      }
    } catch (err) {
      console.error("Manual save failed:", err);
    }
  };

  const handleLoadFlow = async (id) => {
    try {
      const token = await getToken();
      const flow = await fetchFlow(id, token);
      isInitialLoad.current = true;
      setCurrentFlowId(flow.id);
      setCurrentFlowName(flow.name);
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setCanvasTheme(flow.theme || "light");
      setCanvasPattern(flow.pattern || "grid");
      setSaveStatus("synced");
      setSidebarOpen(false); // Close sidebar on load
    } catch (err) {
      console.error("Failed to load flow:", err);
    }
  };

  const handleNewFlow = async () => {
    const defaultNodes = [
      {
        id: "1",
        type: "textNode",
        position: { x: 100, y: 100 },
        data: { label: "Idea", color: "blue", shape: "rounded" },
      },
    ];
    const defaultEdges = [];

    if (isSignedIn) {
      try {
        setSaveStatus("saving");
        const token = await getToken();
        const newFlow = await createFlow(
          {
            name: "Untitled Diagram",
            nodes: defaultNodes,
            edges: defaultEdges,
            theme: "light",
            pattern: "grid",
          },
          token
        );
        isInitialLoad.current = true;
        setCurrentFlowId(newFlow.id);
        setCurrentFlowName(newFlow.name);
        setNodes(newFlow.nodes);
        setEdges(newFlow.edges);
        setCanvasTheme("light");
        setCanvasPattern("grid");
        setFlows((prev) => [newFlow, ...prev]);
        setSaveStatus("synced");
        setSidebarOpen(false); // Close sidebar on create
      } catch (err) {
        console.error("Failed to create new flow:", err);
      }
    } else {
      isInitialLoad.current = true;
      setNodes(defaultNodes);
      setEdges(defaultEdges);
      setCurrentFlowId(null);
      setCurrentFlowName("Local Flow");
      setSaveStatus("local");
    }
  };

  const handleDeleteFlow = async (id) => {
    try {
      const token = await getToken();
      await deleteFlow(id, token);
      setFlows((prev) => prev.filter((f) => f.id !== id));

      if (currentFlowId === id) {
        const remaining = flows.filter((f) => f.id !== id);
        if (remaining.length > 0) {
          handleLoadFlow(remaining[0].id);
        } else {
          handleNewFlow();
        }
      }
    } catch (err) {
      console.error("Failed to delete flow:", err);
    }
  };

  /* ---------------- HISTORY WRAPPERS ---------------- */
  const updateNodes = (updater) => {
    setHistory((h) => [...h, { nodes, edges }]);
    setFuture([]);
    setNodes(updater);
  };

  const updateEdges = (updater) => {
    setHistory((h) => [...h, { nodes, edges }]);
    setFuture([]);
    setEdges(updater);
  };

  /* ---------------- UNDO ---------------- */
  const undo = () => {
    if (history.length === 0) return;

    const prev = history[history.length - 1];

    setFuture((f) => [{ nodes, edges }, ...f]);
    setNodes(prev.nodes);
    setEdges(prev.edges);
    setHistory((h) => h.slice(0, -1));
  };

  /* ---------------- REDO ---------------- */
  const redo = () => {
    if (future.length === 0) return;

    const next = future[0];

    setHistory((h) => [...h, { nodes, edges }]);
    setNodes(next.nodes);
    setEdges(next.edges);
    setFuture((f) => f.slice(1));
  };

  /* ---------------- ADD NODE ---------------- */
  const COLORS = ["blue", "purple", "pink", "green", "yellow"];
  const getRandomColor = () =>
    COLORS[Math.floor(Math.random() * COLORS.length)];

  const addNode = () => {
    updateNodes((nds) => [
      ...nds,
      {
        id: Date.now().toString(),
        type: "textNode",
        position: { x: 300, y: 200 },
        data: {
          label: "Text",
          color: getRandomColor(),
          shape: "rounded",
        },
      },
    ]);
  };

  /* ---------------- KEYBOARD SHORTCUTS ---------------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is editing text inputs, textareas or other editable fields
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodeId) {
          updateNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
          updateEdges((eds) => eds.filter((ed) => ed.source !== selectedNodeId && ed.target !== selectedNodeId));
          setSelectedNodeId(null);
        } else if (selectedEdgeId) {
          updateEdges((eds) => eds.filter((ed) => ed.id !== selectedEdgeId));
          setSelectedEdgeId(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, updateNodes, updateEdges]);

  return (
    <div className={`w-screen h-screen ${canvasTheme === "dark" ? "dark-canvas" : ""}`}>
      <ReactFlowProvider>
        {/* LEFT WORKSPACE SIDEBAR */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          flows={flows}
          currentFlowId={currentFlowId}
          onLoadFlow={handleLoadFlow}
          onNewFlow={handleNewFlow}
          onDeleteFlow={handleDeleteFlow}
        />

        {/* SIDEBAR FLOATING TOGGLE BUTTON */}
        {isSignedIn && (
          <button
            className="fw-sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            title="Open Workspace Sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        {/* AUTHENTICATION CONTROLS */}
        <AuthControls
          currentFlowName={currentFlowName}
          setCurrentFlowName={setCurrentFlowName}
          saveStatus={saveStatus}
          onSave={handleManualSave}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* TOOLBAR */}
        <FloatingToolbar
          addNode={addNode}
          undo={undo}
          redo={redo}
          selectedNodeId={selectedNodeId}
          selectedEdgeId={selectedEdgeId}
          setNodes={updateNodes}
          setEdges={updateEdges}
          canvasTheme={canvasTheme}
          setCanvasTheme={setCanvasTheme}
          setCanvasPattern={setCanvasPattern}
        />

        {/* CANVAS */}
        <Canvas
          nodes={nodes}
          edges={edges}
          setNodes={updateNodes}
          setEdges={updateEdges}
          setSelectedNodeId={setSelectedNodeId}
          setSelectedEdgeId={setSelectedEdgeId}
          canvasTheme={canvasTheme}
          canvasPattern={canvasPattern}
        />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
