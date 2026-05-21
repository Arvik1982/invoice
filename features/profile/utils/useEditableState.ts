import { useState, useRef } from "react";

export const useEditableState = <T>(initialValue: T) => {
  const [currentValue, setCurrentValue] = useState<T>(initialValue);
  const originalValueRef = useRef<T>(initialValue);
  const isEditingRef = useRef(false);

  const startEditing = () => {
    originalValueRef.current = { ...currentValue } as T;
    isEditingRef.current = true;
  };

  const saveChanges = () => {
    isEditingRef.current = false;
  };

  const cancelEditing = () => {
    setCurrentValue(originalValueRef.current);
    isEditingRef.current = false;
  };

  const updateValue = (updates: Partial<T>) => {
    setCurrentValue((prev) => ({ ...prev, ...updates }));
  };

  return {
    value: currentValue,
    setValue: setCurrentValue,
    updateValue,
    startEditing,
    saveChanges,
    cancelEditing,
    isEditing: isEditingRef.current,
    originalValue: originalValueRef.current,
  };
};
