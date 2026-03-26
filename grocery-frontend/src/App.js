import { useState, useEffect } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const CATS = [
  {
    key: "Vegetables", label: "Vegetables", icon: "🥦",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&q=75",
    listImg: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&q=70",
    suggestions: ["Tomatoes","Onions","Potatoes","Spinach","Carrots","Cucumber","Capsicum","Brinjal","Lady Finger","Cabbage"],
  },
  {
    key: "Fruits", label: "Fruits", icon: "🍎",
    img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=120&q=75",
    listImg: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=80&q=70",
    suggestions: ["Bananas","Apples","Mangoes","Grapes","Oranges","Watermelon","Papaya","Pomegranate","Guava","Pineapple"],
  },
  {
    key: "Dairy", label: "Dairy", icon: "🥛",
    img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&q=75",
    listImg: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&q=70",
    suggestions: ["Milk","Curd","Paneer","Butter","Cheese","Ghee","Cream","Buttermilk","Khoa","Lassi"],
  },
  {
    key: "Meat", label: "Meat & Fish", icon: "🥩",
    img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=120&q=75",
    listImg: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=80&q=70",
    suggestions: ["Chicken","Eggs","Fish","Mutton","Prawns","Surmai","Rohu","Bombil","Keema","Turkey"],
  },
  {
    key: "Bakery", label: "Bakery", icon: "🍞",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&q=75",
    listImg: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&q=70",
    suggestions: ["Bread","Pav","Bun","Croissant","Cake","Cookies","Rusk","Sandwich Bread","Pita","Naan"],
  },
  {
    key: "Pantry", label: "Pantry", icon: "🫙",
    img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=120&q=75",
    listImg: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=80&q=70",
    suggestions: ["Rice","Atta","Dal","Sugar","Salt","Oil","Chana","Rajma","Poha","Sooji"],
  },
  {
    key: "Snacks", label: "Snacks", icon: "🍿",
    img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=120&q=75",
    listImg: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=80&q=70",
    suggestions: ["Chips","Namkeen","Biscuits","Popcorn","Murmura","Chivda","Nachos","Peanuts","Mathri","Chakli"],
  },
  {
    key: "Beverages", label: "Beverages", icon: "🧃",
    img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=120&q=75",
    listImg: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=80&q=70",
    suggestions: ["Tea","Coffee","Juice","Cold Drink","Coconut Water","Lassi","Chaas","Energy Drink","Mineral Water","Nimboo Pani"],
  },
];

const DELIVERY_STEPS = [
  { icon: "📦", label: "Warehouse",        sub: "Packed & Ready" },
  { icon: "🚚", label: "Out for Delivery", sub: "On the Way"     },
  { icon: "✅", label: "Delivered",        sub: "At Your Door"   },
];

const DELIVERY_STATUS = 1; // 0 = Warehouse, 1 = Out for Delivery, 2 = Delivered

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Find full category object by key
function getCatMeta(key) {
  return CATS.find((c) => c.key === key);
}

// Get just the emoji icon for a category
function getCatIcon(key) {
  return getCatMeta(key)?.icon ?? "📦";
}

// Get the small thumbnail image for a category
function getCatListImg(key) {
  return getCatMeta(key)?.listImg ?? null;
}

// Format date as "Monday, 25 March"
function formatDate(d) {
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

// Format date short as "Mon, 25 Mar"
function formatDateShort(d) {
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

// Group an array of items by their category field
function groupByCategory(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

// ─── Small Components ─────────────────────────────────────────────────────────

// Delivery progress tracker — compact (sidebar) or full (checkout)
function Tracker({ compact = false }) {
  return (
    <div style={compact ? styles.miniTrackerWrap : styles.fullTrackerWrap}>
      {/* Title label */}
      {compact
        ? <div style={styles.deliveryLabel}>Delivery Status</div>
        : <div style={styles.coTrackerTitle}>Delivery Status</div>
      }

      {/* Steps row */}
      <div style={styles.trackerRow}>
        {DELIVERY_STEPS.map((step, i) => {
          const isDone   = i < DELIVERY_STATUS;
          const isActive = i === DELIVERY_STATUS;

          // Build icon and label styles based on state
          const iconStyle = {
            ...(compact ? styles.dstepIcon : styles.tstepCircle),
            ...(isActive ? (compact ? styles.dstepIconActive : styles.tstepCircleActive) : {}),
            ...(isDone   ? (compact ? styles.dstepIconDone   : styles.tstepCircleDone)   : {}),
          };
          const labelStyle = {
            ...(compact ? styles.dstepLbl : styles.tstepName),
            ...(isActive ? (compact ? styles.dstepLblActive : styles.tstepNameActive) : {}),
          };

          return (
            <div key={i} style={styles.trackerFragment}>
              {/* Single step */}
              <div style={compact ? styles.miniStep : styles.fullStep}>
                <div style={iconStyle}>{step.icon}</div>
                <div style={labelStyle}>{step.label}</div>
                {/* Sub-status only shown in full (checkout) view */}
                {!compact && (
                  <div style={styles.tstepSub}>
                    {isActive ? "In Progress" : isDone ? "Done" : "Pending"}
                  </div>
                )}
              </div>

              {/* Connecting line between steps — green if done, animated if active */}
              {i < DELIVERY_STEPS.length - 1 && (
                <div style={{
                  ...styles.trackerLine,
                  ...(isDone   ? styles.trackerLineDone   : {}),
                  ...(isActive ? styles.trackerLineActive : {}),
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Small category thumbnail image with emoji fallback
function ItemThumb({ catKey, size = 44 }) {
  const [imgFailed, setImgFailed] = useState(false);
  const imgSrc = getCatListImg(catKey);
  const icon   = getCatIcon(catKey);

  // Show emoji if no image or image failed to load
  if (!imgSrc || imgFailed) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 10,
        background: "rgba(255,255,255,.07)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.45, flexShrink: 0,
      }}>
        {icon}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={catKey}
      loading="lazy"
      onError={() => setImgFailed(true)}
      style={{ width: size, height: size, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
    />
  );
}

// Stat card used in the sidebar (Pending / Bought / Total)
function StatCard({ value, label, color }) {
  return (
    <div style={styles.stat}>
      <div style={{ ...styles.sn, color }}>{value}</div>
      <div style={styles.sl}>{label}</div>
    </div>
  );
}

// Small tip row at the bottom of the add form
function Tip({ color, text }) {
  return (
    <div style={styles.tip}>
      <div style={{ ...styles.tipDot, background: color }} />
      {text}
    </div>
  );
}

// Category card in the grid (image + label)
function CatCard({ cat, selected, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="cat-card"
      onClick={() => onSelect(cat.key)}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}
    >
      <div
        className="cat-img-wrap"
        style={{
          width: 58, height: 58, borderRadius: 16, overflow: "hidden",
          border: selected ? "2px solid #2d6a4f" : "2px solid transparent",
          background: "#ece7dd",
          boxShadow: selected
            ? "0 0 0 3px rgba(45,106,79,.15), 0 3px 10px rgba(0,0,0,.08)"
            : "0 2px 6px rgba(0,0,0,.06)",
          transition: "all .16s",
        }}
      >
        {imgFailed
          ? <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              {cat.icon}
            </div>
          : <img
              src={cat.img}
              alt={cat.label}
              loading="lazy"
              onError={() => setImgFailed(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
        }
      </div>
      <div style={{
        fontSize: 10, fontWeight: selected ? 600 : 500,
        color: selected ? "#2d6a4f" : "#9a9080",
        textAlign: "center", lineHeight: 1.2,
      }}>
        {cat.label}
      </div>
    </div>
  );
}

// Small category preview shown above the item input form
function CatPreviewImg({ cat }) {
  const [imgFailed, setImgFailed] = useState(false);
  if (imgFailed) return <span style={{ fontSize: 26 }}>{cat.icon}</span>;
  return (
    <img
      src={cat.img}
      alt={cat.label}
      onError={() => setImgFailed(true)}
      style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover" }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GroceryManager() {
  // All grocery items
  const [items, setItems] = useState([]);

  // Which tab is active: "all" | "pending" | "done"
  const [tab, setTab] = useState("all");

  // Currently selected category key
  const [selectedCat, setSelectedCat] = useState(CATS[0].key);

  // Which right-panel view: "add" | "checkout"
  const [view, setView] = useState("add");

  // Whether to show the success overlay
  const [showSuccess, setShowSuccess] = useState(false);

  // Form field values
  const [itemName, setItemName] = useState("");
  const [itemQty,  setItemQty]  = useState("");
  const [itemUnit, setItemUnit] = useState("");

  const today = new Date();

  // Load items from server on mount
  useEffect(() => {
    fetch("/items")
      .then((res) => res.json())
      .then((result) => setItems(result.data));
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalCount   = items.length;
  const boughtCount  = items.filter((i) => i.purchased).length;
  const pendingCount = totalCount - boughtCount;
  const progressPct  = totalCount ? Math.round((boughtCount / totalCount) * 100) : 0;

  // ── CRUD actions ──────────────────────────────────────────────────────────

  async function addItem() {
    if (!itemName.trim()) return;

    const newItem = {
      name:     itemName.trim(),
      quantity: +itemQty || 1,
      unit:     itemUnit.trim() || "pcs",
      category: selectedCat,
    };

    const res    = await fetch("/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    const result = await res.json();

    if (result.success) {
      setItems((prev) => [result.data, ...prev]);
    }

    // Clear the form
    setItemName("");
    setItemQty("");
    setItemUnit("");
  }

  async function toggleItem(id, currentStatus) {
    const res    = await fetch(`/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchased: !currentStatus }),
    });
    const result = await res.json();

    if (result.success) {
      // Replace the updated item in state
      setItems((prev) => prev.map((item) => item._id === id ? result.data : item));
    }
  }

  async function deleteItem(id, e) {
    e.stopPropagation(); // Don't trigger the row's toggle click

    const res    = await fetch(`/items/${id}`, { method: "DELETE" });
    const result = await res.json();

    if (result.success) {
      setItems((prev) => prev.filter((item) => item._id !== id));
    }
  }

  // Delete all purchased items
  async function clearBought() {
    const boughtItems = items.filter((item) => item.purchased);
    for (const item of boughtItems) {
      await fetch(`/items/${item._id}`, { method: "DELETE" });
    }
    setItems((prev) => prev.filter((item) => !item.purchased));
  }

  // Show the success screen
  function placeOrder() {
    setShowSuccess(true);
  }

  // Delete all items and reset to add view
  async function closeSuccess() {
    for (const item of items) {
      await fetch(`/items/${item._id}`, { method: "DELETE" });
    }
    setShowSuccess(false);
    setView("add");
    setItems([]);
  }

  // ── Filtered & grouped list for display ───────────────────────────────────

  const filteredItems = items.filter((item) => {
    if (tab === "pending") return !item.purchased;
    if (tab === "done")    return item.purchased;
    return true; // "all"
  });

  const groupedItems = groupByCategory(filteredItems);
  const activeCat    = getCatMeta(selectedCat);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.14); border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(7px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn  { from { opacity:0; transform:scale(.85); }     to { opacity:1; transform:scale(1);   } }
        .item-row { animation: fadeUp .2s ease both; }
        .item-row:hover { background: rgba(255,255,255,.15) !important; border-color: rgba(255,255,255,.15) !important; transform: translateX(2px); }
        .sugg-chip:hover { background: #2d6a4f !important; color: #fff !important; border-color: #2d6a4f !important; }
        .tab-btn:hover:not(.tab-active) { border-color: rgba(255,255,255,.28) !important; color: rgba(255,255,255,.7) !important; }
        .clear-btn:hover { color: #e05c4a !important; border-color: rgba(224,92,74,.4) !important; }
        .del-btn:hover { color: #e05c4a !important; background: rgba(224,92,74,.15) !important; }
        .checkout-btn:hover { background: #2d6a4f !important; }
        .btn-add:hover { background: #2d6a4f !important; transform: translateY(-1px); }
        .place-btn:hover { background: #2d6a4f !important; transform: translateY(-1px); }
        .back-btn:hover { border-color: #1a1814 !important; color: #1a1814 !important; }
        .cat-card:hover .cat-img-wrap { transform: translateY(-3px); }
        input:focus { border-color: #2d6a4f !important; box-shadow: 0 0 0 3px rgba(45,106,79,.09) !important; }
        .success-card { animation: popIn .3s cubic-bezier(.34,1.56,.64,1); }
        @keyframes shimmer { 0%,100% { background-position: 200% center; } 50% { background-position: 0% center; } }
      `}</style>

      {/* ══ LEFT SIDEBAR ══ */}
      <div style={styles.left}>
        <div style={styles.leftBg} />

        {/* Brand + date */}
        <div style={styles.leftHead}>
          <div style={styles.brand}>CART<span style={{ color: "#a8e063" }}>.</span></div>
          <div style={styles.dateLbl}>{formatDate(today)}</div>
        </div>

        {/* Stats: pending / bought / total */}
        <div style={styles.statsGrid}>
          <StatCard value={pendingCount} label="Pending" color="#ff9080" />
          <StatCard value={boughtCount}  label="Bought"  color="#a8e063" />
          <StatCard value={totalCount}   label="Total"   color="#fff"    />
        </div>

        {/* Progress bar */}
        <div style={styles.progWrap}>
          <div style={styles.progTop}>
            <span style={styles.progTitle}>Progress</span>
            <span style={styles.progPct}>{progressPct}%</span>
          </div>
          <div style={styles.progTrack}>
            <div style={{ ...styles.progFill, width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Mini delivery tracker strip */}
        <div style={styles.deliveryStrip}>
          <Tracker compact />
        </div>

        {/* All / Pending / Bought tabs + Clear button */}
        <div style={styles.tabsRow}>
          {["all", "pending", "done"].map((t) => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? "tab-active" : ""}`}
              onClick={() => setTab(t)}
              style={{ ...styles.tabBtn, ...(tab === t ? styles.tabBtnActive : {}) }}
            >
              {t === "all" ? "All" : t === "pending" ? "Pending" : "Bought"}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="clear-btn" onClick={clearBought} style={styles.clearBtn}>
            Clear bought
          </button>
        </div>

        {/* Scrollable item list */}
        <div style={styles.listScroll}>
          {Object.keys(groupedItems).length === 0 ? (
            // Empty state
            <div style={styles.emptyState}>
              <img
                style={styles.emptyImg}
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=220&q=75"
                alt="empty cart"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div style={styles.emptyTxt}>
                {tab === "all"     ? "Basket is empty.\nAdd items →"
               : tab === "pending" ? "All done! 🎉"
               :                    "Nothing bought yet."}
              </div>
            </div>
          ) : (
            // Items grouped by category
            Object.entries(groupedItems).map(([cat, catItems]) => (
              <div key={cat}>
                {/* Category heading */}
                <div style={styles.catHead}>
                  <span>{getCatIcon(cat)}</span>
                  {cat}
                  <div style={styles.catHeadLine} />
                </div>

                {/* Items in this category */}
                {catItems.map((item, idx) => (
                  <div
                    key={item._id}
                    className="item-row"
                    onClick={() => toggleItem(item._id, item.purchased)}
                    style={{
                      ...styles.itemRow,
                      ...(item.purchased ? styles.itemRowDone : {}),
                      animationDelay: `${idx * 0.04}s`,
                    }}
                  >
                    <ItemThumb catKey={item.category} />

                    {/* Checkbox */}
                    <div style={{ ...styles.chk, ...(item.purchased ? styles.chkOn : {}) }}>
                      {item.purchased && (
                        <svg width="10" height="8" fill="none" viewBox="0 0 10 8">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#1b4332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    {/* Name + qty/unit */}
                    <div style={styles.iDetail}>
                      <div style={{ ...styles.iName, ...(item.purchased ? styles.iNameDone : {}) }}>
                        {item.name}
                      </div>
                      <div style={styles.iMeta}>{item.quantity} {item.unit}</div>
                    </div>

                    {/* Delete button */}
                    <button
                      className="del-btn"
                      onClick={(e) => deleteItem(item._id, e)}
                      style={styles.delBtn}
                    >✕</button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div style={styles.right}>

        {/* ADD VIEW */}
        {view === "add" && (
          <div style={styles.view}>

            {/* Top bar */}
            <div style={styles.topbar}>
              <div style={styles.pageTitle}>Add Grocery Items</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={styles.datePill}>{formatDateShort(today)}</div>
                <button className="checkout-btn" onClick={() => setView("checkout")} style={styles.checkoutBtn}>
                  🛒 Checkout
                </button>
              </div>
            </div>

            {/* Category grid */}
            <div style={styles.catSection}>
              <div style={styles.sectionTitle}>Choose Category</div>
              <div style={styles.catGrid}>
                {CATS.map((c) => (
                  <CatCard
                    key={c.key}
                    cat={c}
                    selected={selectedCat === c.key}
                    onSelect={setSelectedCat}
                  />
                ))}
              </div>
            </div>

            <div style={styles.divider} />

            {/* Quick suggestion chips */}
            <div style={styles.suggSection}>
              <div style={{ ...styles.sectionTitle, marginBottom: 8 }}>
                Quick Add — <span>{activeCat?.label}</span>
              </div>
              <div style={styles.suggStrip}>
                {activeCat?.suggestions.map((s) => (
                  <button
                    key={s}
                    className="sugg-chip"
                    onClick={() => setItemName(s)}
                    style={styles.suggChip}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div style={styles.divider} />

            {/* Add item form */}
            <div style={styles.formArea}>
              <div style={styles.formTitle}>Item Details</div>

              {/* Selected category preview */}
              {activeCat && (
                <div style={styles.selPreview}>
                  <CatPreviewImg cat={activeCat} />
                  <div>
                    <div style={styles.selPreviewTxt}>{activeCat.label}</div>
                    <div style={styles.selPreviewSub}>Selected category</div>
                  </div>
                </div>
              )}

              {/* Name / Qty / Unit inputs */}
              <div style={styles.formRow}>
                <input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  placeholder="Item name (e.g. Tomatoes, Whole Milk…)"
                  style={styles.input}
                />
                <input
                  value={itemQty}
                  onChange={(e) => setItemQty(e.target.value)}
                  type="number"
                  min="1"
                  placeholder="Qty"
                  style={{ ...styles.input, width: 76 }}
                />
                <input
                  value={itemUnit}
                  onChange={(e) => setItemUnit(e.target.value)}
                  placeholder="Unit"
                  style={{ ...styles.input, width: 88 }}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <button className="btn-add" onClick={addItem} style={styles.btnAdd}>
                  ＋ Add to List
                </button>
              </div>

              {/* Helpful tips */}
              <div style={styles.tips}>
                <Tip color="#82c93e" text="Click item to mark bought" />
                <Tip color="#ff9080" text="✕ removes item"           />
                <Tip color="#e8a020" text="Enter to add fast"         />
              </div>
            </div>
          </div>
        )}

        {/* CHECKOUT VIEW */}
        {view === "checkout" && (
          <div style={styles.view}>

            {/* Top bar */}
            <div style={styles.coTopbar}>
              <button className="back-btn" onClick={() => setView("add")} style={styles.backBtn}>
                ← Back
              </button>
              <div style={styles.coTitle}>Order Summary</div>
            </div>

            <div style={styles.coBody}>
              {/* Full delivery tracker */}
              <Tracker compact={false} />

              <div style={{ ...styles.coSectionTitle, marginTop: 16 }}>
                Items ({items.length})
              </div>

              {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0", color: "#9a9080", fontSize: 13 }}>
                  No items in cart yet.
                </div>
              ) : (
                // Items grouped by category
                Object.entries(groupByCategory(items)).map(([cat, catItems]) => (
                  <div key={cat}>
                    <div style={{ ...styles.coSectionTitle, marginTop: 16 }}>
                      {getCatIcon(cat)} {cat}
                    </div>
                    {catItems.map((item) => (
                      <div key={item._id} style={styles.coItem}>
                        <ItemThumb catKey={item.category} size={42} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={styles.coName}>{item.name}</div>
                          <div style={styles.coMeta}>{item.quantity} {item.unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}

              {/* Bill summary + place order */}
              <div style={styles.billBox}>
                <div style={styles.billRow}>
                  <span style={styles.billTotal}>Total Items</span>
                  <span style={styles.billTotalAmt}>{items.length}</span>
                </div>
                <button className="place-btn" onClick={placeOrder} style={styles.placeBtn}>
                  Place Order →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ SUCCESS OVERLAY ══ */}
      {showSuccess && (
        <div style={styles.successOverlay}>
          <div className="success-card" style={styles.successCard}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
            <div style={styles.successTitle}>Order Placed!</div>
            <div style={styles.successSub}>
              Your groceries are confirmed.<br/>We're packing your order right now.
            </div>
            <button onClick={closeSuccess} style={styles.successClose}>
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  app: {
    display: "grid", gridTemplateColumns: "400px 1fr", height: "100vh",
    overflow: "hidden", fontFamily: "'Inter', sans-serif",
    background: "#f6f2ec", color: "#1a1814",
  },

  // LEFT SIDEBAR
  left: {
    background: "#1b4332", display: "flex", flexDirection: "column",
    overflow: "hidden", position: "relative",
  },
  leftBg: {
    position: "absolute", inset: 0, pointerEvents: "none",
    background: `
      radial-gradient(ellipse 60% 40% at 10% 90%, rgba(130,201,62,.16) 0%, transparent 60%),
      radial-gradient(ellipse 50% 30% at 90%  5%, rgba(255,255,255,.06) 0%, transparent 55%)
    `,
  },
  leftHead: {
    padding: "24px 24px 18px", flexShrink: 0, position: "relative", zIndex: 2,
    borderBottom: "1px solid rgba(255,255,255,.08)",
  },
  brand: { fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: -1 },
  dateLbl: { fontSize: 11.5, color: "rgba(255,255,255,.35)", marginTop: 3 },

  statsGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
    padding: "16px 24px 0", flexShrink: 0, position: "relative", zIndex: 2,
  },
  stat: {
    background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 14, padding: "12px 14px",
  },
  sn: { fontSize: 26, fontWeight: 700, lineHeight: 1 },
  sl: { fontSize: 10, color: "rgba(255,255,255,.32)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 3, fontWeight: 600 },

  progWrap: { padding: "14px 24px 0", flexShrink: 0, position: "relative", zIndex: 2 },
  progTop:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 },
  progTitle: { fontSize: 10, color: "rgba(255,255,255,.32)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600 },
  progPct:   { fontSize: 13, fontWeight: 700, color: "#a8e063" },
  progTrack: { height: 4, background: "rgba(255,255,255,.1)", borderRadius: 99, overflow: "hidden" },
  progFill:  { height: "100%", background: "linear-gradient(90deg,#82c93e,#a8e063)", borderRadius: 99, transition: "width .5s cubic-bezier(.4,0,.2,1)" },

  deliveryStrip: {
    margin: "12px 24px 0", flexShrink: 0, position: "relative", zIndex: 2,
    background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 14, padding: "12px 16px",
  },
  deliveryLabel: { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,.32)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 },

  miniTrackerWrap: {},
  fullTrackerWrap: {
    background: "#fff", border: "1px solid #ddd5c5", borderRadius: 16, padding: "20px 24px", marginBottom: 20,
  },
  coTrackerTitle: { fontSize: 11, fontWeight: 600, color: "#9a9080", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 },

  trackerRow:     { display: "flex", alignItems: "center" },
  trackerFragment:{ display: "flex", alignItems: "center", flex: 1 },
  miniStep:       { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  fullStep:       { display: "flex", flexDirection: "column", alignItems: "center", gap: 5 },

  dstepIcon: {
    width: 30, height: 30, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
    border: "2px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.06)", transition: "all .4s",
  },
  dstepIconActive: { background: "#82c93e", borderColor: "#82c93e", boxShadow: "0 0 10px rgba(130,201,62,.4)" },
  dstepIconDone:   { background: "rgba(130,201,62,.2)", borderColor: "rgba(130,201,62,.4)" },
  dstepLbl:        { fontSize: 9, color: "rgba(255,255,255,.28)", fontWeight: 500, textAlign: "center", lineHeight: 1.2 },
  dstepLblActive:  { color: "#a8e063" },

  tstepCircle: {
    width: 40, height: 40, borderRadius: "50%", border: "2px solid #ddd5c5",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
    transition: "all .4s", background: "#ece7dd",
  },
  tstepCircleActive: { background: "#1b4332", borderColor: "#1b4332", boxShadow: "0 0 0 4px rgba(27,67,50,.12)" },
  tstepCircleDone:   { background: "#82c93e", borderColor: "#82c93e" },
  tstepName:         { fontSize: 11, fontWeight: 600, color: "#9a9080", textAlign: "center" },
  tstepNameActive:   { color: "#1b4332" },
  tstepSub:          { fontSize: 10, color: "#9a9080", textAlign: "center" },

  trackerLine:       { flex: 1, height: 2, background: "rgba(255,255,255,.1)", marginBottom: 14, transition: "background .4s" },
  trackerLineDone:   { background: "rgba(130,201,62,.4)" },
  trackerLineActive: {
    background: "linear-gradient(90deg, rgba(130,201,62,.4) 0%, rgba(130,201,62,.9) 50%, rgba(130,201,62,.4) 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s ease-in-out infinite",
  },

  tabsRow: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "12px 24px 8px", flexShrink: 0, position: "relative", zIndex: 2,
  },
  tabBtn: {
    padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
    border: "1.5px solid rgba(255,255,255,.13)", color: "rgba(255,255,255,.4)",
    background: "transparent", transition: "all .15s", fontFamily: "inherit",
  },
  tabBtnActive: { background: "#82c93e", color: "#1b4332", borderColor: "#82c93e" },
  clearBtn: {
    fontSize: 11, color: "rgba(255,255,255,.28)", cursor: "pointer", padding: "5px 11px",
    borderRadius: 99, border: "1.5px solid rgba(255,255,255,.1)", background: "transparent",
    transition: "all .15s", fontWeight: 500, fontFamily: "inherit",
  },

  listScroll: { flex: 1, overflowY: "auto", padding: "4px 24px 16px", position: "relative", zIndex: 2 },

  catHead: {
    fontSize: 10, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase",
    color: "rgba(255,255,255,.25)", margin: "14px 0 7px 2px",
    display: "flex", alignItems: "center", gap: 6,
  },
  catHeadLine: { flex: 1, height: 1, background: "rgba(255,255,255,.07)" },

  itemRow: {
    display: "flex", alignItems: "center", gap: 11, padding: "10px 11px",
    background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 14, marginBottom: 7, cursor: "pointer", transition: "all .16s",
  },
  itemRowDone: { opacity: 0.35 },

  chk: {
    width: 19, height: 19, borderRadius: 5, border: "1.5px solid rgba(255,255,255,.2)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .14s",
  },
  chkOn:     { background: "#82c93e", borderColor: "#82c93e" },
  iDetail:   { flex: 1, minWidth: 0 },
  iName:     { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.88)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  iNameDone: { textDecoration: "line-through" },
  iMeta:     { fontSize: 11, color: "rgba(255,255,255,.28)", marginTop: 2 },
  delBtn: {
    width: 22, height: 22, border: "none", background: "transparent", color: "rgba(255,255,255,.2)",
    cursor: "pointer", fontSize: 11, borderRadius: 5,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all .14s", flexShrink: 0, fontFamily: "inherit",
  },

  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "44px 20px", textAlign: "center" },
  emptyImg:   { width: 120, height: 120, borderRadius: 16, objectFit: "cover", opacity: 0.45 },
  emptyTxt:   { fontSize: 12.5, color: "rgba(255,255,255,.25)", lineHeight: 1.7 },

  // RIGHT PANEL
  right: { background: "#fdfaf6", display: "flex", flexDirection: "column", overflow: "hidden" },
  view:  { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" },

  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "22px 32px 18px", borderBottom: "1px solid #ddd5c5", flexShrink: 0,
  },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#1a1814", letterSpacing: "-.4px" },
  datePill: {
    fontSize: 12, color: "#9a9080", fontWeight: 500,
    background: "#ece7dd", border: "1px solid #ddd5c5", padding: "5px 14px", borderRadius: 99,
  },
  checkoutBtn: {
    fontSize: 13, fontWeight: 600, background: "#1b4332", color: "#fff",
    border: "none", padding: "7px 18px", borderRadius: 10, cursor: "pointer",
    transition: "all .15s", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
  },

  catSection:   { padding: "18px 32px 14px", flexShrink: 0 },
  sectionTitle: { fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#9a9080", marginBottom: 11 },
  catGrid:      { display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 10 },

  divider: { height: 1, background: "#ddd5c5", margin: "0 32px" },

  suggSection: { padding: "12px 32px 10px", flexShrink: 0 },
  suggStrip:   { display: "flex", gap: 7, flexWrap: "wrap" },
  suggChip: {
    padding: "5px 13px", background: "#ece7dd", border: "1.5px solid #ddd5c5",
    borderRadius: 99, fontSize: 11.5, fontWeight: 500, color: "#1a1814",
    cursor: "pointer", transition: "all .14s", fontFamily: "inherit",
  },

  formArea:  { flex: 1, padding: "14px 32px 18px", display: "flex", flexDirection: "column", overflow: "hidden" },
  formTitle: { fontSize: 15, fontWeight: 700, color: "#1a1814", marginBottom: 11, letterSpacing: "-.3px" },
  selPreview: {
    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
    background: "#eaf4ee", border: "1.5px solid rgba(45,106,79,.2)", borderRadius: 12, marginBottom: 11,
  },
  selPreviewTxt: { fontSize: 13, fontWeight: 600, color: "#2d6a4f" },
  selPreviewSub: { fontSize: 11, color: "#9a9080" },

  formRow: { display: "grid", gridTemplateColumns: "1fr 76px 88px", gap: 8, marginBottom: 8 },
  input: {
    background: "#fff", border: "1.5px solid #ddd5c5", borderRadius: 11, color: "#1a1814",
    fontFamily: "'Inter', sans-serif", fontSize: 13, padding: "11px 14px", outline: "none",
    transition: "border-color .15s, box-shadow .15s", width: "100%",
  },
  btnAdd: {
    background: "#1b4332", color: "#fff", border: "none", borderRadius: 11,
    padding: "11px 26px", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
    cursor: "pointer", transition: "all .18s", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 7, width: "100%",
    boxShadow: "0 3px 12px rgba(27,67,50,.22)",
  },
  tips: { display: "flex", gap: 18, marginTop: "auto", paddingTop: 12, borderTop: "1px solid #ddd5c5", flexShrink: 0 },
  tip:  { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9a9080" },
  tipDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },

  // CHECKOUT
  coTopbar: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "22px 32px 18px", borderBottom: "1px solid #ddd5c5", flexShrink: 0,
  },
  backBtn: {
    fontSize: 13, fontWeight: 600, color: "#9a9080", background: "transparent",
    border: "1.5px solid #ddd5c5", padding: "6px 14px", borderRadius: 9,
    cursor: "pointer", transition: "all .15s", fontFamily: "inherit",
  },
  coTitle:       { fontSize: 22, fontWeight: 700, color: "#1a1814", letterSpacing: "-.4px" },
  coBody:        { flex: 1, overflowY: "auto", padding: "20px 32px 28px" },
  coSectionTitle:{ fontSize: 11, fontWeight: 600, color: "#9a9080", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 },
  coItem:        { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #ddd5c5" },
  coName:        { fontSize: 13.5, fontWeight: 500, color: "#1a1814" },
  coMeta:        { fontSize: 11.5, color: "#9a9080" },

  billBox: { background: "#fff", border: "1px solid #ddd5c5", borderRadius: 16, padding: "20px 24px", marginTop: 20 },
  billRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: 13.5 },
  billTotal:    { fontSize: 17, fontWeight: 700, color: "#1a1814" },
  billTotalAmt: { fontSize: 17, fontWeight: 700, color: "#1b4332" },
  placeBtn: {
    width: "100%", marginTop: 16, padding: 15, background: "#1b4332", color: "#fff",
    border: "none", borderRadius: 13, fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700,
    cursor: "pointer", transition: "all .18s", boxShadow: "0 4px 14px rgba(27,67,50,.25)",
  },

  // SUCCESS OVERLAY
  successOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  successCard: {
    background: "#fff", borderRadius: 22, padding: "40px 44px", textAlign: "center", maxWidth: 380, width: "90%",
  },
  successTitle: { fontSize: 22, fontWeight: 700, color: "#1a1814", marginBottom: 6, letterSpacing: "-.4px" },
  successSub:   { fontSize: 13.5, color: "#9a9080", lineHeight: 1.6, marginBottom: 24 },
  successClose: {
    background: "#1b4332", color: "#fff", border: "none", borderRadius: 11,
    padding: "12px 32px", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
    cursor: "pointer", transition: "all .15s",
  },
};