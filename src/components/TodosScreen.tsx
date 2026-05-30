import React, { useState } from "react";
import { 
  ShoppingBag, Trash2, Plus, Tag, Search, CheckCircle2, 
  Circle, ArrowLeft, Archive, Grid, Sparkles, AlertCircle 
} from "lucide-react";
import { PantryItem, ItemCategory } from "../types";
import { ITEM_PRESETS } from "../presets";

interface TodosScreenProps {
  pantryItems: PantryItem[];
  onAddItem: (item: Omit<PantryItem, "id" | "updatedAt" | "lastUpdatedBy">) => void;
  onToggleItemNeeded: (id: string) => void;
  onToggleItemBought: (id: string) => void;
  onDeleteItem: (id: string) => void;
  activeCartState: boolean; // Managed by parent or tab
  setActiveCartState: (active: boolean) => void;
  osStyle: "ios" | "android";
}

const CATEGORY_PILLS: (ItemCategory | "All")[] = [
  "All", "Produce", "Dairy", "Bakery", "Household", "Meat", "Snacks", "Other"
];

export default function TodosScreen({
  pantryItems,
  onAddItem,
  onToggleItemNeeded,
  onToggleItemBought,
  onDeleteItem,
  activeCartState,
  setActiveCartState,
  osStyle,
}: TodosScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | "All">("All");

  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>("Produce");
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState("pcs");

  const handleCreateCustomItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nameToUse = newItemName.trim() || searchQuery.trim();
    if (!nameToUse) return;

    onAddItem({
      name: nameToUse,
      category: newItemCategory,
      quantity: newItemQty,
      unit: newItemUnit,
      isNeeded: true, // Default to Shopping Cart immediately
      isBought: false
    });

    // Reset Form
    setNewItemName("");
    setSearchQuery("");
    setNewItemQty(1);
    setNewItemUnit("pcs");
  };

  const handleAddPreset = (preset: { name: string; category: ItemCategory; unit: string }) => {
    // Check if item already exists
    const existing = pantryItems.find(item => item.name.toLowerCase() === preset.name.toLowerCase());
    if (existing) {
      if (!existing.isNeeded) {
        onToggleItemNeeded(existing.id);
      }
    } else {
      onAddItem({
        name: preset.name,
        category: preset.category,
        quantity: 1,
        unit: preset.unit,
        isNeeded: true,
        isBought: false
      });
    }
  };

  // Filter criteria
  const filteredPantry = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Shopping Cart items (isNeeded is true)
  const shoppingCartItems = pantryItems.filter(item => item.isNeeded);

  const brandColor = osStyle === "android" ? "#2E7D32" : "#2E7D32";

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] relative">
      {/* HEADER SECTION (Top Bar titles synced with Cart state) */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10 shrink-0 flex flex-col gap-3">
        {activeCartState ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCartState(false)}
              className="text-green-700 bg-transparent border-0 font-sans font-semibold text-xs flex items-center gap-1 cursor-pointer py-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Pantry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveCartState(false)}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                !activeCartState ? "bg-white text-gray-950 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Pantry Inventory
            </button>
            <button
              onClick={() => setActiveCartState(true)}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                activeCartState ? "bg-white text-gray-950 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Shopping Cart ({shoppingCartItems.length})
            </button>
          </div>
        )}

        {/* Search bar inside header tab */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder={activeCartState ? "Search shopping list..." : "Search pantry inventory..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-100 bg-gray-100/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition"
          />
        </div>
      </div>

      {/* RENDER VIEW: SHOPPING CART BLOCK */}
      {activeCartState ? (
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4 pb-20">
          {/* Quick Preset Scroll list */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider font-semibold ml-1">
              Tap-to-Add Suggestions Presets
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
              {ITEM_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="flex items-center gap-1 bg-white border border-gray-150 text-gray-700 px-3 py-2 rounded-xl text-xs font-sans shrink-0 hover:bg-green-50/20 active:scale-95 transition cursor-pointer shadow-2xs snap-start"
                >
                  <Plus className="w-3 h-3 text-green-700 font-bold" />
                  <span>{preset.name}</span>
                  <span className="text-[9px] text-gray-400 font-mono">({preset.unit})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actual Cart checklist */}
          <div className="flex flex-col gap-3 mt-1">
            <h4 className="text-xs font-mono uppercase text-gray-500 tracking-wider font-semibold ml-1">
              Active Shopping Checklist
            </h4>

            <div className="flex flex-col gap-2">
              {shoppingCartItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-4 shadow-xs transition ${
                    item.isBought ? "opacity-60 bg-gray-50/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleItemBought(item.id)}
                      className="border-0 bg-transparent text-gray-400 hover:text-green-700 cursor-pointer p-0.5 transition shrink-0"
                    >
                      {item.isBought ? (
                        <CheckCircle2 className="w-5 h-5 text-green-700 fill-green-150 bg-green-50 rounded-full" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>

                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-sans font-semibold text-gray-950 truncate max-w-[170px] ${
                        item.isBought ? "line-through text-gray-400" : ""
                      }`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {item.category} • Required: {item.quantity} {item.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleItemNeeded(item.id)}
                      className="text-xs font-mono bg-gray-100 hover:bg-gray-200 text-gray-650 px-2 py-1 rounded-lg border-0 cursor-pointer transition select-none flex items-center gap-1 text-[10px]"
                      title="Move back to pantry stock"
                    >
                      <Archive className="w-3 h-3 text-gray-500" /> Keep Stock
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-gray-300 hover:text-red-500 border-0 bg-transparent p-1 cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {shoppingCartItems.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-sans italic">
                  Shopping basket is empty! Browse pantry or suggestions to add list items.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* RENDER VIEW: PANTRY INVENTORY BLOCK */
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4 pb-20">
          {/* Category Filter Pills scroll */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1.5 shrink-0 snap-x">
            {CATEGORY_PILLS.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setSelectedCategory(pill)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition shrink-0 select-none cursor-pointer snap-start ${
                  selectedCategory === pill
                    ? "bg-green-800 text-white shadow-xs"
                    : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                }`}
                style={selectedCategory === pill ? { backgroundColor: brandColor } : {}}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* List items block */}
          <div className="flex flex-col gap-2">
            {filteredPantry.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-4 shadow-xs hover:border-gray-150 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-700 shrink-0 font-bold font-mono text-xs">
                    {item.category[0]}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-gray-950 truncate max-w-[155px]">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Category: {item.category} • In stock: {item.quantity} {item.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleItemNeeded(item.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold select-none cursor-pointer border-0 transition text-center text-[10px] ${
                      item.isNeeded 
                        ? "bg-orange-50 text-orange-650" 
                        : "bg-green-700 hover:bg-green-800 text-white"
                    }`}
                    style={!item.isNeeded ? { backgroundColor: brandColor } : {}}
                  >
                    {item.isNeeded ? "🛒 In Cart" : "Add cart"}
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-gray-300 hover:text-red-500 border-0 bg-transparent p-1 cursor-pointer transition select-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredPantry.length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-sans italic">
                Blank list. Create an item below or tap of recommendations categories.
              </div>
            )}
          </div>

          {/* Custom quick-add container */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold text-gray-700 flex items-center gap-1 uppercase">
              <Plus className="w-4 h-4 text-green-750" /> Add Custom Product
            </h4>

            <form onSubmit={handleCreateCustomItem} className="flex flex-col gap-2.5">
              <input
                type="text"
                required
                placeholder="Product name e.g. Broccoli"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                  className="text-xs border border-gray-200 rounded-xl px-2 py-2 focus:outline-none"
                >
                  <option value="Produce">Produce</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Household">Household</option>
                  <option value="Meat">Meat</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Other">Other</option>
                </select>

                <div className="flex gap-1">
                  <input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value) || 1)}
                    className="w-12 border border-gray-200 rounded-xl py-2 text-center text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="pcs"
                    className="w-full border border-gray-200 rounded-xl px-2 py-2 text-center text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-center text-white py-2 rounded-xl text-xs font-semibold cursor-pointer select-none transition bg-green-700 hover:bg-green-800"
                style={{ backgroundColor: brandColor }}
              >
                Incorporate custom item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC CART FLOATING ACTION BUTTON */}
      {!activeCartState && (
        <button
          onClick={() => {
            if (searchQuery.trim()) {
              handleCreateCustomItem();
            } else {
              setActiveCartState(true);
            }
          }}
          className="absolute bottom-4 right-4 text-white p-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer select-none flex items-center justify-center gap-1 shrink-0 z-20 font-sans"
          style={{ backgroundColor: brandColor }}
        >
          {searchQuery.trim() ? (
            <>
              <Plus className="w-5 h-5" />
              <span className="text-xs font-semibold px-0.5">Add "{searchQuery}"</span>
            </>
          ) : (
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {shoppingCartItems.length > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white rounded-full text-[9px] w-4.5 h-4.5 font-bold flex items-center justify-center border border-white">
                  {shoppingCartItems.length}
                </span>
              )}
            </div>
          )}
        </button>
      )}
    </div>
  );
}
