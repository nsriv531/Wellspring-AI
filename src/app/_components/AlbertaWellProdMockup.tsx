'use client';

import React, { useMemo, useState } from 'react';

// ---------- Types ----------
type TabId = 'overview' | 'wells' | 'predict' | 'pipelines';
type DatePreset = '12m' | '24m' | '60m';

type PredictForm = {
  primary_formation: string;
  md_m: number;
  tvd_m: number;
  surface_lat: number;
  surface_lon: number;
  operator: string;
  spud_month: number;
  proppant_tonnes: number;
  horizontal_flag: boolean;
  field: string;
};

type PredictResult = { p50: number; p10: number; p90: number; mae: number };

// ---------- Component ----------
export default function AlbertaWellProdMockup() {
  const [tab, setTab] = useState<TabId>('overview');
  const [company, setCompany] = useState('All Operators');
  const [datePreset, setDatePreset] = useState<DatePreset>('12m');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Header company={company} setCompany={setCompany} datePreset={datePreset} setDatePreset={setDatePreset} />

      <main className="mx-auto max-w-7xl px-4 pb-16">
        <Tabs tab={tab} setTab={setTab} />

        {tab === 'overview' && <Overview company={company} datePreset={datePreset} />}
        {tab === 'wells' && <Wells company={company} />}
        {tab === 'predict' && <Predict company={company} />}
        {tab === 'pipelines' && <PipelinesStub />}
      </main>

      <footer className="border-t bg-white/60 backdrop-blur mt-8">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-slate-500">
          AER public data powers maps & charts.
        </div>
      </footer>
    </div>
  );
}

// ---------- Header ----------
function Header({
  company,
  setCompany,
  datePreset,
  setDatePreset,
}: {
  company: string;
  setCompany: (v: string) => void;
  datePreset: DatePreset;
  setDatePreset: (v: DatePreset) => void;
}) {
  return (
    <div className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold">AW</span>
          <div>
            <h1 className="text-lg font-semibold leading-5">Alberta Well Production</h1>
            <p className="text-xs text-slate-500 -mt-0.5">Predictor & Analytics</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <select
            className="rounded-xl border px-3 py-2 text-sm shadow-sm"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            <option>All Operators</option>
            <option>Cenovus Energy</option>
            <option>Canadian Natural Resources (CNRL)</option>
            <option>Suncor Energy</option>
            <option>Imperial Oil</option>
          </select>
          <div className="flex rounded-xl border shadow-sm overflow-hidden">
            {(['12m', '24m', '60m'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setDatePreset(p)}
                className={
                  'px-3 py-2 text-sm ' +
                  (datePreset === p ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50')
                }
                title={{ '12m': 'Last 12 months', '24m': 'Last 24 months', '60m': 'Last 60 months' }[p]}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Tabs ----------
function Tabs({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  const items: ReadonlyArray<{ id: TabId; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'wells', label: 'Wells' },
    { id: 'predict', label: 'Predict' },
    { id: 'pipelines', label: 'Pipelines (beta)' },
  ];

  return (
    <div className="mt-6 mb-4">
      <div className="flex gap-2 rounded-2xl border bg-white p-1 shadow-sm">
        {items.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={
              'rounded-xl px-4 py-2 text-sm transition ' +
              (tab === t.id ? 'bg-slate-900 text-white shadow' : 'hover:bg-slate-50')
            }
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Overview ----------
function Overview({ company, datePreset }: { company: string; datePreset: string }) {
  const kpis = useMemo(
    () => [
      { label: 'Total Wells', value: company === 'All Operators' ? '186,240' : '2,473' },
      { label: 'Avg 12-mo Oil / well (bbl)', value: company === 'Suncor Energy' ? '158,200' : '132,450' },
      { label: 'Flaring Intensity (m³/bbl)', value: company.includes('CNRL') ? '0.042' : '0.037' },
      { label: 'Model MAE (bbl, cv)', value: '± 9,850' },
    ],
    [company]
  );

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{k.label}</p>
            <p className="mt-1 text-2xl font-semibold">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold">Production Map (Oil per Well)</h3>
            <Legend />
          </div>
          <MapPlaceholder />
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold">Provincial Production Trend ({datePreset.toUpperCase()})</h3>
          <Sparkline />
          <div className="mt-4 h-px bg-slate-100" />
          <h3 className="mt-4 text-sm font-semibold">Flaring Intensity by Operator</h3>
          <Bars />
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-2">Recent Activity (sample)</h3>
        <ActivityList company={company} />
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { c: 'bg-emerald-200', t: 'Low' },
    { c: 'bg-emerald-400', t: 'Med' },
    { c: 'bg-emerald-600', t: 'High' },
  ];
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      {items.map((i) => (
        <div key={i.t} className="flex items-center gap-1">
          <span className={`h-2 w-5 rounded ${i.c}`} />
          <span>{i.t}</span>
        </div>
      ))}
    </div>
  );
}

function MapPlaceholder() {
  return (
    <div className="mt-3 h-72 w-full rounded-xl bg-gradient-to-br from-emerald-50 via-emerald-100 to-slate-50 border flex items-center justify-center">
      <div className="text-slate-500 text-sm">Map placeholder (swap in MapLibre / Leaflet with hex bins)</div>
    </div>
  );
}

function Sparkline() {
  return (
    <svg viewBox="0 0 400 120" className="mt-3 w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d="M0 80 L40 70 L80 74 L120 65 L160 60 L200 58 L240 50 L280 54 L320 45 L360 40 L400 42" stroke="#10b981" strokeWidth="3" fill="none" />
      <path d="M0 120 L0 80 L40 70 L80 74 L120 65 L160 60 L200 58 L240 50 L280 54 L320 45 L360 40 L400 42 L400 120 Z" fill="url(#g)" />
    </svg>
  );
}

function Bars() {
  const data = [
    { name: 'Cenovus', v: 0.035 },
    { name: 'CNRL', v: 0.042 },
    { name: 'Suncor', v: 0.031 },
    { name: 'Imperial', v: 0.038 },
  ];
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div className="mt-3 grid gap-2">
      {data.map((d) => (
        <div key={d.name} className="grid grid-cols-5 items-center gap-3">
          <div className="col-span-1 text-xs text-slate-600">{d.name}</div>
          <div className="col-span-3 h-2 rounded bg-slate-100">
            <div className="h-2 rounded bg-emerald-500" style={{ width: `${(d.v / max) * 100}%` }} />
          </div>
          <div className="col-span-1 text-right text-xs tabular-nums">{d.v.toFixed(3)}</div>
        </div>
      ))}
    </div>
  );
}

function ActivityList({ company }: { company: string }) {
  const items = [
    { title: 'New horizontal well spud', sub: 'Kaybob South / Montney', when: '6d ago' },
    { title: 'Battery upgrade completed', sub: 'Peace River area', when: '9d ago' },
    { title: 'Top quartile 12-mo oil cohort identified', sub: 'Cardium trend', when: '14d ago' },
  ];
  return (
    <div className="grid gap-2">
      {items.map((i, idx) => (
        <div key={idx} className="flex items-center justify-between rounded-xl border p-3 hover:bg-slate-50">
          <div>
            <p className="text-sm font-medium">
              {i.title}
              {company !== 'All Operators' ? ` — ${company}` : ''}
            </p>
            <p className="text-xs text-slate-500">{i.sub}</p>
          </div>
          <span className="text-xs text-slate-400">{i.when}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Wells ----------
function Wells({ company }: { company: string }) {
  const rows = [
    { uwi: '100/13-24-050-10W4/00', operator: 'Cenovus Energy', formation: 'Cardium', spud: '2024-05-12', oil12: 146200, flareInt: 0.034 },
    { uwi: '102/07-15-062-05W5/00', operator: 'CNRL', formation: 'Montney', spud: '2023-11-02', oil12: 132880, flareInt: 0.041 },
    { uwi: '100/03-06-083-16W4/00', operator: 'Imperial Oil', formation: 'McMurray', spud: '2024-02-20', oil12: 172450, flareInt: 0.028 },
    { uwi: '100/12-29-048-26W4/00', operator: 'Suncor Energy', formation: 'Duvernay', spud: '2023-08-30', oil12: 158210, flareInt: 0.030 },
  ].filter((r) => company === 'All Operators' || r.operator === company);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Wells ({rows.length})</h3>
        <input placeholder="Search UWI / formation" className="rounded-xl border px-3 py-2 text-sm shadow-sm" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2">UWI</th>
              <th>Operator</th>
              <th>Formation</th>
              <th>Spud</th>
              <th className="text-right">12-mo Oil (bbl)</th>
              <th className="text-right">Flaring Intensity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                <td className="py-2 font-mono text-[12px]">{r.uwi}</td>
                <td>{r.operator}</td>
                <td>{r.formation}</td>
                <td>{r.spud}</td>
                <td className="text-right tabular-nums">{r.oil12.toLocaleString()}</td>
                <td className="text-right tabular-nums">{r.flareInt.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Predict ----------
function Predict({ company }: { company: string }) {
  const [form, setForm] = useState<PredictForm>({
    primary_formation: 'Cardium',
    md_m: 3200,
    tvd_m: 2200,
    surface_lat: 51.05,
    surface_lon: -114.07,
    operator: company === 'All Operators' ? 'Cenovus Energy' : company,
    spud_month: 6,
    proppant_tonnes: 500,
    horizontal_flag: true,
    field: 'Kaybob',
  });
  const [result, setResult] = useState<PredictResult | null>(null);

  function update<K extends keyof PredictForm>(key: K, value: PredictForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Mock: simple deterministic calc so the UI feels real.
    const lateral = Math.max((form.md_m ?? 0) - (form.tvd_m ?? 0), 0);
    const base = 90000 + lateral * 12 + (form.proppant_tonnes ?? 0) * 45;
    const opAdj = form.operator.includes('CNRL') ? 0.95 : form.operator.includes('Suncor') ? 1.05 : 1.0;
    const formationAdj: Record<string, number> = { Cardium: 1.0, Montney: 1.08, Duvernay: 1.12, McMurray: 1.15 };
    const fAdj = formationAdj[form.primary_formation] ?? 1.0;
    const p50 = Math.round(base * opAdj * fAdj);
    const mae = 9850;
    const p10 = Math.max(Math.round(p50 - 1.28 * mae), 0);
    const p90 = Math.round(p50 + 1.28 * mae);
    setResult({ p50, p10, p90, mae });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold">What-if Prediction</h3>
        <form onSubmit={onSubmit} className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select label="Operator" value={form.operator} onChange={(v) => update('operator', v)} options={[
            'Cenovus Energy', 'Canadian Natural Resources (CNRL)', 'Suncor Energy', 'Imperial Oil', 'Tourmaline Oil', 'Vermilion Energy',
          ]} />
          <Select label="Primary Formation" value={form.primary_formation} onChange={(v) => update('primary_formation', v)} options={[
            'Cardium', 'Montney', 'Duvernay', 'McMurray',
          ]} />
          <Input label="Measured Depth (m)" type="number" value={form.md_m} onChange={(v) => update('md_m', Number(v))} />
          <Input label="True Vertical Depth (m)" type="number" value={form.tvd_m} onChange={(v) => update('tvd_m', Number(v))} />
          <Input label="Surface Lat" type="number" value={form.surface_lat} onChange={(v) => update('surface_lat', Number(v))} />
          <Input label="Surface Lon" type="number" value={form.surface_lon} onChange={(v) => update('surface_lon', Number(v))} />
          <Input label="Proppant (tonnes)" type="number" value={form.proppant_tonnes} onChange={(v) => update('proppant_tonnes', Number(v))} />
          <Select label="Spud Month" value={String(form.spud_month)} onChange={(v) => update('spud_month', Number(v))} options={[
            '1','2','3','4','5','6','7','8','9','10','11','12',
          ]} />
          <Input label="Field (optional)" value={form.field} onChange={(v) => update('field', v)} />
          <div className="col-span-full mt-1 flex items-center gap-2">
            <input id="horiz" type="checkbox" checked={form.horizontal_flag} onChange={(e) => update('horizontal_flag', e.target.checked)} />
            <label htmlFor="horiz" className="text-sm">Horizontal well</label>
          </div>
          <div className="col-span-full flex gap-2">
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-white shadow hover:brightness-95" type="submit">Predict</button>
            <button className="rounded-xl border px-4 py-2 hover:bg-slate-50" type="button" onClick={() => setResult(null)}>Reset</button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold">Result</h3>
        {!result ? (
          <div className="mt-3 text-sm text-slate-500">Fill the form and click Predict to see P10/P50/P90 and a distribution preview.</div>
        ) : (
          <div className="mt-3 grid gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">12-mo Oil (bbl)</p>
              <p className="text-2xl font-semibold">{result.p50.toLocaleString()}</p>
              <p className="text-xs text-slate-500">P10–P90: {result.p10.toLocaleString()} – {result.p90.toLocaleString()}</p>
            </div>
            <Dist p50={result.p50} p10={result.p10} p90={result.p90} />
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-900">
              <p className="text-xs">Model (cv) MAE</p>
              <p className="text-lg font-semibold">± {result.mae.toLocaleString()} bbl</p>
              <p className="text-xs opacity-80">Baseline Ridge; replace with GBM + quantile/conformal for calibrated bands.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Dist ----------
function Dist({ p50, p10, p90 }: { p50: number; p10: number; p90: number }) {
  const min = Math.max(0, p10 - (p90 - p50));
  const max = p90 + (p50 - p10);
  const scale = (v: number) => ((v - min) / (max - min)) * 360 + 20;
  return (
    <svg viewBox="0 0 400 120" className="w-full">
      <rect x={20} y={40} width={360} height={40} rx={8} className="fill-slate-100" />
      <rect x={scale(p10)} y={40} width={scale(p90) - scale(p10)} height={40} rx={8} className="fill-emerald-200" />
      <rect x={scale(p50) - 2} y={35} width={4} height={50} className="fill-emerald-700" />
      <text x={scale(p10)} y={30} className="fill-slate-500 text-[10px]">P10</text>
      <text x={scale(p50)} y={30} className="fill-slate-500 text-[10px]">P50</text>
      <text x={scale(p90)} y={30} className="fill-slate-500 text-[10px]">P90</text>
    </svg>
  );
}

// ---------- Pipelines stub ----------
function PipelinesStub() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm text-sm text-slate-600">
      <p className="font-medium mb-2">Pipeline Throughput Forecast (beta)</p>
      <p>
        Midstream view stub: select a line (e.g., Mainline, Keystone), a key point, and a horizon to forecast monthly throughput using CER datasets.
        This page would reuse the card layout, add a line chart with forecast bands, and a map of key points.
      </p>
    </div>
  );
}

// ---------- Small inputs ----------
function Input({
  label,
  type = 'text',
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid text-sm">
      <span className="mb-1 text-slate-600">{label}</span>
      <input
        className="rounded-xl border px-3 py-2 shadow-sm"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="grid text-sm">
      <span className="mb-1 text-slate-600">{label}</span>
      <select className="rounded-xl border px-3 py-2 shadow-sm" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
