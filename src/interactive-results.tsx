import { useState } from "react";
import resultsJson from "./results-data.json";

type ResultValue = { value: string; best: boolean };
type ResultRow = { method: string; featured: boolean; values: ResultValue[] };
type ResultTable = { columns: string[]; rows: ResultRow[]; source: string };
type ResultsData = {
  generationOrder: string[];
  generation: Record<string, ResultTable>;
  foundation: {
    columns: string[];
    protocolOrder: string[];
    protocols: Record<string, ResultRow[]>;
    source: string;
  };
};

const results = resultsJson as ResultsData;

function ResultValueCell({ result }: { result: ResultValue }) {
  return result.best ? <strong>{result.value}</strong> : <>{result.value}</>;
}

export function GenerationResultsTable() {
  const [activeDataset, setActiveDataset] = useState("RingDiv300k");
  const table = results.generation[activeDataset];

  return (
    <div className="interactive-results">
      <div className="results-panel-title">
        <div>
          <span>Supplementary results</span>
          <h3>Generation benchmarks</h3>
        </div>
        <small>select a dataset</small>
      </div>
      <div className="results-tabs" role="group" aria-label="Generation benchmark dataset">
        {results.generationOrder.map((dataset) => (
          <button
            key={dataset}
            type="button"
            aria-pressed={activeDataset === dataset}
            onClick={() => setActiveDataset(dataset)}
          >
            {dataset}
          </button>
        ))}
      </div>
      <div
        className="result-table-scroll"
        id="generation-results-table"
        aria-live="polite"
      >
        <table>
          <caption>{activeDataset} generation performance</caption>
          <thead>
            <tr>
              <th scope="col">Method</th>
              {table.columns.map((column) => <th scope="col" key={column}>{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr className={row.featured ? "featured-result-row" : ""} key={row.method}>
                <th scope="row">{row.method}</th>
                {row.values.map((result, index) => (
                  <td key={`${row.method}-${table.columns[index]}`}><ResultValueCell result={result} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-note">
        Mean ± s.d. where reported. Metric arrows indicate direction. Source: {table.source.replace("contents/blocks/", "")}.
      </p>
    </div>
  );
}

export function FoundationResultsTable() {
  const [activeProtocol, setActiveProtocol] = useState("Probing");
  const rows = results.foundation.protocols[activeProtocol];

  return (
    <div className="interactive-results">
      <div className="results-panel-title">
        <div>
          <span>MoleculeNet transfer</span>
          <h3>Encoder comparison</h3>
        </div>
        <small>AUC ↑</small>
      </div>
      <div className="results-tabs protocol-tabs" role="group" aria-label="Foundation model evaluation protocol">
        {results.foundation.protocolOrder.map((protocol) => (
          <button
            key={protocol}
            type="button"
            aria-pressed={activeProtocol === protocol}
            onClick={() => setActiveProtocol(protocol)}
          >
            {protocol}
          </button>
        ))}
      </div>
      <div
        className="result-table-scroll"
        id="foundation-results-table"
        aria-live="polite"
      >
        <table>
          <caption>{activeProtocol} transfer performance</caption>
          <thead>
            <tr>
              <th scope="col">Method</th>
              {results.foundation.columns.map((column) => <th scope="col" key={column}>{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className={row.featured ? "featured-result-row" : ""} key={row.method}>
                <th scope="row">{row.method}</th>
                {row.values.map((result, index) => (
                  <td key={`${row.method}-${results.foundation.columns[index]}`}><ResultValueCell result={result} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-note">
        Mean ± s.d. over three runs with scaffold splits. Bold marks the best result in each task.
      </p>
    </div>
  );
}
