import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Check } from "lucide-react";

const Checkout = () => {
  const { toast } = useToast();
  const product = storage.getProduct();
  
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    email: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const totalPrice = product.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.phone || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    storage.addOrder({
      ...formData,
      quantity,
      totalPrice
    });

    setSubmitted(true);
    
    toast({
      title: "Order Placed!",
      description: "We'll contact you shortly to confirm your order",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been received. We'll contact you shortly to confirm the details.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Place Another Order
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Product Section */}
        <Card className="mb-6 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img 
                src={product.images[0]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              <div className="text-3xl font-bold text-primary">${product.price}</div>
            </div>
          </div>
        </Card>

        {/* Order Form */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Complete Your Order</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantity Selector */}
            <div>
              <Label>Quantity</Label>
              <div className="flex items-center gap-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <Label htmlFor="address">Delivery Address *</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, City, State, ZIP"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            {/* Total Price */}
            <div className="bg-accent p-4 rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-2xl text-primary">${totalPrice}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full text-lg" style={{
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-button)'
            }}>
              Place Order Now
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
