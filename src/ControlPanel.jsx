import { PRESETS } from "./LSystemEngine";

export default function ControlPanel({
  axiom, setAxiom, rules, setRules,
  angle, setAngle, iterations, setIterations, lstring,
}) {
  const handleRuleChange = (from, to) => setRules((prev) => ({ ...prev, [from]: to }));

  const handleRuleKeyChange = (oldKey, newKey) => {
    setRules((prev) => {
      const next = { ...prev };
      const val = next[oldKey];
      delete next[oldKey];
      next[newKey] = val ?? "";
      return next;
    });
  };

  const addRule = () => {
    const key = prompt("Variable symbol (single character):");
    if (!key || key.length !== 1) return;
    setRules((prev) => ({ ...prev, [key]: "" }));
  };

  const removeRule = (key) => {
    setRules((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const loadPreset = (preset) => {
    setAxiom(preset.axiom);
    setRules(preset.rules);
    setAngle(preset.angle);
    setIterations(preset.iterations);
  };

  return (
    <div className="control-panel">
      <div className="panel-header">
        <span className="panel-logo">GrammarGen</span>
        <span className="panel-sub">L-System Procedural Generator</span>
      </div>

      <section className="section">
        <div className="section-label">Presets</div>
        <div className="preset-grid">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button key={key} className="preset-btn" onClick={() => loadPreset(preset)}>
              <span className="preset-name">{preset.name}</span>
              <span className="preset-desc">{preset.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-label">Grammar Tuple (V, Σ, R, S)</div>
        <div className="field">
          <label className="field-label">S — Axiom (start string)</label>
          <input className="field-input" value={axiom} onChange={(e) => setAxiom(e.target.value)} spellCheck={false} />
        </div>
        <div className="field">
          <label className="field-label">R — Production Rules</label>
          {Object.entries(rules).map(([from, to]) => (
            <div key={from} className="rule-row">
              <input className="field-input rule-from" value={from} maxLength={1}
                onChange={(e) => handleRuleKeyChange(from, e.target.value)} spellCheck={false} />
              <span className="rule-arrow">→</span>
              <input className="field-input rule-to" value={to}
                onChange={(e) => handleRuleChange(from, e.target.value)} spellCheck={false} />
              <button className="rule-remove" onClick={() => removeRule(from)}>✕</button>
            </div>
          ))}
          <button className="add-rule-btn" onClick={addRule}>+ Add Rule</button>
        </div>
      </section>

      <section className="section">
        <div className="section-label">Parameters</div>
        <div className="field">
          <div className="slider-header">
            <label className="field-label">θ — Rotation Angle</label>
            <span className="slider-val">{angle}°</span>
          </div>
          <input type="range" min="1" max="90" step="1" value={angle}
            onChange={(e) => setAngle(Number(e.target.value))} className="slider" />
        </div>
        <div className="field">
          <div className="slider-header">
            <label className="field-label">N — Iterations</label>
            <span className="slider-val">{iterations}</span>
          </div>
          <input type="range" min="1" max="7" step="1" value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))} className="slider" />
        </div>
      </section>

      <section className="section">
        <div className="section-label">Runtime Stats</div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">String length</span>
            <span className="stat-value">{lstring.length.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Draw symbols</span>
            <span className="stat-value">{[...lstring].filter(c => c === "F").length.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Stack ops</span>
            <span className="stat-value">{[...lstring].filter(c => c === "[").length.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Variables</span>
            <span className="stat-value">{Object.keys(rules).length}</span>
          </div>
        </div>
      </section>

      <div className="pda-badge">
        <span className="badge-icon">⊢</span>
        <span>PDA stack simulation active</span>
      </div>
    </div>
  );
}
