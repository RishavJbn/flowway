import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import Canvas from "./components/Canvas.jsx";
import Toolbar from "./components/Toolbar.jsx";


function App() {
  const [nodes, setNodes] = useState([
    {
      id: "1",
      type: "textNode",
      position: { x: 100, y: 100 },
      data: { label: "Idea" },
    },
    {
      id: "2",
      type: "textNode",
      position: { x: 400, y: 200 },
      data: { label: "Feature" },
    },
    {
      id: "3",
      type: "textNode",
      position: { x: 600, y: 300 },
      data: { label: "Feature" },
    },
  ]);

  const [edges, setEdges] = useState([
    { id: "e1-2", source: "1", target: "2" },
  ]);
 // adding  new node
  const addNode = () => {
    const newNode = {
      id: Date.now().toString(),
      type: "textNode",
      position: {
        x: Math.random() * 500,
        y: Math.random() * 400,
      },
      data: { label: "New Idea" },
    };

    setNodes((nds) => [...nds, newNode]);
  };


  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <Toolbar addNode={addNode} />
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
