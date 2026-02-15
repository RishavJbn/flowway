import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import Canvas from "./components/Canvas.jsx";
import Toolbar from "./components/Toolbar.jsx";

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
           data: { label: "Idea" },
         },
         {
           id: "2",
           type: "textNode",
           position: { x: 400, y: 200 },
           data: { label: "Feature" },
         },
       ];
 });

 const [edges, setEdges] = useState(() => {
   const saved = localStorage.getItem("flowway-edges");
   return saved
     ? JSON.parse(saved)
     : [{ id: "e1-2", source: "1", target: "2" }];
 });

 useEffect(() => {
   localStorage.setItem("flowway-nodes", JSON.stringify(nodes));
 }, [nodes]);

 useEffect(() => {
   localStorage.setItem("flowway-edges", JSON.stringify(edges));
 }, [edges]);



  const addNode = () => {
    setNodes((nds) => [
      ...nds,
      {
        id: Date.now().toString(),
        type: "textNode",
        position: { x: 300, y: 200 },
        data: { label: "New Idea" },
      },
    ]);
  };

  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <Toolbar addNode={addNode} />
        <Canvas
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
        />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
