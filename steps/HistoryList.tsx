
import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { Trash2, Edit, Save, X, FileCode2, Files } from 'lucide-react';

interface HistoryListProps {
    history: HistoryItem[];
    onView: (id: string) => void;
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onView, onDelete, onRename }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleRenameStart = (item: HistoryItem) => {
        setEditingId(item.id);
        setEditingName(item.name);
    };

    const handleRenameSave = (id: string) => {
        if (editingName.trim()) {
            onRename(id, editingName.trim());
        }
        setEditingId(null);
        setEditingName('');
    };

    const handleRenameCancel = () => {
        setEditingId(null);
        setEditingName('');
    };
    
    if (history.length === 0) {
        return (
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 text-center">
                <h2 className="text-2xl font-bold text-green-300 mb-2">生成履歴がありません</h2>
                <p className="text-gray-400">個別設定モードまたは一括生成モードでプロンプトを生成し、「履歴に保存」すると、ここに記録されます。</p>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-800/50 p-4 md:p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-green-300 mb-6">生成履歴</h2>
            <div className="space-y-3">
                {history.slice().sort((a,b) => b.timestamp - a.timestamp).map(item => (
                    <div key={item.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                        <div className="flex-grow">
                            {editingId === item.id ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRenameSave(item.id)}
                                        className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg p-2 flex-grow focus:ring-2 focus:ring-green-500"
                                        autoFocus
                                    />
                                    <button onClick={() => handleRenameSave(item.id)} className="p-2 text-green-400 hover:bg-green-900/50 rounded-md"><Save className="h-5 w-5"/></button>
                                    <button onClick={handleRenameCancel} className="p-2 text-gray-400 hover:bg-gray-700 rounded-md"><X className="h-5 w-5"/></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                   {item.mode === 'individual' 
                                     ? <FileCode2 className="h-5 w-5 text-blue-400 flex-shrink-0" /> 
                                     : <Files className="h-5 w-5 text-purple-400 flex-shrink-0" />
                                   }
                                    <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                                    <button onClick={() => handleRenameStart(item)} className="p-1 text-gray-400 hover:text-white"><Edit className="h-4 w-4"/></button>
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1 ml-8">
                                {new Date(item.timestamp).toLocaleString()} / {item.mode === 'individual' ? '個別設定' : '一括生成'} / {item.results.length}件の結果
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                            <button 
                                onClick={() => onView(item.id)} 
                                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors"
                            >
                                結果を表示
                            </button>
                            <button 
                                onClick={() => onDelete(item.id)} 
                                className="p-2 text-red-500 hover:bg-red-900/50 rounded-md transition-colors"
                                title="削除"
                            >
                                <Trash2 className="h-5 w-5"/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryList;
