import { useState, useEffect } from "react";
import { storage, Product } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import { ProductForm } from "@/components/ProductForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      storage.updateProduct(editingProduct.id, productData);
      toast({ title: "Updated!", description: "Product updated successfully" });
    } else {
      storage.addProduct(productData as Omit<Product, 'id' | 'createdAt'>);
      toast({ title: "Created!", description: "Product created successfully" });
    }
    setProducts(storage.getProducts());
    setIsDialogOpen(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      storage.deleteProduct(id);
      setProducts(storage.getProducts());
      toast({ title: "Deleted", description: "Product removed" });
    }
  };

  const handleToggleActive = (id: string) => {
    storage.setActiveProduct(id);
    setProducts(storage.getProducts());
    toast({ title: "Updated", description: "Active product changed" });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products ({products.length})</h2>
        <Button onClick={handleAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No products yet</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className={`p-6 ${product.active ? 'border-primary border-2' : ''}`}>
              <div className="flex gap-4">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                      {product.active && (
                        <span className="text-xs text-primary font-semibold">Active on Checkout</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${product.price}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                  <div 
                    className="text-sm text-muted-foreground line-clamp-2 prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant={product.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleActive(product.id)}
                    >
                      {product.active ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                      {product.active ? "Active" : "Set Active"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingProduct(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
