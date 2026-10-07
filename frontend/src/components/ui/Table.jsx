import React from 'react';

/** columns: [{ key, header, render?(row), className? }] */
export default function Table({ columns = [], rows = [], caption, rowKey = 'id' }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white shadow-soft">
      <table className="w-full text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-sand-100 text-slate-600">
          <tr>{columns.map((c) => <th key={c.key} scope="col" className={`px-5 py-3 font-semibold ${c.className || ''}`}>{c.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r[rowKey]}>
              {columns.map((c, i) => {
                const cell = c.render ? c.render(r) : r[c.key];
                return i === 0
                  ? <th key={c.key} scope="row" className="px-5 py-3 font-semibold text-navy-900">{cell}</th>
                  : <td key={c.key} className={`px-5 py-3 text-slate-700 ${c.className || ''}`}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
