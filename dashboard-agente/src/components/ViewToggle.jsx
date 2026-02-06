import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export function ViewToggle({ view, onViewChange }) {
    return (
        <div className="flex gap-2 p-1 rounded-full bg-white/5 border border-white/10">
            <button
                onClick={() => onViewChange('grid')}
                className={`
          p-2 rounded-full transition-all
          ${view === 'grid'
                        ? 'bg-primary text-black'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
        `}
                title="Grid View"
            >
                <LayoutGrid size={18} />
            </button>
            <button
                onClick={() => onViewChange('list')}
                className={`
          p-2 rounded-full transition-all
          ${view === 'list'
                        ? 'bg-primary text-black'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
        `}
                title="List View"
            >
                <List size={18} />
            </button>
        </div>
    );
}
