import React, { useState, useRef, useCallback } from 'react';
import { 
  X, Bold, Italic, List, BarChart3, Table, Image, 
  Paperclip, Save, Type, Hash, AlignLeft, Camera,
  Upload, Plus, Trash2, Move, GripVertical
} from 'lucide-react';

interface VisitNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitData: {
    supplierName: string;
    date: string;
    time: string;
    hosts: string[];
    location: string;
  };
}

interface NoteBlock {
  id: string;
  type: 'text' | 'header' | 'bullet' | 'image' | 'table' | 'chart';
  content: any;
  order: number;
}

const VisitNotesModal: React.FC<VisitNotesModalProps> = ({ isOpen, onClose, visitData }) => {
  const [blocks, setBlocks] = useState<NoteBlock[]>([
    {
      id: '1',
      type: 'text',
      content: { text: '' },
      order: 0
    }
  ]);
  
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addBlock = (type: NoteBlock['type'], afterId?: string) => {
    const newBlock: NoteBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      order: afterId ? blocks.find(b => b.id === afterId)?.order || 0 + 0.5 : blocks.length
    };

    setBlocks(prev => [...prev, newBlock].sort((a, b) => a.order - b.order));
    setActiveBlock(newBlock.id);
  };

  const getDefaultContent = (type: NoteBlock['type']) => {
    switch (type) {
      case 'text':
        return { text: '' };
      case 'header':
        return { text: 'Header', level: 1 };
      case 'bullet':
        return { items: [''] };
      case 'image':
        return { url: '', caption: '', width: '100%' };
      case 'table':
        return { 
          rows: [
            ['Header 1', 'Header 2', 'Header 3'],
            ['Cell 1', 'Cell 2', 'Cell 3'],
            ['Cell 4', 'Cell 5', 'Cell 6']
          ]
        };
      case 'chart':
        return { 
          type: 'bar',
          data: [
            { label: 'Quality', value: 85 },
            { label: 'Price', value: 92 },
            { label: 'Logistics', value: 78 }
          ]
        };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedBlock || draggedBlock === targetId) return;

    const draggedBlockData = blocks.find(b => b.id === draggedBlock);
    const targetBlockData = blocks.find(b => b.id === targetId);

    if (!draggedBlockData || !targetBlockData) return;

    setBlocks(prev => {
      const newBlocks = prev.map(block => {
        if (block.id === draggedBlock) {
          return { ...block, order: targetBlockData.order };
        }
        if (block.id === targetId) {
          return { ...block, order: draggedBlockData.order };
        }
        return block;
      });
      return newBlocks.sort((a, b) => a.order - b.order);
    });

    setDraggedBlock(null);
  };

  const handleImageUpload = useCallback((files: FileList | null, blockId?: string) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        
        if (blockId) {
          updateBlock(blockId, { url, caption: file.name, width: '100%' });
        } else {
          addBlock('image');
          // In real implementation, upload to Supabase storage
        }
      }
    });
  }, []);

  const handleDragAndDropImage = (e: React.DragEvent, blockId?: string) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleImageUpload(files, blockId);
  };

  const renderBlock = (block: NoteBlock) => {
    const isActive = activeBlock === block.id;

    return (
      <div
        key={block.id}
        className={`group relative mb-2 ${isActive ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, block.id)}
        onDragEnter={(e) => e.preventDefault()}
        onClick={() => setActiveBlock(block.id)}
      >
        {/* Drag Handle */}
        <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 cursor-move">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {/* Delete Button */}
        {blocks.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
            }}
            className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Block Content */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300">
          {renderBlockContent(block)}
        </div>

        {/* Add Block Below */}
        {isActive && (
          <div className="flex items-center justify-center mt-2 space-x-1">
            <button
              onClick={() => addBlock('text', block.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Add text"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={() => addBlock('header', block.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Add header"
            >
              <Hash className="w-4 h-4" />
            </button>
            <button
              onClick={() => addBlock('bullet', block.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Add bullet list"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => addBlock('image', block.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Add image"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              onClick={() => addBlock('table', block.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Add table"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => addBlock('chart', block.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Add chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderBlockContent = (block: NoteBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <textarea
            value={block.content.text || ''}
            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
            placeholder="Start typing your notes..."
            className="w-full border-none outline-none resize-none min-h-[2rem] text-gray-800"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        );

      case 'header':
        return (
          <input
            value={block.content.text || ''}
            onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
            placeholder="Header text..."
            className={`w-full border-none outline-none font-bold bg-transparent ${
              block.content.level === 1 ? 'text-2xl' : 
              block.content.level === 2 ? 'text-xl' : 'text-lg'
            }`}
          />
        );

      case 'bullet':
        return (
          <div className="space-y-1">
            {block.content.items?.map((item: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-gray-600 mt-1">•</span>
                <input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...block.content.items];
                    newItems[index] = e.target.value;
                    updateBlock(block.id, { items: newItems });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const newItems = [...block.content.items, ''];
                      updateBlock(block.id, { items: newItems });
                    }
                  }}
                  placeholder="Bullet point..."
                  className="flex-1 border-none outline-none bg-transparent"
                />
              </div>
            ))}
          </div>
        );

      case 'image':
        return (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
            onDrop={(e) => handleDragAndDropImage(e, block.id)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                handleImageUpload(target.files, block.id);
              };
              input.click();
            }}
          >
            {block.content.url ? (
              <div>
                <img src={block.content.url} alt="" className="max-w-full h-auto rounded" />
                <input
                  value={block.content.caption || ''}
                  onChange={(e) => updateBlock(block.id, { ...block.content, caption: e.target.value })}
                  placeholder="Add a caption..."
                  className="mt-2 w-full text-center text-sm text-gray-600 border-none outline-none bg-transparent"
                />
              </div>
            ) : (
              <div className="text-gray-500">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p>Drop image here or click to upload</p>
              </div>
            )}
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {block.content.rows?.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: string, cellIndex: number) => (
                    <td key={cellIndex} className="border border-gray-300 p-2">
                      <input
                        value={cell}
                        onChange={(e) => {
                          const newRows = [...block.content.rows];
                          newRows[rowIndex][cellIndex] = e.target.value;
                          updateBlock(block.id, { rows: newRows });
                        }}
                        className="w-full border-none outline-none bg-transparent text-sm"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </table>
          </div>
        );

      case 'chart':
        return (
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="text-sm font-medium mb-3">Simple Bar Chart</h4>
            <div className="space-y-2">
              {block.content.data?.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    value={item.label}
                    onChange={(e) => {
                      const newData = [...block.content.data];
                      newData[index] = { ...item, label: e.target.value };
                      updateBlock(block.id, { ...block.content, data: newData });
                    }}
                    className="w-20 text-xs border rounded px-1"
                  />
                  <div className="flex-1 bg-gray-200 rounded h-6 relative">
                    <div 
                      className="bg-green-500 h-full rounded"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => {
                      const newData = [...block.content.data];
                      newData[index] = { ...item, value: parseInt(e.target.value) || 0 };
                      updateBlock(block.id, { ...block.content, data: newData });
                    }}
                    className="w-12 text-xs border rounded px-1"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-lg w-full max-w-4xl h-[90vh] flex flex-col shadow-xl">
        {/* Fixed Header */}
        <div className="bg-white rounded-t-lg p-6 border-b shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Visit Notes</h2>
            <div className="flex items-center space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Notes</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Visit Context */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-700">Supplier</label>
              <p className="text-gray-900">{visitData.supplierName}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Date & Time</label>
              <p className="text-gray-900">{visitData.date} at {visitData.time}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Location</label>
              <p className="text-gray-900">{visitData.location}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Hosts</label>
              <p className="text-gray-900">{visitData.hosts.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Note Taking Area */}
        <div className="flex-1 overflow-y-auto p-6" style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
          <div className="max-w-3xl mx-auto">
            {blocks
              .sort((a, b) => a.order - b.order)
              .map(block => renderBlock(block))
            }

            {/* Add First Block */}
            {blocks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">Start taking notes about your visit</p>
                <button
                  onClick={() => addBlock('text')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add First Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden file input for image uploads */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files)}
        />
      </div>
    </div>
  );
};

// Usage Example
const ExampleUsage = () => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const sampleVisitData = {
    supplierName: 'Fazenda Santa Clara',
    date: 'July 21, 2025',
    time: '14:00',
    hosts: ['Francisco Pereira', 'Maria Santos'],
    location: 'Cocatrel Cooperative, Três Pontas'
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsNotesOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded flex items-center space-x-2"
      >
        <AlignLeft className="w-5 h-5" />
        <span>Open Visit Notes</span>
      </button>

      <VisitNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        visitData={sampleVisitData}
      />
    </div>
  );
};

export default ExampleUsage;