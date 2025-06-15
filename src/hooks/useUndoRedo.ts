
import { useRef, useState } from 'react';

type Setter<T> = (val: T) => void;

// A simple undo/redo hook for arrays/objects.
export function useUndoRedo<T>(state: T, setState: Setter<T>) {
  const [pointer, setPointer] = useState(0);
  const history = useRef<T[]>([state]);

  // Call to remember a new snapshot
  const saveSnapshot = () => {
    // Remove redo history if after changes
    history.current = history.current.slice(0, pointer + 1);
    history.current.push(JSON.parse(JSON.stringify(state)));
    setPointer(history.current.length - 1);
  };

  // Undo operation
  const undo = () => {
    if (pointer === 0) return;
    setPointer(ptr => {
      const newPtr = ptr - 1;
      setState(history.current[newPtr]);
      return newPtr;
    });
  };

  // Redo operation
  const redo = () => {
    if (pointer + 1 >= history.current.length) return;
    setPointer(ptr => {
      const newPtr = ptr + 1;
      setState(history.current[newPtr]);
      return newPtr;
    });
  };

  // Watch state changes (to update pointer/history if user loads new page/project)
  // Optionally, user can reset by supplying a key.

  return {
    snapshots: history.current,
    saveSnapshot,
    undo,
    redo,
    canUndo: pointer > 0,
    canRedo: pointer + 1 < history.current.length
  };
}
