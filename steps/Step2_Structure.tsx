import React, { useState } from 'react';
import { Package, GripVertical, X } from 'lucide-react';
import { AppData, Section } from '../types';
import { META_DATA, DESCRIPTIONS } from '../constants';
import SectionLabel from '../components/SectionLabel';
import Tooltip from '../components/Tooltip';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const Step2_Structure: React.FC<Props> = ({ data, setData }) => {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [draggedItem, setDraggedItem] = useState<Section | null>(null);

  const handleSelectionChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelection({ start: target.selectionStart, end: target.selectionEnd });
  };

  const assignToSection = (type: string) => {
    const selectedText = data.rawLyrics.substring(selection.start, selection.end);
    if (!selectedText.trim()) return;
    const newSection: Section = { 
      id: Date.now(), 
      type, 
      lyrics: selectedText, 
      energy: 'Medium',
      modulation: 'Stay in Key',
      timeSignature: data.concept.timeSignature,
      rhythmPattern: data.concept.rhythmPattern,
      instruments: [], 
      instrumentDetails: {}, 
      vocals: { 
        style: data.concept.vocalStyles || [], 
        gender: data.concept.vocalGenders || [], 
        effect: [] 
      }, 
      soundEffects: [], 
      advancedDescription: '',
      useMetaObject: false
    };
    setData({...data, sections: [...data.sections, newSection]});
  };

  const addInstrumentalSection = (type: string) => {
    const newSection: Section = { 
      id: Date.now(), 
      type, 
      lyrics: '', 
      energy: 'Medium',
      modulation: 'Stay in Key',
      timeSignature: data.concept.timeSignature,
      rhythmPattern: data.concept.rhythmPattern,
      instruments: [], 
      instrumentDetails: {}, 
      vocals: { 
        style: data.concept.vocalStyles || [], 
        gender: data.concept.vocalGenders || [], 
        effect: [] 
      }, 
      soundEffects: [], 
      advancedDescription: '',
      useMetaObject: false
    };
    setData({...data, sections: [...data.sections, newSection]});
  };

  const removeSection = (id: number) => {
    setData({...data, sections: data.sections.filter(s => s.id !== id)});
  };
 
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => { 
    setDraggedItem(data.sections[index]); 
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (!draggedItem) return;
    const draggedOverItem = data.sections[index];
    if (draggedItem.id === draggedOverItem.id) return;
    let items = data.sections.filter(item => item.id !== draggedItem.id);
    items.splice(index, 0, draggedItem);
    setData({...data, sections: items});
  };
  const handleDragEnd = () => { setDraggedItem(null); };

  return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <h3 className="text-2xl font-semibold mb-4">1. 歌詞の範囲を選択</h3>
            <textarea readOnly value={data.rawLyrics} onSelect={handleSelectionChange} rows={20} className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg p-4 font-mono leading-relaxed cursor-text"/>
        </div>
        <div className="space-y-6">
            <div>
                <SectionLabel text="2. セクションとして割り当て" tooltipText={DESCRIPTIONS.structure} />
                <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                    <div>
                        <p className="text-sm text-gray-400 mb-2">歌詞を選択して、セクション化します。</p>
                        <div className="flex flex-wrap gap-2">
                            {META_DATA.structureTypes.map(type => (
                              <Tooltip key={type} text={`${type}: 楽曲の${type}部分を作成します`}>
                                <button onClick={() => assignToSection(type)} className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-md text-sm">{type}</button>
                              </Tooltip>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-2">または、歌詞のないインストゥルメンタルセクションを追加します。</p>
                        <div className="flex flex-wrap gap-2">
                            {['Intro', 'Guitar Solo', 'Piano Solo', 'Synth Solo', 'Break', 'Outro', 'Drop'].map(type => (
                              <Tooltip key={type} text={`${type}: インストゥルメンタルな${type}部分`}>
                                <button onClick={() => addInstrumentalSection(type)} className="bg-teal-800 hover:bg-teal-700 text-teal-100 px-3 py-1.5 rounded-md text-sm">{type}</button>
                              </Tooltip>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2"><Package className="text-blue-400"/>楽曲構造（ドラッグで順序変更）</h3>
                <div className="bg-gray-800 p-4 rounded-lg space-y-2 min-h-[200px]">
                    {data.sections.map((section, index) => (
                        <div key={section.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className="p-3 rounded-lg bg-gray-700 flex justify-between items-center cursor-move">
                            <div className="flex items-center gap-2">
                               <GripVertical className="h-5 w-5 text-gray-500" />
                               <div>
                                    <span className="font-bold text-white">{section.type}</span>
                                    <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">{section.energy}</span>
                                    {section.lyrics && <p className="text-xs text-gray-400 truncate w-64 mt-1">{section.lyrics}</p>}
                               </div>
                            </div>
                            <button onClick={() => removeSection(section.id)} className="p-1 text-red-500 hover:bg-red-900/50 rounded-md"><X className="h-4 w-4" /></button>
                        </div>
                    ))}
                    {data.sections.length === 0 && <p className="text-center text-gray-500 py-4">歌詞を選択してセクションを追加するか、AIで構造を提案してください。</p>}
                </div>
            </div>
        </div>
     </div>
  );
};

export default Step2_Structure;