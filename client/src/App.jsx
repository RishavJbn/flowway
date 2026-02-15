import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import Canvas from "./components/Canvas";

function App() {
  const [nodes, setNodes] = useState([
    {
      id: "1",
      position: { x: 100, y: 100 },
      data: { label: "Idea" },
    },
    {
      id: "2",
      position: { x: 400, y: 200 },
      data: { label: "Feature" },
    },
    {
      id: "3",
      position: { x: 600, y: 300 },
      data: { label: "Feature" },
    },
  ]);

  const [edges, setEdges] = useState([
    { id: "e1-2", source: "1", target: "2" },
  ]);

  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <Canvas
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
        />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
