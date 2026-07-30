import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "timaran:seleccion-esencias";

const readStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Lista de esencias que el usuario va guardando para pedir una cotización.
 * Se conserva en localStorage para que no se pierda al recargar.
 */
export function useSelection() {
  const [items, setItems] = useState(readStorage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* modo privado / storage lleno: la selección sigue viva en memoria */
    }
  }, [items]);

  const toggle = useCallback((perfume) => {
    setItems((prev) =>
      prev.some((item) => item.id === perfume.id)
        ? prev.filter((item) => item.id !== perfume.id)
        : [
            ...prev,
            {
              id: perfume.id,
              newName: perfume.newName,
              name: perfume.name,
              picture: perfume.picture,
            },
          ]
    );
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const ids = useMemo(() => new Set(items.map((item) => item.id)), [items]);

  return { items, ids, toggle, remove, clear };
}
