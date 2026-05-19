import { Download, Cloud } from 'lucide-react';

const mockData = [
  { id: '#001', english: 'Welcome to the digital marketplace.', swahili: 'Karibu kwenye soko la kidijitali.' },
  { id: '#002', english: 'Please ensure your identity is verified before proceeding.', swahili: 'Tafadhali hakikisha kitambulisho chako kimeidhinishwa kabla ya kuendelea.' },
  { id: '#003', english: 'The infrastructure supports multiple languages seamlessly.', swahili: 'Miundombinu hii inasaidia lugha nyingi bila mshono.' },
];

export default function PreviewTable() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-8 py-6 flex items-center justify-between border-b border-outline/5 bg-white">
        <div className="flex items-center gap-3">
          <Cloud className="text-on-surface-variant" size={24} />
          <h3 className="font-bold text-xl tracking-tight">Output Preview</h3>
        </div>
        <button className="bg-secondary text-white text-xs font-black uppercase tracking-[0.15em] px-6 py-3 rounded flex items-center gap-2 hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/10">
          <Download size={14} />
          Download Final CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10 w-24">Row ID</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Original Text (English)</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Translated Text (Swahili)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/5">
            {mockData.map((row, i) => (
              <tr key={i} className="group hover:bg-surface transition-colors">
                <td className="px-8 py-6 font-mono text-[11px] text-on-surface-variant border-r border-outline/5 tracking-tighter">
                  {row.id}
                </td>
                <td className="px-8 py-6 text-sm font-medium leading-relaxed max-w-md border-r border-outline/5">
                  {row.english}
                </td>
                <td className="px-8 py-6 text-sm italic font-medium leading-relaxed max-w-md text-primary">
                  {row.swahili}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="w-full py-4 bg-surface text-[10px] font-black uppercase tracking-widest text-primary hover:bg-surface-container transition-colors border-t border-outline/5">
        View all 1,200 rows
      </button>
    </div>
  );
}
