import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import Canvas from "./components/Canvas.jsx";
import FloatingToolbar from "./components/FloatingToolbar.jsx";

function App() {
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

  const [edges, setEdges] = useState(() => {
    const saved = localStorage.getItem("flowway-edges");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  
  const [canvasTheme, setCanvasTheme] = useState("light");
const [canvasPattern, setCanvasPattern] = useState("grid");




  useEffect(() => {
    localStorage.setItem("flowway-nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("flowway-edges", JSON.stringify(edges));
  }, [edges]);

  const COLORS = ["blue", "purple", "pink", "green", "yellow"];
  const getRandomColor = () =>
    COLORS[Math.floor(Math.random() * COLORS.length)];

  const addNode = () => {
    setNodes((nds) => [
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
        <FloatingToolbar
          addNode={addNode}
          selectedNodeId={selectedNodeId}
          selectedEdgeId={selectedEdgeId}
          setNodes={setNodes}
          setEdges={setEdges}
          setCanvasTheme={setCanvasTheme}
          setCanvasPattern={setCanvasPattern}
        />

        <Canvas
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
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
