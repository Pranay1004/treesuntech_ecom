import { useState, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, X, Save, Package, Image, Eye, EyeOff,
  Star, StarOff, ChevronDown,
} from 'lucide-react';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  type FirestoreProduct,
} from '@/lib/firestore';
import { useToast } from '@/context/ToastContext';

const EMPTY_PRODUCT: Omit<FirestoreProduct, 'id' | 'createdAt' | 'updatedAt'> = {
  slug: '',
  name: '',
  category: '',
  industry: [],
  material: 'PLA+',
  technology: 'FDM',
  finish: 'Standard',
  dimensions: '',
  tolerance: '±0.2mm',
  weight: '',
  leadTime: '3-5 days',
  price: 0,
  description: '',
  features: [''],
  applications: [''],
  images: [''],
  specifications: {},
  size: 'Medium',
  featured: false,
  active: true,
  stock: 10,
};

const CATEGORIES = [
  'Scale Models', 'Figurines & Art', 'Engineering Models', 'Automotive Models',
  'Consumer Products', 'Mechanical Parts', 'Tooling', 'Enclosures', 'Robotics',
  'Architecture', 'Personalized', 'UAV Components', 'Kitchen & Home',
  'Office & Home', 'Signage', 'Industrial Parts', 'Custom',
];

const MATERIALS = ['PLA+', 'ABS', 'PETG', 'TPU', 'Nylon', 'Carbon Fiber PLA', 'ASA', 'Resin', 'Wood PLA'];
const FINISHES = ['Standard', 'Painted', 'Sanded & Primed', 'Acetone Smoothed', 'Assembly Required', 'Polished', 'Raw'];

export default function ProductManager() {
  const { toast } = useToast();
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<(Omit<FirestoreProduct, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const prods = await getAllProducts();
      setProducts(prods);
    } catch {
      toast('Failed to load products', 'error');
    }
    setLoading(false);
  }

  function startAdd() {
    setEditProduct({ ...EMPTY_PRODUCT });
  }

  function startEdit(product: FirestoreProduct) {
    const { id, createdAt, updatedAt, ...rest } = product;
    setEditProduct({ id, ...rest });
  }

  async function handleSave() {
    if (!editProduct) return;
    if (!editProduct.name || !editProduct.slug || editProduct.price <= 0) {
      toast('Name, slug, and price are required', 'error');
      return;
    }

    setSaving(true);
    try {
      // Clean up empty array entries
      const cleaned = {
        ...editProduct,
        features: editProduct.features.filter(Boolean),
        applications: editProduct.applications.filter(Boolean),
        images: editProduct.images.filter(Boolean),
      };

      if (cleaned.id) {
        // Update
        const { id, ...data } = cleaned;
        await updateProduct(id!, data);
        toast('Product updated', 'success');
      } else {
        // Create
        await addProduct(cleaned);
        toast('Product added', 'success');
      }

      setEditProduct(null);
      await loadProducts();
    } catch (err: any) {
      toast(err.message || 'Failed to save product', 'error');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id);
      toast('Product deleted', 'success');
      setDeleteConfirm(null);
      await loadProducts();
    } catch {
      toast('Failed to delete product', 'error');
    }
  }

  async function toggleActive(product: FirestoreProduct) {
    if (!product.id) return;
    await updateProduct(product.id, { active: !product.active });
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p))
    );
  }

  async function toggleFeatured(product: FirestoreProduct) {
    if (!product.id) return;
    await updateProduct(product.id, { featured: !product.featured });
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, featured: !p.featured } : p))
    );
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Editor for array fields (features, applications, images)
  function ArrayEditor({
    label,
    values,
    onChange,
    placeholder,
  }: {
    label: string;
    values: string[];
    onChange: (vals: string[]) => void;
    placeholder: string;
  }) {
    return (
      <div>
        <label className="block text-sm text-slate-300 mb-1.5">{label}</label>
        {values.map((val, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={val}
              onChange={(e) => {
                const copy = [...values];
                copy[i] = e.target.value;
                onChange(copy);
              }}
              placeholder={placeholder}
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="text-red-400 hover:text-red-300 p-2"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ''])}
          className="text-xs text-primary-400 hover:text-primary-300 inline-flex items-center gap-1 mt-1"
        >
          <Plus size={12} /> Add
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Edit/Add Modal
  if (editProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">
            {editProduct.id ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={() => setEditProduct(null)} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Name *</label>
              <input
                value={editProduct.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEditProduct((p) =>
                    p ? { ...p, name, slug: p.slug || generateSlug(name) } : p
                  );
                }}
                placeholder="Product name"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Slug *</label>
              <input
                value={editProduct.slug}
                onChange={(e) =>
                  setEditProduct((p) => (p ? { ...p, slug: e.target.value } : p))
                }
                placeholder="product-url-slug"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Price (₹) *</label>
              <input
                type="number"
                value={editProduct.price || ''}
                onChange={(e) =>
                  setEditProduct((p) =>
                    p ? { ...p, price: Number(e.target.value) } : p
                  )
                }
                placeholder="999"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Stock</label>
              <input
                type="number"
                value={editProduct.stock || 0}
                onChange={(e) =>
                  setEditProduct((p) =>
                    p ? { ...p, stock: Number(e.target.value) } : p
                  )
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Lead Time</label>
              <input
                value={editProduct.leadTime}
                onChange={(e) =>
                  setEditProduct((p) => (p ? { ...p, leadTime: e.target.value } : p))
                }
                placeholder="3-5 days"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Category</label>
              <select
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct((p) => (p ? { ...p, category: e.target.value } : p))
                }
                className="input-field"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Material</label>
              <select
                value={editProduct.material}
                onChange={(e) =>
                  setEditProduct((p) => (p ? { ...p, material: e.target.value } : p))
                }
                className="input-field"
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Technology</label>
              <select
                value={editProduct.technology}
                onChange={(e) =>
                  setEditProduct((p) =>
                    p ? { ...p, technology: e.target.value as 'FDM' | 'SLA' | 'Resin' } : p
                  )
                }
                className="input-field"
              >
                <option value="FDM">FDM</option>
                <option value="SLA">SLA</option>
                <option value="Resin">Resin</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Finish</label>
              <select
                value={editProduct.finish}
                onChange={(e) =>
                  setEditProduct((p) => (p ? { ...p, finish: e.target.value } : p))
                }
                className="input-field"
              >
                {FINISHES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Dimensions</label>
              <input
                value={editProduct.dimensions}
                onChange={(e) =>
                  setEditProduct((p) => (p ? { ...p, dimensions: e.target.value } : p))
                }
                placeholder="220 × 160 × 65mm"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Size</label>
              <select
                value={editProduct.size}
                onChange={(e) =>
                  setEditProduct((p) =>
                    p ? { ...p, size: e.target.value as 'Small' | 'Medium' | 'Large' } : p
                  )
                }
                className="input-field"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Description</label>
            <textarea
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct((p) => (p ? { ...p, description: e.target.value } : p))
              }
              rows={3}
              placeholder="Product description..."
              className="input-field w-full"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-300">Featured</label>
              <button
                type="button"
                onClick={() =>
                  setEditProduct((p) => (p ? { ...p, featured: !p.featured } : p))
                }
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  editProduct.featured ? 'bg-primary-500' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    editProduct.featured ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-300">Active (visible on store)</label>
              <button
                type="button"
                onClick={() =>
                  setEditProduct((p) => (p ? { ...p, active: !p.active } : p))
                }
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  editProduct.active ? 'bg-primary-500' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    editProduct.active ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <ArrayEditor
            label="Images (URLs)"
            values={editProduct.images}
            onChange={(imgs) =>
              setEditProduct((p) => (p ? { ...p, images: imgs } : p))
            }
            placeholder="https://... or /products/image.webp"
          />

          <ArrayEditor
            label="Features"
            values={editProduct.features}
            onChange={(feats) =>
              setEditProduct((p) => (p ? { ...p, features: feats } : p))
            }
            placeholder="Key product feature"
          />

          <ArrayEditor
            label="Applications"
            values={editProduct.applications}
            onChange={(apps) =>
              setEditProduct((p) => (p ? { ...p, applications: apps } : p))
            }
            placeholder="Use case"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/5">
          <button
            onClick={() => setEditProduct(null)}
            className="px-5 py-2.5 text-sm border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {editProduct.id ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    );
  }

  // Product list
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{products.length} products in Firestore</p>
        <button onClick={startAdd} className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Package size={48} className="mx-auto mb-4 opacity-50" />
          <p className="mb-2">No products in Firestore yet</p>
          <p className="text-xs text-slate-600 mb-4">
            Products are currently loaded from hardcoded data. Add products to Firestore to manage them from here.
          </p>
          <button onClick={startAdd} className="btn-primary text-sm px-4 py-2">
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              className={`p-4 rounded-xl border transition-all ${
                product.active
                  ? 'bg-white/[0.02] border-white/10'
                  : 'bg-red-500/[0.02] border-red-500/10 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Image */}
                <div className="w-14 h-14 rounded-lg bg-surface-900 overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={20} className="text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-medium text-sm truncate">{product.name}</p>
                    {product.featured && (
                      <Star size={12} className="text-amber-400 flex-shrink-0" fill="currentColor" />
                    )}
                  </div>
                  <p className="text-slate-500 text-xs">
                    {product.category} · {product.material} · {product.technology}
                  </p>
                </div>

                {/* Price & Stock */}
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-semibold text-sm">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-slate-500 text-xs">
                    Stock: {product.stock ?? 'N/A'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleFeatured(product)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    title={product.featured ? 'Unfeature' : 'Feature'}
                  >
                    {product.featured ? (
                      <Star size={14} className="text-amber-400" fill="currentColor" />
                    ) : (
                      <StarOff size={14} className="text-slate-500" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleActive(product)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    title={product.active ? 'Hide' : 'Show'}
                  >
                    {product.active ? (
                      <Eye size={14} className="text-green-400" />
                    ) : (
                      <EyeOff size={14} className="text-red-400" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(product)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Pencil size={14} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id!)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* Delete confirmation */}
              {deleteConfirm === product.id && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-3">
                  <p className="text-red-400 text-xs flex-1">Delete "{product.name}" permanently?</p>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(product.id!)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
