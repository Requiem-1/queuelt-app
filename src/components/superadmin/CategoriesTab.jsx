import { Tag, Plus, Edit3, Trash2 } from 'lucide-react';

export const CategoriesTab = ({
  categories,
  onOpenAddModal,
  onEditCategory,
  onDeleteCategory,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Taxonomy & Categories</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Organize discovery classifications, badge tags, and industry sectors
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                  <Tag className="w-3 h-3 text-blue-500" />
                  {category.name}
                </span>
                <span className="text-[10px] font-bold text-zinc-400">
                  {category.venueCount || 0} Venues
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                {category.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => onEditCategory(category)}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 text-xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteCategory(category.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
