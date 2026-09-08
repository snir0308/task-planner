import { useParams } from "react-router-dom";
import Board from "./Board.jsx";

const ViewOnlyBoard = () => {
  const { boardId } = useParams();
  return <Board readOnly boardId={boardId} />;
};

export default ViewOnlyBoard;
