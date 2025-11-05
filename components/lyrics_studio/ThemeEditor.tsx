import React from 'react';
import { LyricsTheme } from '../../types';
import SectionLabel from '../SectionLabel';
import Tooltip from '../Tooltip';
import { Wand2, Loader2, Plus, Trash2 } from 'lucide-react';
import { LYRICS_THEME_CATEGORIES } from '../../data/lyricsStudioConstants';

interface Props {
    themes: LyricsTheme[];
    nuance: string;
    isSuggesting: boolean;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUpdate: <K extends keyof LyricsTheme>(index: number, key: K, value: LyricsTheme[K]) => void;
    onSuggest: () => void;
}

export const ThemeEditor: React.FC<Props> = ({ themes, nuance, isSuggesting, onAdd, onRemove, onUpdate, onSuggest }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <SectionLabel text="テーマ設定（任意）" tooltipText="楽曲が扱う中心的なテーマを構造化して設定します。より詳細な指示を与えたい場合に便利です。空欄でも問題ありません。" />
                <Tooltip text="入力された「楽曲のニュアンス」をAIが分析し、最適なテーマを自動で提案・設定します。">
                    <button onClick={onSuggest} disabled={isSuggesting || !nuance} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all">
                        {isSuggesting ? <Loader2 className="animate-spin h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
                        {isSuggesting ? '提案中...' : 'AIにテーマ提案'}
                    </button>
                </Tooltip>
            </div>
            {themes.map((theme, i) => (
                <div key={i} className="bg-gray-900/50 p-3 rounded-md border border-gray-700 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">テーマ {i + 1}</span>
                        <button onClick={() => onRemove(i)} className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <SectionLabel text="大テーマ" />
                            <select value={theme.category} onChange={e => onUpdate(i, 'category', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-sm">
                                <option value="">大テーマを選択...</option>
                                {Object.keys(LYRICS_THEME_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <SectionLabel text="中テーマ" />
                            <select value={theme.subcategory} onChange={e => onUpdate(i, 'subcategory', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-sm" disabled={!theme.category}>
                                <option value="">中テーマを選択...</option>
                                {(LYRICS_THEME_CATEGORIES[theme.category] || []).map(subcat => <option key={subcat} value={subcat}>{subcat}</option>)}
                            </select>
                        </div>
                    </div>
                    <SectionLabel text="サブテーマ（カンマ区切り）" />
                    <input type="text" value={theme.subthemes.join(', ')} onChange={e => onUpdate(i, 'subthemes', e.target.value.split(',').map(s => s.trim()))} placeholder="例：初恋, 運命の出会い" className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-sm" />
                    <SectionLabel text={`重要度: ${theme.weight.toFixed(1)}`} />
                    <input type="range" min="0.1" max="2.0" step="0.1" value={theme.weight} onChange={e => onUpdate(i, 'weight', parseFloat(e.target.value))} className="w-full accent-blue-500" />
                </div>
            ))}
            <button onClick={onAdd} className="w-full text-sm bg-gray-700 hover:bg-gray-600 text-blue-300 px-3 py-2 rounded-md flex items-center justify-center gap-2 transition-colors">
                <Plus className="h-4 w-4" /> 新しいテーマを追加
            </button>
        </div>
    );
};