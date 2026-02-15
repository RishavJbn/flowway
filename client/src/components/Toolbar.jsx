function Toolbar({ addNode }) {
  return (
    <div className="absolute top-4 left-4 z-10">
      <button
        onClick={addNode}
        className="px-4 py-2 bg-black text-white rounded"
      >
        + Add Node
      </button>
    </div>
  );
}

export default Toolbar;
