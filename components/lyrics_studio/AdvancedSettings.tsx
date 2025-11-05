import React from 'react';
import { LyricsPromptStudioData, LyricsHook, LyricsEmotionArc } from '../../types';
import SectionLabel from '../SectionLabel';
import Tooltip from '../Tooltip';
import { Plus, Trash2 } from 'lucide-react';
import { HOOK_TYPES, HOOK_TYPE_DESCRIPTIONS } from '../../data/lyricsStudioConstants';

interface Props {
    data: LyricsPromptStudioData;
    onUpdate: <K extends keyof LyricsPromptStudioData>(key: K, value: LyricsPromptStudioData[K]) => void;
    onNestedUpdate: <K extends keyof LyricsPromptStudioData, NK extends keyof LyricsPromptStudioData[K]>(key: K, nestedKey: NK, value: LyricsPromptStudioData[K][NK]) => void;
    onAddHook: () => void;
    onRemoveHook: (index: number) => void;
    onUpdateHook: <K extends keyof LyricsHook>(index: number, key: K, value: LyricsHook[K]) => void;
}

const emotionArcLabels: Record<keyof LyricsEmotionArc, string> = {
    calm: "静かな始まり",
    build: "盛り上がり",
    burst: "感情のピーク",
    reflect: "余韻・考察"
};

export const AdvancedSettings: React.FC<Props> = ({ data, onUpdate, onNestedUpdate, onAddHook, onRemoveHook, onUpdateHook }) => {
    return (
        <details className="bg-gray-900/50 p-4 rounded-lg border border-gray-700" open>
            <summary className="text-lg font-semibold text-blue-300 cursor-pointer list-none -m-4 p-4">詳細設定（任意）</summary>
            <div className="pt-4 mt-4 border-t border-gray-700 space-y-4">
                <div>
                    <SectionLabel text="フック" tooltipText="楽曲の中でリスナーの記憶に残りやすい、印象的な部分を設計します。" />
                    {data.hooks.map((hook, i) => (
                        <div key={i} className="bg-gray-800/50 p-3 rounded-md border border-gray-600 space-y-2 mb-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold">フック {i + 1}</span>
                                <button onClick={() => onRemoveHook(i)} className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <SectionLabel text="フックタイプ" tooltipText={HOOK_TYPE_DESCRIPTIONS[hook.type]} />
                                    <select value={hook.type} onChange={e => onUpdateHook(i, 'type', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-sm">
                                        {HOOK_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <SectionLabel text={`優先度: ${hook.priority}`} tooltipText="このフックが楽曲でどれだけ重要かを示します。" />
                                    <input type="range" min="1" max="10" step="1" value={hook.priority} onChange={e => onUpdateHook(i, 'priority', parseInt(e.target.value))} className="w-full accent-blue-500" />
                                </div>
                            </div>
                            <div>
                                <SectionLabel text="内容" tooltipText="フックの具体的な内容やキーワードを記述します。（例：'君のいない世界'というフレーズを繰り返す）" />
                                <input type="text" value={hook.label} onChange={e => onUpdateHook(i, 'label', e.target.value)} placeholder="例：キャッチーなシンセリフ" className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-sm" />
                            </div>
                        </div>
                    ))}
                    <button onClick={onAddHook} className="w-full text-sm bg-gray-700 hover:bg-gray-600 text-blue-300 px-3 py-2 rounded-md flex items-center justify-center gap-2 transition-colors">
                        <Plus className="h-4 w-4" /> 新しいフックを追加
                    </button>
                </div>
                <SectionLabel text="感情の起伏" tooltipText="楽曲全体の感情の盛り上がりを設計します。静かな始まりから感情のピークを迎え、最後は落ち着いて終わる、といった物語の感情曲線をAIに指示します。" />
                {(Object.keys(data.emotion_arc) as (keyof LyricsEmotionArc)[]).map(key => (
                    <div key={key} className="text-sm">
                        <label className="capitalize text-gray-400">{emotionArcLabels[key]}: {data.emotion_arc[key]}%</label>
                        <input type="range" min="0" max="100" value={data.emotion_arc[key]} onChange={e => onNestedUpdate('emotion_arc', key, parseInt(e.target.value))} className="w-full accent-blue-500" />
                    </div>
                ))}
                <SectionLabel text="楽曲構成（カンマ区切り）" tooltipText="楽曲のセクション構成を時系列で指定します。（例: Verse 1, Chorus, Verse 2...）" />
                <input type="text" value={data.sections.join(', ')} onChange={e => onUpdate('sections', e.target.value.split(',').map(s => s.trim()))} placeholder="ヴァース, コーラス, ブリッジ..." className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2" />
            
                <div>
                    <SectionLabel text="音節の密度" tooltipText="歌詞1行あたりの音節（文字数）の密度を調整します。「高い」にすると、より多くの言葉が詰め込まれたラップのようなスタイルになります。" />
                    <select value={data.syllable_density} onChange={e => onUpdate('syllable_density', e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 mt-1">
                        <option value="low">低い</option>
                        <option value="medium">普通</option>
                        <option value="high">高い</option>
                    </select>
                </div>

                <div>
                    <SectionLabel text="音韻スタイル（押韻の設計）" tooltipText="歌詞にどのような韻（ライム）を取り入れるかを指定します。複数のテクニックを組み合わせることで、より複雑で音楽的な歌詞を生成できます。" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300 p-3 bg-gray-900/50 rounded-md border border-gray-700">
                        <Tooltip text="行の終わりで音を揃える基本的な韻。安定感とまとまりを生みます。（例：せかい / みたい）">
                            <label className="flex items-center gap-2 cursor-help"><input type="checkbox" checked={data.rhyme.end} onChange={e => onNestedUpdate('rhyme', 'end', e.target.checked)} className="rounded" /> 脚韻（きゃくいん）</label>
                        </Tooltip>
                        <Tooltip text="行の途中で韻を踏むことで、内部的なリズムと複雑さを生みます。（例：真夜中の確かな光）">
                            <label className="flex items-center gap-2 cursor-help"><input type="checkbox" checked={data.rhyme.internal} onChange={e => onNestedUpdate('rhyme', 'internal', e.target.checked)} className="rounded" /> 内部韻（ないぶいん）</label>
                        </Tooltip>
                        <Tooltip text="単語の最初の音を揃える技法。リズミカルで記憶に残りやすい効果があります。（例：かがやく きみの こえ）">
                            <label className="flex items-center gap-2 cursor-help"><input type="checkbox" checked={data.rhyme.alliteration} onChange={e => onNestedUpdate('rhyme', 'alliteration', e.target.checked)} className="rounded" /> 頭韻（とういん）</label>
                        </Tooltip>
                        <Tooltip text="子音は違っても母音を揃える、より繊細で自然な韻。音楽的な響きを生みます。（例：「あい」と「かぜ」（母音a-e））">
                            <label className="flex items-center gap-2 cursor-help"><input type="checkbox" checked={data.rhyme.assonance} onChange={e => onNestedUpdate('rhyme', 'assonance', e.target.checked)} className="rounded" /> 母音韻（ぼいんいん）</label>
                        </Tooltip>
                        <Tooltip text="2つ以上の音節で韻を踏む高度なテクニック。ラップなどで多用され、強いグルーヴを生みます。（例：かんぜんむけつ / だんぜんうえてる）">
                            <label className="flex items-center gap-2 cursor-help"><input type="checkbox" checked={data.rhyme.multisyllabic} onChange={e => onNestedUpdate('rhyme', 'multisyllabic', e.target.checked)} className="rounded" /> 多音節韻（たおんせついん）</label>
                        </Tooltip>
                    </div>
                </div>

                <SectionLabel text="制約事項" tooltipText="AIが歌詞を生成する上での禁止事項やルールを設定します。" />
                <div className="space-y-2 text-sm text-gray-300">
                     <label className="flex items-center gap-2"><input type="checkbox" checked={data.constraints.avoid_cliches} onChange={e => onNestedUpdate('constraints', 'avoid_cliches', e.target.checked)} className="rounded" /> 陳腐な表現を避ける</label>
                     <input type="text" value={data.constraints.ban_words} onChange={e => onNestedUpdate('constraints', 'ban_words', e.target.value)} placeholder="禁止単語（カンマ区切り）" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2" />
                </div>
            </div>
        </details>
    );
};