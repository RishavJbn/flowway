import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import Canvas from "./components/Canvas.jsx";
import FloatingToolbar from "./components/FloatingToolbar.jsx";

function App() {
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

  /* ---------------- SAVE LOCAL ---------------- */
  useEffect(() => {
    localStorage.setItem("flowway-nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("flowway-edges", JSON.stringify(edges));
  }, [edges]);

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

  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        {/* TOOLBAR */}
        <FloatingToolbar
          addNode={addNode}
          undo={undo}
          redo={redo}
          selectedNodeId={selectedNodeId}
          selectedEdgeId={selectedEdgeId}
          setNodes={updateNodes}
          setEdges={updateEdges}
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
