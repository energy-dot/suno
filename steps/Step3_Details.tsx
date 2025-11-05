
import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, Loader2, Info } from 'lucide-react';
import { AppData } from '../types';
import { META_DATA, DESCRIPTIONS, VOCAL_STYLE_DESCRIPTIONS, VOCAL_GENDER_DESCRIPTIONS } from '../constants';
import { generateChords, shortenDataForPrompt } from '../services/geminiService';
// FIX: Replaced non-existent 'generateFinalPrompt' with 'generateLyricsPrompt'.
// FIX: Import generateStylePrompt to provide it to shortenDataForPrompt.
import { generateLyricsPrompt, generateStylePrompt } from '../services/promptGenerator';
import SectionLabel from '../components/SectionLabel';
import TagSelector from '../components/TagSelector';
import Tooltip from '../components/Tooltip';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  setFeedback: (feedback: string | null) => void;
}

const Step3_Details: React.FC<Props> = ({ data, setData, setFeedback }) => {
    const [isGeneratingChords, setIsGeneratingChords] = useState(false);

    const updateSection = (id: number, field: string, value: any) => {
        setData({...data, sections: data.sections.map(s => s.id === id ? { ...s, [field]: value } : s)});
    };
    const updateVocal = (id: number, type: string, value: any) => {
        setData({...data, sections: data.sections.map(s => {
            if (s.id === id) return { ...s, vocals: { ...s.vocals, [type]: value } };
            return s;
        })});
    };
    const updateInstrumentDetail = (id: number, instrument: string, detail: string) => {
        setData({...data, sections: data.sections.map(s => {
            if (s.id === id) return { ...s, instrumentDetails: { ...s.instrumentDetails, [instrument]: detail } };
            return s;
        })});
    };
    const applyChordProgression = (sectionId: number, progression: string) => {
        const progressionChords = progression.split(',');
        const targetSection = data.sections.find(s => s.id === sectionId);
        if (!targetSection || !targetSection.lyrics) return;

        const lines = targetSection.lyrics.replace(/\[.*?\]/g, '').split('\n').filter(line => line.trim() !== '');
        const newLyrics = lines.map((line, index) => {
            const chord = progressionChords[index % progressionChords.length];
            return `[${chord}]${line}`;
        }).join('\n');

        updateSection(sectionId, 'lyrics', newLyrics);
    };

    const handleGlobalAiChordGeneration = async () => {
      setIsGeneratingChords(true);
      setFeedback(null);
      try {
          // Step 1: Generate chords
          const { updatedSections, feedback: chordsFeedback } = await generateChords(data);
          
          // Step 2: Generate temporary prompt and check length
          const tempData = { ...data, sections: updatedSections };
          // FIX: Replaced non-existent 'generateFinalPrompt' with 'generateLyricsPrompt'.
          let tempPrompt = generateLyricsPrompt(tempData);
    
          let finalSections = updatedSections;
          let finalFeedback = `${chordsFeedback}`;
    
          // Step 3: If too long, call shortening service
          if (tempPrompt.length > 5000) {
              setFeedback('プロンプトが5000文字を超えました。音楽性を維持しながら短縮処理を実行します...');
              // FIX: Generate stylePrompt and pass it to shortenDataForPrompt, which expects it as the second argument.
              const stylePrompt = await generateStylePrompt(tempData);
              finalSections = await shortenDataForPrompt(tempData, stylePrompt);
              
              // Final check after shortening
              // FIX: Replaced non-existent 'generateFinalPrompt' with 'generateLyricsPrompt'.
              const finalPrompt = generateLyricsPrompt({ ...data, sections: finalSections });
              if (finalPrompt.length > 5000) {
                  finalFeedback += `\n\n**警告:** AIによる自動短縮後もプロンプトは${finalPrompt.length}文字です。Suno AIでエラーになる可能性があります。手動での調整を推奨します。`;
              } else {
                  finalFeedback += `\n\n**情報:** プロンプトを${tempPrompt.length}文字から${finalPrompt.length}文字に自動短縮しました。`;
              }
          }
    
          // Step 4: Update state
          setData({...data, sections: finalSections, songExplanation: finalFeedback });
          setFeedback("AIによるコード進行と音楽理論解説を生成しました。ステップ4で詳細を確認できます。");
    
      } catch (error: any) {
          console.error("Global AI chord generation failed:", error);
          setFeedback(`エラーが発生しました：${error.message}\n\n手動でコード進行パターンを選択してください。`);
      } finally {
          setIsGeneratingChords(false);
      }
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2"><SlidersHorizontal className="text-blue-400"/>各セクションの詳細を設定</h3>
            <button onClick={handleGlobalAiChordGeneration} disabled={isGeneratingChords || data.sections.length === 0} className="w-full mb-4 text-sm bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-md flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isGeneratingChords ? <Loader2 className="animate-spin h-4 w-4"/> : <Sparkles className="h-4 w-4" />}
                AIで音楽理論に基づくコード進行を生成
            </button>
            <div className="space-y-4">
                {data.sections.map(section => (
                    <details key={section.id} className="bg-gray-800 p-4 rounded-lg group" open>
                        <summary className="font-semibold text-lg text-blue-400 cursor-pointer flex items-center gap-2 flex-wrap">
                          {section.type}
                          <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">{section.energy}</span>
                          <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full">{section.key || data.concept.key}</span>
                          {(section.timeSignature !== data.concept.timeSignature) && <span className="px-2 py-1 text-xs bg-teal-600 text-white rounded-full">{section.timeSignature}</span>}
                          {section.modulation && section.modulation !== 'Stay in Key' && <span className="px-2 py-1 text-xs bg-orange-600 text-white rounded-full">転調</span>}
                          {section.useMetaObject && <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">メタオブジェクト</span>}
                        </summary>
                        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <SectionLabel text="エネルギー" tooltipText={DESCRIPTIONS.energy} />
                                    <div className="flex flex-wrap gap-2">
                                        {META_DATA.energyLevels.map(level => (
                                            <button key={level} type="button" onClick={() => updateSection(section.id, 'energy', level)} className={`px-3 py-1 text-sm rounded-full transition-colors ${section.energy === level ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{level}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <SectionLabel text="転調・拍子・リズム設定" tooltipText="セクション別の転調タイプ、キー（転調先）、拍子（変拍子）、リズムパターンを指定できます。" />
                                    <div className="grid grid-cols-2 gap-2">
                                      <select value={section.modulation || 'Stay in Key'} onChange={e => updateSection(section.id, 'modulation', e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-xs rounded-lg p-2" title="転調タイプ">
                                        {META_DATA.modulations.map(m => <option key={m} value={m}>{m}</option>)}
                                      </select>
                                       <select value={section.key || data.concept.key} onChange={e => updateSection(section.id, 'key', e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-xs rounded-lg p-2" title="キー">
                                        {META_DATA.keys.map(k => <option key={k} value={k}>{k}</option>)}
                                      </select>
                                      <select value={section.timeSignature || data.concept.timeSignature} onChange={e => updateSection(section.id, 'timeSignature', e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-xs rounded-lg p-2 col-span-1" title="拍子">
                                        {META_DATA.timeSignatures.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                                      </select>
                                      <select value={section.rhythmPattern || data.concept.rhythmPattern} onChange={e => updateSection(section.id, 'rhythmPattern', e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-xs rounded-lg p-2 col-span-1" title="リズム">
                                        {META_DATA.rhythmPatterns.map(rp => <option key={rp} value={rp}>{rp}</option>)}
                                      </select>
                                    </div>
                                </div>
                                {section.lyrics && (
                                  <>
                                    <div>
                                        <SectionLabel text="コード進行パターン" tooltipText={DESCRIPTIONS.codeProgression} />
                                        <select onChange={(e) => applyChordProgression(section.id, e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5 w-full" value=""><option value="" disabled>パターンを選択...</option>{Object.entries(META_DATA.CODE_PROGRESSION_PATTERNS).map(([category, patterns]) => (<optgroup label={category} key={category}>{patterns.map(p => (<option key={p.name} value={p.progression.join(',')} title={p.description}>{p.name} ({p.progression.join(' - ')})</option>))}</optgroup>))}</select>
                                    </div>
                                    <div>
                                        <SectionLabel text="コードタイプから選択" />
                                        <div className="space-y-2">{Object.entries(META_DATA.CHORD_TYPES).map(([category, chords]) => (<details key={category} className="bg-gray-900/50 p-2 rounded-md"><summary className="text-sm font-medium text-gray-400 cursor-pointer">{category}</summary><div className="mt-2 flex flex-wrap gap-1">{chords.map(chord => (<button key={chord} onClick={() => { updateSection(section.id, 'lyrics', section.lyrics + `[${chord}]`); }} className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-500 text-white rounded">{chord}</button>))}</div></details>))}</div>
                                    </div>
                                    <div>
                                        <SectionLabel text="歌詞とコード" tooltipText={DESCRIPTIONS.chords}>
                                            <Tooltip text={'ヒント：歌詞内で括弧 () を使うと、ささやき声やエコー、アドリブとして解釈されることがあります。例：「I miss you (miss you)」'}>
                                                <Info className="h-4 w-4 text-gray-500 cursor-help" />
                                            </Tooltip>
                                        </SectionLabel>
                                        <textarea
                                            value={section.lyrics}
                                            onChange={e => updateSection(section.id, 'lyrics', e.target.value)}
                                            rows={5}
                                            className="w-full bg-gray-900/50 p-3 rounded-md border border-gray-700 font-mono text-base leading-relaxed"
                                            placeholder="このセクションの歌詞..."
                                        />
                                    </div>
                                  </>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">高度な指示（自然言語）</label>
                                    <textarea value={section.advancedDescription} onChange={e => updateSection(section.id, 'advancedDescription', e.target.value)} rows={2} placeholder='例: emotional piano intro with soft pads | [Laugh in beat: "ha-ha-ha"]' className="w-full bg-gray-900/50 p-3 rounded-md border border-gray-700"></textarea>
                                </div>
                                <div>
                                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={section.useMetaObject} onChange={e => updateSection(section.id, 'useMetaObject', e.target.checked)} className="rounded" /> <span className="text-gray-400">メタオブジェクト形式 (JSON/XML風)</span><Tooltip text={DESCRIPTIONS.advancedStructure}><Info className="h-4 w-4 text-gray-500 cursor-help" /></Tooltip></label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <SectionLabel text="使用楽器" tooltipText={DESCRIPTIONS.instruments} />
                                    <TagSelector options={META_DATA.instruments} selected={section.instruments} onChange={val => updateSection(section.id, 'instruments', val)} />
                                </div>
                                <div className="space-y-3">
                                  {section.instruments.map(inst => (
                                    <div key={inst} className="bg-gray-900/50 p-3 rounded-md border border-gray-700">
                                      <h4 className="text-sm font-semibold text-white mb-2">{inst}</h4>
                                      <input 
                                        type="text" 
                                        placeholder="例: 80s glam metal lead | heavy distortion | wide stereo" 
                                        value={section.instrumentDetails[inst] || ''} 
                                        onChange={e => updateInstrumentDetail(section.id, inst, e.target.value)}
                                        className="w-full bg-gray-900/80 border border-gray-600 text-white text-xs rounded-lg p-2"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <div>
                                    <SectionLabel text="ボーカル" tooltipText={DESCRIPTIONS.vocals} />
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-400 mb-2">スタイル</h4>
                                            <TagSelector options={META_DATA.vocalStyles} selected={section.vocals.style} onChange={val => updateVocal(section.id, 'style', val)} descriptions={VOCAL_STYLE_DESCRIPTIONS} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-400 mb-2">性別/声質</h4>
                                            <TagSelector options={META_DATA.vocalGenders} selected={section.vocals.gender} onChange={val => updateVocal(section.id, 'gender', val)} descriptions={VOCAL_GENDER_DESCRIPTIONS} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-400 mb-2">エフェクト</h4>
                                            <TagSelector options={META_DATA.vocalEffects} selected={section.vocals.effect} onChange={val => updateVocal(section.id, 'effect', val)} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <SectionLabel text="サウンドエフェクト" tooltipText={DESCRIPTIONS.soundEffects} />
                                    <TagSelector options={META_DATA.soundEffects} selected={section.soundEffects} onChange={val => updateSection(section.id, 'soundEffects', val)} />
                                </div>
                            </div>
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default Step3_Details;
