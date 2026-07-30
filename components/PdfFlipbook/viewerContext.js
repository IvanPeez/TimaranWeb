import { createContext, useContext } from "react";

/**
 * Estado que necesitan las páginas del libro.
 *
 * Va por contexto y no por props porque react-pageflip congela los elementos
 * hijos en su propio estado (los clona una sola vez para entregárselos a
 * StPageFlip). Cambiar las props del elemento obligaría a reinicializar el
 * libro y perdería la animación en curso; el contexto, en cambio, re-renderiza
 * las páginas sin tocar los nodos que StPageFlip está manipulando.
 */
const ViewerContext = createContext(null);

export const ViewerProvider = ViewerContext.Provider;

export const useViewer = () => useContext(ViewerContext);
