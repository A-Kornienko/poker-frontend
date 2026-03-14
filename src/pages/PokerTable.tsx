import React from "react";
import PokerGame from "../components/PokerGame";
import { useParams } from "react-router-dom";

const PokerTable = () => {
  const { id } = useParams();
  const parsedTableId = Number(id);
  if (isNaN(parsedTableId)) {
    console.error("Invalid tableId:", tableId);
    return;
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <PokerGame tableId={id} />
    </div>
  );
};

export default PokerTable;
