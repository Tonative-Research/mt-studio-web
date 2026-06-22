import { Download, Cloud } from 'lucide-react';

const mockData = [
  { id: '#001', original: 'Welcome to the digital marketplace.', translated: 'Kaabo si oja oni-nọmba.' },
  { id: '#002', original: 'Please ensure your identity is verified before proceeding.', translated: 'Jọwọ rii daju pe ẹni-jẹ rẹ ti jẹrisi ṣaaju ki o to tẹsiwaju.' },
  { id: '#003', original: 'The infrastructure supports multiple languages seamlessly.', translated: 'Awọn amayederun n ṣe atilẹyin awọn ede pupọ laisi wahala.' },
];

export default function PreviewTable() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-6 lg:px-8 py-5 flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <Cloud className="text-gray-400" size={20} />
          <h3 className="font-bold text-lg tracking-tight text-gray-900">Output Preview</h3>
        </div>
        <button className="btn-accent text-xs font-black uppercase tracking-[0.15em] px-5 py-2.5 shadow-lg shadow-accent-500/20">
          <Download size={14} />
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary-500 text-white">
              <th className="px-6 lg:px-8 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10 w-20">
                Row
              </th>
              <th className="px-6 lg:px-8 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10">
                Original Text
              </th>
              <th className="px-6 lg:px-8 py-4 text-[10px] font-black uppercase tracking-widest">
                Translated Text
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 lg:px-8 py-5 font-mono text-[11px] text-gray-400 border-r border-gray-100 tracking-tighter">
                  {row.id}
                </td>
                <td className="px-6 lg:px-8 py-5 text-sm font-medium leading-relaxed text-gray-700 border-r border-gray-100">
                  {row.original}
                </td>
                <td className="px-6 lg:px-8 py-5 text-sm italic font-medium leading-relaxed text-primary-600">
                  {row.translated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="w-full py-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-primary-500 hover:bg-gray-100 transition-colors border-t border-gray-100">
        View all rows
      </button>
    </div>
  );
}
