import React from 'react';
import { LyricsPromptStudioData, LiteraryStyle, EmotionalAttitude, MusicalStyle } from '../../types';
import SectionLabel from '../SectionLabel';
import { LYRICS_TONE_OPTIONS, LYRICS_TONE_DESCRIPTIONS, TARGET_AUDIENCE_OPTIONS, TARGET_AUDIENCE_DESCRIPTIONS, GENRE_OPTIONS, GENRE_DESCRIPTIONS } from '../../data/lyricsStudioConstants';

interface Props {
    data: LyricsPromptStudioData;
    onUpdate: <K extends keyof LyricsPromptStudioData>(key: K, value: LyricsPromptStudioData[K]) => void;
    onNestedUpdate: <K extends keyof LyricsPromptStudioData, NK extends keyof LyricsPromptStudioData[K]>(key: K, nestedKey: NK, value: LyricsPromptStudioData[K][NK]) => void;
}

export const BasicConceptForm: React.FC<Props> = ({ data, onUpdate, onNestedUpdate }) => {
    return (
        <div className="space-y-4">
            <SectionLabel text="基本コンセプト" />
            <SectionLabel text="楽曲のニュアンス" tooltipText="楽曲全体のテーマ、雰囲気、物語などを自然な文章で記述します。他の項目が空でも、この内容だけで歌詞を生成できます。" />
            <textarea value={data.nuance} onChange={e => onUpdate('nuance', e.target.value)} rows={4} placeholder="例：初恋について、空を飛んでいるような気分の曲。ここだけでも歌詞は生成できます。" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2" />
            
            <SectionLabel text="ペルソナ設定" tooltipText="歌詞を歌う人物（語り手）の性格、背景、状況などを設定します。AIがその人物になりきって作詞します。" />
            <textarea value={data.persona} onChange={e => onUpdate('persona', e.target.value)} rows={3} placeholder="例：都会の喧騒に疲れ、故郷の星空を思い出す若者。口数は少ないが、心の中では情熱を秘めている。" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2" />

            <div>
                <SectionLabel text="音楽ジャンル" tooltipText="歌詞のスタイルやテーマに強い影響を与える音楽ジャンルを選択します。選択されたジャンルの特徴をAIが考慮します。" />
                <select 
                    value={data.genre} 
                    onChange={e => onUpdate('genre', e.target.value)} 
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
                >
                    {GENRE_OPTIONS.map(option => (
                        <option key={option} value={option === '指定なし' ? '' : option}>
                            {option}
                        </option>
                    ))}
                </select>
                {data.genre && GENRE_DESCRIPTIONS[data.genre] && (
                    <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-900/50 rounded-md border border-gray-600">
                        {GENRE_DESCRIPTIONS[data.genre]}
                    </p>
                )}
            </div>

            <div>
                <SectionLabel text="ターゲット層" tooltipText="歌詞が主に響く対象となる世代や層を設定します。AIはターゲットの価値観や文脈を考慮して作詞します。" />
                <select 
                    value={data.target} 
                    onChange={e => onUpdate('target', e.target.value)} 
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
                >
                    {TARGET_AUDIENCE_OPTIONS.map(group => (
                        <optgroup key={group.label} label={group.label}>
                            {group.options.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                {data.target && TARGET_AUDIENCE_DESCRIPTIONS[data.target] && (
                    <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-900/50 rounded-md border border-gray-600">
                        {TARGET_AUDIENCE_DESCRIPTIONS[data.target]}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <SectionLabel text="言語" tooltipText="生成される歌詞の主要な言語を選択します。" />
                    <select value={data.language} onChange={e => onUpdate('language', e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 mt-1">
                        <option value="ja">日本語</option>
                        <option value="en">英語</option>
                        <option value="ja_en">日本語 & 英語</option>
                    </select>
                </div>
                <div>
                    <SectionLabel text="歌詞の長さ" tooltipText="生成される歌詞のおおよその長さをAIに指示します。" />
                    <select value={data.length} onChange={e => onUpdate('length', e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 mt-1">
                        <option value="short">短め</option>
                        <option value="standard">標準</option>
                        <option value="long">長め</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
                <div>
                    <SectionLabel text="文体" tooltipText="歌詞全体の文学的なスタイルを決定します。" />
                    <select value={data.tone.literaryStyle} onChange={e => onNestedUpdate('tone', 'literaryStyle', e.target.value as LiteraryStyle)} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 mt-1">
                        {LYRICS_TONE_OPTIONS['文体 (Literary Style)'].map(option => (
                            <option key={option.value} value={option.value} title={LYRICS_TONE_DESCRIPTIONS[option.value]}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <SectionLabel text="感情の態度" tooltipText="歌詞で表現される感情的なスタンスや態度を決定します。" />
                    <select value={data.tone.emotionalAttitude} onChange={e => onNestedUpdate('tone', 'emotionalAttitude', e.target.value as EmotionalAttitude)} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 mt-1">
                        {LYRICS_TONE_OPTIONS['感情の態度 (Emotional Attitude)'].map(option => (
                            <option key={option.value} value={option.value} title={LYRICS_TONE_DESCRIPTIONS[option.value]}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <SectionLabel text="音楽的スタイル" tooltipText="歌詞の音楽的な表現スタイル（歌い方）を決定します。" />
                    <select value={data.tone.musicalStyle} onChange={e => onNestedUpdate('tone', 'musicalStyle', e.target.value as MusicalStyle)} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 mt-1">
                        {LYRICS_TONE_OPTIONS['音楽的スタイル (Musical Style)'].map(option => (
                            <option key={option.value} value={option.value} title={LYRICS_TONE_DESCRIPTIONS[option.value]}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <SectionLabel text="視点(POV)" tooltipText="歌詞が誰の視点から語られるかを設定します。「AIにおまかせ」を選ぶと、AIが文脈に最適な視点を判断します。" />
                    <select value={data.pov} onChange={e => onUpdate('pov', e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 mt-1">
                        <option value="">AIにおまかせ</option>
                        <option value="I">一人称 (私)</option>
                        <option value="You">二人称 (あなた)</option>
                        <option value="We">私たち</option>
                        <option value="I_vs_Me">私 vs 僕</option>
                        <option value="Third">三人称</option>
                    </select>
                </div>
                <div>
                    <SectionLabel text="時制" tooltipText="物語の時間を設定します。「AIにおまかせ」を選ぶと、AIが文脈に最適な時制を判断します。" />
                    <select value={data.tense} onChange={e => onUpdate('tense', e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 mt-1">
                        <option value="">AIにおまかせ</option>
                        <option value="present">現在</option>
                        <option value="past">過去</option>
                        <option value="flashback">回想</option>
                        <option value="mixed">混合</option>
                    </select>
                </div>
            </div>
        </div>
    );
};