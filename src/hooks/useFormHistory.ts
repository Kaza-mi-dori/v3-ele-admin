import { useManualRefHistory } from "@vueuse/core";

export function useFormHistory(initialValue: any) {
  const { history, commit, undo, redo, canUndo, canRedo } = useManualRefHistory(
    initialValue,
    { clone: true }
  );

  const saveForm = () => {
    commit();
  };
  const restoreForm = () => {
    undo();
  };

  return {
    history,
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
    saveForm,
    restoreForm,
  };
}
