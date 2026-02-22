import React, { useState, useEffect, useRef } from "react";
import { AppData, Project, BlogPost, Skill, CareerItem } from "../types";
import { RichTextEditor } from "./RichTextEditor";
import * as api from "../services/api";
import {
  LayoutDashboard,
  Code,
  BookOpen,
  Film,
  Music,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Tags,
  Check,
  Search,
  Upload,
  FileImage,
  AlertCircle,
  Briefcase,
  Home,
  KeyRound,
  User,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

interface AdminPanelProps {
  data: AppData;
  updateData: (newData: AppData) => void;
  onLogout: () => void;
  onGoHome?: () => void;
}

type Tab =
  | "dashboard"
  | "projects"
  | "techBlogs"
  | "hobbyBlogs"
  | "skills"
  | "career"
  | "settings";
type EditingItem = Project | BlogPost | Skill | CareerItem | null;

// Standard Input Style
const INPUT_CLASS =
  "w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-prof-blue focus:border-transparent outline-none transition-all placeholder:text-gray-600";

export const AdminPanel: React.FC<AdminPanelProps> = ({
  data,
  updateData,
  onLogout,
  onGoHome,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = async (key: keyof AppData, id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      // Call API to delete
      if (key === "projects") {
        await api.deleteProject(String(id));
      } else if (key === "techBlogs" || key === "hobbyBlogs") {
        await api.deleteBlog(String(id));
      } else if (key === "skills") {
        await api.deleteSkill(String(id));
      } else if (key === "career") {
        await api.deleteCareer(String(id));
      }

      // Update local state
      const list = data[key] as any[];
      const newList = list.filter((item: any) => {
        if (key === "skills") return item.name !== id;
        return item.id !== id;
      });
      updateData({ ...data, [key]: newList });
    } catch (err: any) {
      alert("Silme hatası: " + (err.message || "Bilinmeyen hata"));
    }
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

  const handleSave = async (formData: any) => {
    if (!editType) return;

    const key = editType as keyof AppData;
    const currentList = data[key] as any[];

    try {
      if (editingItem) {
        // UPDATE
        if (key === "projects") {
          await api.updateProject(editingItem.id as string, formData);
        } else if (key === "techBlogs" || key === "hobbyBlogs") {
          await api.updateBlog(editingItem.id as string, formData);
        } else if (key === "skills") {
          await api.updateSkill((editingItem as Skill).name, formData);
        } else if (key === "career") {
          await api.updateCareer(editingItem.id as string, formData);
        }

        const newList = currentList.map((item) => {
          if (key === "skills") {
            return item.name === (editingItem as Skill).name
              ? { ...item, ...formData }
              : item;
          }
          return item.id === editingItem.id ? { ...item, ...formData } : item;
        });
        updateData({ ...data, [key]: newList });
      } else {
        // CREATE
        const newItem =
          key === "skills"
            ? { ...formData }
            : { ...formData, id: formData.id || `${Date.now()}` };

        if (key === "projects") {
          await api.createProject(newItem);
        } else if (key === "techBlogs" || key === "hobbyBlogs") {
          await api.createBlog(newItem);
        } else if (key === "skills") {
          await api.createSkill(newItem);
        } else if (key === "career") {
          await api.createCareer(newItem);
        }

        const newList = [newItem, ...currentList];
        updateData({ ...data, [key]: newList });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      alert("Kaydetme hatası: " + (err.message || "Bilinmeyen hata"));
    }
  };

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex items-center gap-4 hover:border-prof-blue/50 transition-colors">
      <div
        className={`w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center ${color === "blue" ? "bg-blue-500/20" : color === "emerald" ? "bg-emerald-500/20" : color === "purple" ? "bg-purple-500/20" : "bg-orange-500/20"}`}
      >
        <Icon
          className={`w-6 h-6 ${color === "blue" ? "text-blue-500" : color === "emerald" ? "text-emerald-500" : color === "purple" ? "text-purple-500" : "text-orange-500"}`}
        />
      </div>
      <div>
        <div className="text-2xl font-bold font-display">{value}</div>
        <div className="text-gray-400 text-sm font-medium">{label}</div>
      </div>
    </div>
  );

  const EmptyState = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="w-12 h-12 text-gray-700 mb-4" />
      <h3 className="text-lg font-semibold text-gray-500 mb-1">
        No {label} yet
      </h3>
      <p className="text-gray-600 text-sm">
        Click "Add New" to create your first entry.
      </p>
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
          ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 md:w-20 -translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between h-20">
          {isSidebarOpen ? (
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-prof-blue" />
              <span className="tracking-tight">Admin</span>
            </h2>
          ) : (
            <div className="mx-auto">
              <Settings className="w-6 h-6 text-prof-blue" />
            </div>
          )}
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <SidebarBtn
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === "dashboard"}
            collapsed={!isSidebarOpen}
            onClick={() => {
              setActiveTab("dashboard");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />

          <div
            className={`pt-6 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${!isSidebarOpen && "text-center"}`}
          >
            {isSidebarOpen ? "Professional" : "PRO"}
          </div>
          <SidebarBtn
            icon={Code}
            label="Projects"
            active={activeTab === "projects"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab("projects")}
          />
          <SidebarBtn
            icon={BookOpen}
            label="Tech Blogs"
            active={activeTab === "techBlogs"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab("techBlogs")}
          />
          <SidebarBtn
            icon={Code}
            label="Skills"
            active={activeTab === "skills"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab("skills")}
          />
          <SidebarBtn
            icon={Briefcase}
            label="Career"
            active={activeTab === "career"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab("career")}
          />

          <div
            className={`pt-6 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${!isSidebarOpen && "text-center"}`}
          >
            {isSidebarOpen ? "Personal" : "PER"}
          </div>
          <SidebarBtn
            icon={BookOpen}
            label="Hobby Blogs"
            active={activeTab === "hobbyBlogs"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab("hobbyBlogs")}
          />
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <SidebarBtn
            icon={Settings}
            label="Settings"
            active={activeTab === "settings"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab("settings")}
          />
          {onGoHome && (
            <button
              onClick={onGoHome}
              className={`flex items-center gap-3 w-full p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all ${!isSidebarOpen && "justify-center"}`}
            >
              <Home className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">Ana Sayfa</span>}
            </button>
          )}
          <button
            onClick={onLogout}
            className={`flex items-center gap-3 w-full p-3 text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all ${!isSidebarOpen && "justify-center"}`}
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
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Welcome back, <span className="text-white font-bold">Admin</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-prof-blue text-white flex items-center justify-center font-bold text-xs">
              AMT
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === "dashboard" && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
              <h1 className="text-3xl font-display font-bold mb-2">Overview</h1>
              <p className="text-gray-400 mb-8">
                Here's what's happening across your portfolios.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                <StatCard
                  label="Total Projects"
                  value={data.projects.length}
                  icon={Code}
                  color="blue"
                />
                <StatCard
                  label="Tech Articles"
                  value={data.techBlogs.length}
                  icon={BookOpen}
                  color="emerald"
                />
                <StatCard
                  label="Hobby Logs"
                  value={data.hobbyBlogs.length}
                  icon={Film}
                  color="purple"
                />
                <StatCard
                  label="Skills Listed"
                  value={data.skills.length}
                  icon={Code}
                  color="orange"
                />
                <StatCard
                  label="Career Items"
                  value={data.career.length}
                  icon={Briefcase}
                  color="blue"
                />
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
                      {data.projects.slice(0, 3).map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                            <img
                              src={p.image}
                              className="w-8 h-8 rounded object-cover"
                            />
                            {p.title}
                          </td>
                          <td className="px-6 py-4">
                            {p.techStack.slice(0, 3).join(", ")}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "dashboard" && activeTab !== "settings" && (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold capitalize">
                    {activeTab.replace(/([A-Z])/g, " $1").trim()}
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Manage your {activeTab} content.
                  </p>
                </div>
                <button
                  onClick={() => handleAddNew(activeTab)}
                  className="bg-prof-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all font-medium"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>

              <div className="grid gap-4">
                {activeTab === "skills" ? (
                  data.skills.length === 0 ? (
                    <EmptyState label="Skills" />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex items-center justify-between group hover:border-prof-blue/50 transition-colors"
                        >
                          <div>
                            <h3 className="font-bold text-lg">{skill.name}</h3>
                            <div className="w-32 bg-gray-700 h-1.5 rounded-full mt-2">
                              <div
                                className="bg-prof-blue h-1.5 rounded-full"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(skill, "skills")}
                              className="p-2 text-gray-500 hover:text-white bg-gray-800 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete("skills", skill.name)}
                              className="p-2 text-gray-500 hover:text-red-400 bg-gray-800 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : activeTab === "career" ? (
                  data.career.length === 0 ? (
                    <EmptyState label="Career" />
                  ) : (
                    <div className="space-y-4">
                      {data.career.map((item) => {
                        const typeLabels: Record<string, string> = {
                          work: "Çalışma",
                          internship: "Staj",
                          freelance: "Freelance",
                        };
                        const typeColors: Record<string, string> = {
                          work: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                          internship:
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          freelance:
                            "bg-purple-500/10 text-purple-400 border-purple-500/20",
                        };
                        return (
                          <div
                            key={item.id}
                            className="bg-gray-900 p-5 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-5 items-start md:items-center group hover:border-gray-700 transition-all"
                          >
                            <div className="w-full md:w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                              <Briefcase className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-lg truncate text-white">
                                  {item.title}
                                </h3>
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${typeColors[item.type] || typeColors.work}`}
                                >
                                  {typeLabels[item.type] || item.type}
                                </span>
                                {!item.endDate && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Aktif
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm mb-1">
                                {item.company}
                                {item.location ? ` · ${item.location}` : ""}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {item.startDate} —{" "}
                                {item.endDate || "Devam Ediyor"}
                              </p>
                              {item.techStack && item.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {item.techStack.map((t) => (
                                    <span
                                      key={t}
                                      className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[11px] rounded border border-gray-700"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                              <button
                                onClick={() => handleEdit(item, "career")}
                                className="flex-1 md:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete("career", item.id)}
                                className="px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (data[activeTab] as any[]).length === 0 ? (
                  <EmptyState
                    label={activeTab.replace(/([A-Z])/g, " $1").trim()}
                  />
                ) : (
                  <div className="space-y-4">
                    {(data[activeTab] as any[]).map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-900 p-5 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:border-gray-700 transition-all"
                      >
                        <div className="w-full md:w-32 h-32 md:h-20 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                              <FileImage className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-xl truncate text-white">
                              {item.title}
                            </h3>
                            {activeTab.includes("Blog") && (
                              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-1 mb-2">
                            {item.description || item.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {item.date && <span>{item.date}</span>}
                            {item.techStack && (
                              <span>{item.techStack.length} Technologies</span>
                            )}
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

          {activeTab === "settings" && <AdminSettingsView />}
        </div>{" "}
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

// --- SUB COMPONENTS ---

const SidebarBtn = ({ icon: Icon, label, active, collapsed, onClick }: any) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
      ${active ? "bg-prof-blue text-white shadow-lg shadow-blue-900/20" : "text-gray-400 hover:bg-gray-800 hover:text-white"}
      ${collapsed ? "justify-center" : ""}
    `}
    title={collapsed ? label : ""}
  >
    <Icon
      className={`w-5 h-5 ${active ? "text-white" : "text-gray-500 group-hover:text-white"} transition-colors`}
    />
    {!collapsed && <span className="font-medium text-sm">{label}</span>}
  </button>
);

const EditorModal = ({ type, initialData, onClose, onSave }: any) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  const imageFileRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!initialData) {
      if (type === "projects")
        setFormData({
          title: "",
          description: "",
          image: "",
          techStack: [],
          repoUrl: "",
          liveUrl: "",
        });
      else if (type === "skills") setFormData({ name: "", level: 50 });
      else if (type === "career")
        setFormData({
          type: "work",
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          techStack: [],
        });
      else
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          image: "",
          date: new Date().toISOString().split("T")[0],
          readTime: "5 min",
          category: type === "techBlogs" ? "tech" : "hobby",
        });
    }
  }, [type, initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !formData.techStack?.includes(val)) {
        handleChange("techStack", [...(formData.techStack || []), val]);
        e.currentTarget.value = "";
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange(
      "techStack",
      formData.techStack.filter((t: string) => t !== tagToRemove),
    );
  };

  const handleImageFile = (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Allowed: JPG, PNG, GIF, WebP, SVG");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Maximum 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => handleChange("image", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold font-display text-white">
            {initialData ? "Edit" : "Create New"}{" "}
            {type === "skills"
              ? "Skill"
              : type === "projects"
                ? "Project"
                : type === "career"
                  ? "Career Item"
                  : "Post"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <InputGroup
            label={
              type === "skills"
                ? "Skill Name"
                : type === "career"
                  ? "Pozisyon / Ünvan"
                  : "Title"
            }
          >
            <input
              type="text"
              value={formData.title || formData.name || ""}
              onChange={(e) =>
                handleChange(
                  type === "skills" ? "name" : "title",
                  e.target.value,
                )
              }
              className={INPUT_CLASS}
              placeholder={
                type === "career"
                  ? "Ör: Full-Stack Developer"
                  : "Enter title..."
              }
            />
          </InputGroup>

          {type === "skills" ? (
            <InputGroup label={`Proficiency Level: ${formData.level}%`}>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.level || 0}
                onChange={(e) =>
                  handleChange("level", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-prof-blue"
              />
            </InputGroup>
          ) : type === "career" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup label="Şirket / Kurum">
                  <input
                    type="text"
                    value={formData.company || ""}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="Ör: Tech Corp"
                  />
                </InputGroup>
                <InputGroup label="Tür">
                  <select
                    value={formData.type || "work"}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="work">Çalışma</option>
                    <option value="internship">Staj</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </InputGroup>
              </div>

              <InputGroup label="Konum">
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Ör: İstanbul, Türkiye"
                />
              </InputGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup label="Başlangıç Tarihi">
                  <input
                    type="month"
                    value={formData.startDate || ""}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className={`${INPUT_CLASS} [color-scheme:dark]`}
                  />
                </InputGroup>
                <InputGroup label="Bitiş Tarihi (boş = Devam Ediyor)">
                  <input
                    type="month"
                    value={formData.endDate || ""}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    className={`${INPUT_CLASS} [color-scheme:dark]`}
                  />
                </InputGroup>
              </div>

              <InputGroup label="Açıklama">
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`${INPUT_CLASS} min-h-[100px]`}
                  placeholder="Bu pozisyondaki görev ve sorumluluklarınız..."
                />
              </InputGroup>

              <InputGroup label="Teknolojiler (Enter ile ekle)">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.techStack?.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-800 text-blue-400 px-2 py-1 rounded text-sm flex items-center gap-1 border border-gray-700"
                    >
                      {tag}{" "}
                      <button onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <Tags className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    onKeyDown={handleTagInput}
                    className={`${INPUT_CLASS} pl-10`}
                    placeholder="Teknoloji ekle..."
                  />
                </div>
              </InputGroup>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {type !== "projects" && (
                  <InputGroup label="Read Time">
                    <input
                      type="text"
                      value={formData.readTime || ""}
                      onChange={(e) => handleChange("readTime", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="e.g. 5 min"
                    />
                  </InputGroup>
                )}
                <InputGroup label="Date">
                  <input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className={`${INPUT_CLASS} [color-scheme:dark]`}
                  />
                </InputGroup>
              </div>

              <InputGroup label="Cover Image">
                <div className="space-y-3">
                  {/* Upload Area */}
                  {!formData.image && (
                    <div
                      className={`
                          border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
                          ${
                            dragActive
                              ? "border-prof-blue bg-blue-500/10 text-blue-400"
                              : "border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300"
                          }
                        `}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleImageDrop}
                      onClick={() => imageFileRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 opacity-60" />
                      <p className="text-sm font-medium">
                        {dragActive
                          ? "Drop image here..."
                          : "Click or drag & drop to upload"}
                      </p>
                      <p className="text-xs mt-1 opacity-60">
                        JPG, PNG, GIF, WebP · Max 10MB
                      </p>
                      <input
                        ref={imageFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageFile(file);
                        }}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Preview */}
                  {formData.image && (
                    <div className="relative rounded-xl overflow-hidden border border-gray-700 bg-gray-950">
                      <img
                        src={formData.image}
                        className="w-full max-h-48 object-contain"
                      />
                      <button
                        onClick={() => handleChange("image", "")}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* URL Fallback */}
                  <div className="flex items-center gap-3 text-gray-600 text-xs">
                    <div className="flex-1 h-px bg-gray-800" />
                    <span>OR enter URL</span>
                    <div className="flex-1 h-px bg-gray-800" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={
                          formData.image?.startsWith("data:")
                            ? ""
                            : formData.image || ""
                        }
                        onChange={(e) => handleChange("image", e.target.value)}
                        className={`${INPUT_CLASS} pl-10`}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </InputGroup>

              <InputGroup
                label={type === "projects" ? "Description" : "Excerpt"}
              >
                <textarea
                  value={formData.description || formData.excerpt || ""}
                  onChange={(e) =>
                    handleChange(
                      type === "projects" ? "description" : "excerpt",
                      e.target.value,
                    )
                  }
                  className={`${INPUT_CLASS} min-h-[80px]`}
                  placeholder="Short summary..."
                />
              </InputGroup>

              {type === "projects" && (
                <InputGroup label="Tech Stack (Press Enter to add)">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.techStack?.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-gray-800 text-blue-400 px-2 py-1 rounded text-sm flex items-center gap-1 border border-gray-700"
                      >
                        {tag}{" "}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3 hover:text-white" />
                        </button>
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

              {type === "projects" && (
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Repo URL">
                    <input
                      type="text"
                      value={formData.repoUrl || ""}
                      onChange={(e) => handleChange("repoUrl", e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </InputGroup>
                  <InputGroup label="Live URL">
                    <input
                      type="text"
                      value={formData.liveUrl || ""}
                      onChange={(e) => handleChange("liveUrl", e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </InputGroup>
                </div>
              )}

              {type.includes("Blog") && (
                <InputGroup label="Full Content (Rich Text)">
                  <RichTextEditor
                    value={formData.content || ""}
                    onChange={(html) => handleChange("content", html)}
                  />
                </InputGroup>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3 bg-gray-950/30 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2.5 rounded-lg bg-prof-blue hover:bg-blue-600 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminSettingsView = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSaveCredentials = async () => {
    setMessage(null);

    if (!currentPassword) {
      setMessage({ type: "error", text: "Mevcut şifrenizi girin." });
      return;
    }
    if (!newUsername && !newPassword) {
      setMessage({ type: "error", text: "En az bir alanı değiştirin." });
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Yeni şifre en az 6 karakter olmalı.",
      });
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Şifreler eşleşmiyor." });
      return;
    }

    setSaving(true);
    try {
      const payload: any = { currentPassword };
      if (newUsername) payload.username = newUsername;
      if (newPassword) payload.password = newPassword;

      await api.updateAdminCredentials(payload);

      setMessage({ type: "success", text: "Bilgiler başarıyla güncellendi!" });
      setCurrentPassword("");
      setNewUsername("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Güncelleme hatası." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-prof-blue/10 border border-prof-blue/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-prof-blue" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Ayarlar</h1>
          <p className="text-gray-400 text-sm mt-1">
            Admin hesap bilgilerinizi güncelleyin.
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-prof-blue" />
            Hesap Bilgileri
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Kullanıcı adı ve şifrenizi değiştirin.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Current Password - Required for any change */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
              <span className="text-red-400">*</span> Mevcut Şifre
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`${INPUT_CLASS} pl-10 pr-12`}
                placeholder="Mevcut şifrenizi girin"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showCurrentPw ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-800" />

          {/* New Username */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 ml-1">
              Yeni Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className={`${INPUT_CLASS} pl-10`}
                placeholder="Boş bırakırsanız değişmez"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 ml-1">
              Yeni Şifre
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type={showNewPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${INPUT_CLASS} pl-10 pr-12`}
                placeholder="Min. 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showNewPw ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {newPassword && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-semibold text-gray-400 ml-1">
                Şifre Tekrar
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${INPUT_CLASS} pl-10 ${
                    confirmPassword && confirmPassword !== newPassword
                      ? "border-red-500/50 focus:ring-red-500"
                      : confirmPassword && confirmPassword === newPassword
                        ? "border-emerald-500/50 focus:ring-emerald-500"
                        : ""
                  }`}
                  placeholder="Yeni şifreyi tekrar girin"
                />
                {confirmPassword && confirmPassword === newPassword && (
                  <Check className="absolute right-3 top-3.5 w-5 h-5 text-emerald-400" />
                )}
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message.type === "success" ? (
                <Check className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              {message.text}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-800 bg-gray-950/30 flex justify-end">
          <button
            onClick={handleSaveCredentials}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-prof-blue hover:bg-blue-600 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Kaydediliyor..." : "Bilgileri Güncelle"}
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
