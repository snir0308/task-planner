import { create } from 'zustand';

export const useBoardStore = create((set) => ({
  board: null,
  boardId: null,
  editToken: null,

  setBoard: (board, boardId, editToken) => set({ 
    board, 
    boardId: boardId || board?.boardId, 
    editToken: editToken || board?.editToken 
  }),

  updateBoardField: (field, value) => set((state) => ({
    board: state.board ? { ...state.board, [field]: value } : null
  })),

  clearBoard: () => set({ board: null, boardId: null, editToken: null }),
}));
