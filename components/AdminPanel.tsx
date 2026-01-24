import React, { useState, useEffect, useRef } from 'react';
import { AppData, Project, BlogPost, Skill } from '../types';
import { 
  LayoutDashboard, Code, BookOpen, Film, Music, Settings, 
  Plus, Trash2, Edit2, Save, X, LogOut, Menu, 
  ChevronLeft, ChevronRight, Image as ImageIcon, Tags,
  Check, Search, Bold, Italic, Underline, List, ListOrdered, 
  Heading1, Heading2, Quote, AlignLeft, AlignCenter
} from 'lucide-react';

interface AdminPanelProps {
  data: AppData;
  updateData: (newData: AppData) => void;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'projects' | 'techBlogs' | 'hobbyBlogs' | 'skills';
type EditingItem = Project | BlogPost | Skill | null;

// Standard Input Style
const INPUT_CLASS = "w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-prof-blue focus:border-transparent outline-none transition-all placeholder:text-gray-600";

export const AdminPanel: React.FC<AdminPanelProps> = ({ data, updateData, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem>(null);
  const [editType, setEditType] = useState<Tab | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDelete = (key: keyof AppData, id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const list = data[key] as any[];
    const newList = list.filter((item: any) => 
       (item.id && item.id !== id) || (item.name && item.name !== id)
    );
    updateData({ ...data, [key]: newList });
  };

  const handleEdit = (item: any, type: Tab) => {
    setEditingItem(item);
    setEditType(type);
    setIsModalOpen(true);
  };

  const handleAddNew = (type: Tab) => {
    setEditingItem(null);
    setEditType(type);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    if (!editType) return;
    
    const key = editType as keyof AppData;
    const currentList = data[key] as any[];
    let newList;

    if (editingItem) {
      newList = currentList.map(item => 
        (item.id === editingItem.id || (item.name && item.name === (editingItem as Skill).name)) ? { ...item, ...formData } : item
      );
    } else {
      const newItem = {
        ...formData,
        id: formData.id || `${Date.now()}`
      };
      newList = [newItem, ...currentList];
    }

    updateData({ ...data, [key]: newList });
    setIsModalOpen(false);
  };

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex items-center gap-4 hover:border-prof-blue/50 transition-colors">
      <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-20 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <div className="text-2xl font-bold font-display">{value}</div>
        <div className="text-gray-400 text-sm font-medium">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans overflow-hidden">
      
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 md:w-20 -translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between h-20">
          {isSidebarOpen ? (
             <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
               <Settings className="w-6 h-6 text-prof-blue" />
               <span className="tracking-tight">Admin</span>
             </h2>
          ) : (
            <div className="mx-auto"><Settings className="w-6 h-6 text-prof-blue" /></div>
          )}
          {isMobile && <button onClick={() => setIsSidebarOpen(false)}><X className="w-5 h-5 text-gray-500"/></button>}
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <SidebarBtn 
            icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} 
            collapsed={!isSidebarOpen} onClick={() => { setActiveTab('dashboard'); if(isMobile) setIsSidebarOpen(false); }} 
          />
          
          <div className={`pt-6 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${!isSidebarOpen && 'text-center'}`}>
            {isSidebarOpen ? 'Professional' : 'PRO'}
          </div>
          <SidebarBtn icon={Code} label="Projects" active={activeTab === 'projects'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('projects')} />
          <SidebarBtn icon={BookOpen} label="Tech Blogs" active={activeTab === 'techBlogs'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('techBlogs')} />
          <SidebarBtn icon={Code} label="Skills" active={activeTab === 'skills'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('skills')} />
          
          <div className={`pt-6 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${!isSidebarOpen && 'text-center'}`}>
            {isSidebarOpen ? 'Personal' : 'PER'}
          </div>
          <SidebarBtn icon={BookOpen} label="Hobby Blogs" active={activeTab === 'hobbyBlogs'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('hobbyBlogs')} />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout} 
            className={`flex items-center gap-3 w-full p-3 text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" /> 
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-gray-950">
        <header className="h-20 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-4">
             <div className="text-sm text-gray-500">Welcome back, <span className="text-white font-bold">Admin</span></div>
             <div className="w-8 h-8 rounded-full bg-prof-blue text-white flex items-center justify-center font-bold text-xs">JD</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
              <h1 className="text-3xl font-display font-bold mb-2">Overview</h1>
              <p className="text-gray-400 mb-8">Here's what's happening across your portfolios.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Projects" value={data.projects.length} icon={Code} color="text-blue-500" />
                <StatCard label="Tech Articles" value={data.techBlogs.length} icon={BookOpen} color="text-emerald-500" />
                <StatCard label="Hobby Logs" value={data.hobbyBlogs.length} icon={Film} color="text-purple-500" />
                <StatCard label="Skills Listed" value={data.skills.length} icon={Code} color="text-orange-500" />
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h3 className="font-bold text-lg">Recent Projects</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-gray-400">
                     <thead className="bg-gray-800/50 text-gray-300 uppercase font-medium">
                       <tr>
                         <th className="px-6 py-4">Project Name</th>
                         <th className="px-6 py-4">Tech Stack</th>
                         <th className="px-6 py-4">Status</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-800">
                        {data.projects.slice(0, 3).map(p => (
                          <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                              <img src={p.image} className="w-8 h-8 rounded object-cover" />
                              {p.title}
                            </td>
                            <td className="px-6 py-4">{p.techStack.slice(0, 3).join(', ')}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">Active</span></td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h1>
                  <p className="text-gray-400 text-sm mt-1">Manage your {activeTab} content.</p>
                </div>
                <button 
                  onClick={() => handleAddNew(activeTab)}
                  className="bg-prof-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all font-medium"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>

              <div className="grid gap-4">
                {activeTab === 'skills' ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {data.skills.map((skill, idx) => (
                       <div key={idx} className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex items-center justify-between group hover:border-prof-blue/50 transition-colors">
                         <div>
                            <h3 className="font-bold text-lg">{skill.name}</h3>
                            <div className="w-32 bg-gray-700 h-1.5 rounded-full mt-2">
                              <div className="bg-prof-blue h-1.5 rounded-full" style={{ width: `${skill.level}%`}}></div>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => handleEdit(skill, 'skills')} className="p-2 text-gray-500 hover:text-white bg-gray-800 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                            <button onClick={() => handleDelete('skills', skill.name)} className="p-2 text-gray-500 hover:text-red-400 bg-gray-800 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                         </div>
                       </div>
                     ))}
                   </div>
                ) : (
                  <div className="space-y-4">
                    {(data[activeTab] as any[]).map((item) => (
                      <div key={item.id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:border-gray-700 transition-all">
                        <div className="w-full md:w-32 h-32 md:h-20 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                          <img src={item.image || 'https://via.placeholder.com/150'} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-xl truncate text-white">{item.title}</h3>
                             {activeTab.includes('Blog') && (
                               <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{item.category}</span>
                             )}
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-1 mb-2">{item.description || item.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                             {item.date && <span>{item.date}</span>}
                             {item.techStack && <span>{item.techStack.length} Technologies</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                          <button 
                            onClick={() => handleEdit(item, activeTab)}
                            className="flex-1 md:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(activeTab, item.id)}
                            className="px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <EditorModal 
          type={editType!} 
          initialData={editingItem} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}

    </div>
  );
};

// --- RICH TEXT EDITOR ---

const RichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleToolbar = (e: React.MouseEvent, command: string, val?: string) => {
    e.preventDefault();
    document.execCommand(command, false, val);
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="w-full bg-gray-950 border border-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-prof-blue transition-all">
      <div className="flex items-center gap-1 p-2 bg-gray-900 border-b border-gray-800 flex-wrap">
        <button onMouseDown={e => handleToolbar(e, 'bold')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Bold"><Bold className="w-4 h-4"/></button>
        <button onMouseDown={e => handleToolbar(e, 'italic')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Italic"><Italic className="w-4 h-4"/></button>
        <button onMouseDown={e => handleToolbar(e, 'underline')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Underline"><Underline className="w-4 h-4"/></button>
        <div className="w-px h-4 bg-gray-700 mx-1"></div>
        <button onMouseDown={e => handleToolbar(e, 'formatBlock', 'H3')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Heading 1"><Heading1 className="w-4 h-4"/></button>
        <button onMouseDown={e => handleToolbar(e, 'formatBlock', 'H4')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Heading 2"><Heading2 className="w-4 h-4"/></button>
        <div className="w-px h-4 bg-gray-700 mx-1"></div>
        <button onMouseDown={e => handleToolbar(e, 'insertUnorderedList')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Bullet List"><List className="w-4 h-4"/></button>
        <button onMouseDown={e => handleToolbar(e, 'insertOrderedList')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Numbered List"><ListOrdered className="w-4 h-4"/></button>
         <div className="w-px h-4 bg-gray-700 mx-1"></div>
         <button onMouseDown={e => handleToolbar(e, 'formatBlock', 'blockquote')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Quote"><Quote className="w-4 h-4"/></button>
      </div>
      <div
        ref={editorRef}
        className="p-4 min-h-[300px] outline-none prose prose-invert max-w-none text-sm text-gray-200"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        // Suppress React warning for contentEditable with children (though here innerHTML is used)
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

// --- SUB COMPONENTS ---

const SidebarBtn = ({ icon: Icon, label, active, collapsed, onClick }: any) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
      ${active ? 'bg-prof-blue text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
      ${collapsed ? 'justify-center' : ''}
    `}
    title={collapsed ? label : ''}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-white'} transition-colors`} />
    {!collapsed && <span className="font-medium text-sm">{label}</span>}
  </button>
);

const EditorModal = ({ type, initialData, onClose, onSave }: any) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  
  useEffect(() => {
    if (!initialData) {
       if (type === 'projects') setFormData({ title: '', description: '', image: '', techStack: [], repoUrl: '', liveUrl: '' });
       else if (type === 'skills') setFormData({ name: '', level: 50 });
       else setFormData({ title: '', excerpt: '', content: '', image: '', date: new Date().toLocaleDateString(), readTime: '5 min', category: type === 'techBlogs' ? 'tech' : 'hobby' });
    }
  }, [type, initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !formData.techStack?.includes(val)) {
        handleChange('techStack', [...(formData.techStack || []), val]);
        e.currentTarget.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange('techStack', formData.techStack.filter((t: string) => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-gray-800 flex flex-col">
        
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold font-display text-white">
            {initialData ? 'Edit' : 'Create New'} {type === 'skills' ? 'Skill' : type === 'projects' ? 'Project' : 'Post'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-6 h-6"/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          <InputGroup label={type === 'skills' ? 'Skill Name' : 'Title'}>
            <input 
              type="text" 
              value={formData.title || formData.name || ''} 
              onChange={e => handleChange(type === 'skills' ? 'name' : 'title', e.target.value)}
              className={INPUT_CLASS}
              placeholder="Enter title..."
            />
          </InputGroup>

          {type === 'skills' ? (
             <InputGroup label={`Proficiency Level: ${formData.level}%`}>
                <input 
                  type="range" min="0" max="100" 
                  value={formData.level || 0} 
                  onChange={e => handleChange('level', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-prof-blue"
                />
             </InputGroup>
          ) : (
             <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   {type !== 'projects' && (
                     <InputGroup label="Read Time">
                       <input type="text" value={formData.readTime || ''} onChange={e => handleChange('readTime', e.target.value)} className={INPUT_CLASS} placeholder="e.g. 5 min" />
                     </InputGroup>
                   )}
                   <InputGroup label="Date">
                      <input type="text" value={formData.date || ''} onChange={e => handleChange('date', e.target.value)} className={INPUT_CLASS} placeholder="Oct 12, 2023" />
                   </InputGroup>
                </div>

                <InputGroup label="Image URL">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                       <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                       <input 
                        type="text" 
                        value={formData.image || ''} 
                        onChange={e => handleChange('image', e.target.value)} 
                        className={`${INPUT_CLASS} pl-10`} 
                        placeholder="https://..." 
                       />
                    </div>
                    {formData.image && <img src={formData.image} className="w-12 h-12 rounded object-cover border border-gray-700 bg-gray-800" />}
                  </div>
                </InputGroup>

                <InputGroup label={type === 'projects' ? 'Description' : 'Excerpt'}>
                   <textarea 
                     value={formData.description || formData.excerpt || ''} 
                     onChange={e => handleChange(type === 'projects' ? 'description' : 'excerpt', e.target.value)}
                     className={`${INPUT_CLASS} min-h-[80px]`} 
                     placeholder="Short summary..."
                   />
                </InputGroup>

                {type === 'projects' && (
                   <InputGroup label="Tech Stack (Press Enter to add)">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.techStack?.map((tag: string) => (
                          <span key={tag} className="bg-gray-800 text-blue-400 px-2 py-1 rounded text-sm flex items-center gap-1 border border-gray-700">
                            {tag} <button onClick={() => removeTag(tag)}><X className="w-3 h-3 hover:text-white"/></button>
                          </span>
                        ))}
                      </div>
                      <div className="relative">
                        <Tags className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                        <input 
                          type="text" 
                          onKeyDown={handleTagInput}
                          className={`${INPUT_CLASS} pl-10`} 
                          placeholder="Add technology tag..." 
                        />
                      </div>
                   </InputGroup>
                )}

                 {type === 'projects' && (
                   <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="Repo URL">
                        <input type="text" value={formData.repoUrl || ''} onChange={e => handleChange('repoUrl', e.target.value)} className={INPUT_CLASS} />
                      </InputGroup>
                      <InputGroup label="Live URL">
                        <input type="text" value={formData.liveUrl || ''} onChange={e => handleChange('liveUrl', e.target.value)} className={INPUT_CLASS} />
                      </InputGroup>
                   </div>
                )}

                {type.includes('Blog') && (
                   <InputGroup label="Full Content (Rich Text)">
                      <RichTextEditor 
                         value={formData.content || ''} 
                         onChange={(html) => handleChange('content', html)}
                      />
                   </InputGroup>
                )}
             </>
          )}
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3 bg-gray-950/30 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 font-medium transition-colors">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2.5 rounded-lg bg-prof-blue hover:bg-blue-600 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, children }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-400 ml-1">{label}</label>
    {children}
  </div>
);

