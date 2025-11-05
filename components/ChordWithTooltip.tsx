
import React from 'react';
import Tooltip from './Tooltip';

interface ChordWithTooltipProps {
  chord: string;
}

const ChordWithTooltip: React.FC<ChordWithTooltipProps> = ({ chord }) => {
    const cleanChord = chord.replace(/[\[\]]/g, '');
    const getChordDescription = (c: string) => {
        if (c.includes('maj7')) return '洗練された、上品でおしゃれな響き';
        if (c.includes('m7')) return 'ジャジーで都会的な悲しさ';
        if (c.includes('7') && !c.includes('maj')) return '緊張感があり、解決を求める響き';
        if (c.includes('sus4')) return '浮遊感のある緊張、解決を期待させる';
        if (c.includes('sus2')) return '透明感と開放感のある響き';
        if (c.includes('add9')) return 'クリアで現代的な響き';
        if (c.includes('m')) return '憂鬱で感傷的な響き';
        if (c.includes('dim')) return '不安定で緊張感のある響き';
        if (c.includes('aug')) return '浮遊感と夢想的な響き';
        return '明るく安定した響き';
    };
    
    return (
        <Tooltip text={getChordDescription(cleanChord)}>
            <span className="text-yellow-300 font-bold cursor-pointer">{chord}</span>
        </Tooltip>
    );
};

export default ChordWithTooltip;
