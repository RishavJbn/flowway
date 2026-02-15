import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import TextNode from "./TextNode.jsx";
// import { useState } from "react";


// ✅ STATIC — defined outside component
const nodeTypes = {
  textNode: TextNode,
};

function Canvas({ nodes, edges, setNodes, setEdges, setSelectedNodeId }) {
  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect = (connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          type: "smoothstep",
          style: { stroke: "#94a3b8", strokeWidth: 2 },
        },
        eds,
      ),
    );
  };

  const onSelectionChange = ({ nodes }) => {
    if (nodes.length > 0) {
      setSelectedNodeId(nodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  };


  return (
    <div className="w-full h-full bg-[#f6f7fb]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        panOnScroll
      >
        <MiniMap
          nodeColor={() => "#e5e7eb"}
          nodeStrokeWidth={2}
          zoomable
          pannable
        />
        <Controls />
        <Background gap={24} size={1} color="#e5e7eb" />
      </ReactFlow>
    </div>
  );
}

export default Canvas;
