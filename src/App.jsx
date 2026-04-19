import { useState, useMemo } from "react";
import ControlPanel from "./ControlPanel";
import CanvasVisualizer from "./CanvasVisualizer";
import { PRESETS, applyRules } from "./LSystemEngine";
import "./App.css";

const DEFAULT = PRESETS.fractalTree;

export default function App() {
  const [axiom, setAxiom] = useState(DEFAULT.axiom);
  const [rules, setRules] = useState(DEFAULT.rules);
  const [angle, setAngle] = useState(DEFAULT.angle);
  const [iterations, setIterations] = useState(DEFAULT.iterations);

  const lstring = useMemo(
    () => applyRules(axiom, rules, iterations),
    [axiom, rules, iterations]
  );

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <ControlPanel
          axiom={axiom} setAxiom={setAxiom}
          rules={rules} setRules={setRules}
          angle={angle} setAngle={setAngle}
          iterations={iterations} setIterations={setIterations}
          lstring={lstring}
        />
      </aside>
      <main className="canvas-area">
        <CanvasVisualizer axiom={axiom} rules={rules} angle={angle} iterations={iterations} />
        <div className="canvas-overlay-label">
          {lstring.slice(0, 80)}{lstring.length > 80 ? "…" : ""}
        </div>
      </main>
    </div>
  );
}
