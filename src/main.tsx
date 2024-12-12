import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Layout } from "./Layout";
import { ColorConverterPage } from "./ColorConverter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/cc-converter" />} />
          <Route path="/cc-converter" element={<ColorConverterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
