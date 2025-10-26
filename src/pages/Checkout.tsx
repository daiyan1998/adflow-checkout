import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Check, Star, ShieldCheck, Truck, RotateCcw, Lock, Package, Clock, Zap, Award, Users } from "lucide-react";

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
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes countdown

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const originalPrice = Math.round(product.price * 1.5);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const totalPrice = product.price * quantity;
  const totalOriginalPrice = originalPrice * quantity;

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Urgency Banner */}
          <div className="bg-destructive text-destructive-foreground text-center py-3 px-4 rounded-lg mb-6 animate-pulse">
            <div className="flex items-center justify-center gap-2 font-semibold">
              <Clock className="w-5 h-5" />
              <span>SPECIAL OFFER ENDS IN: {formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Main Hero */}
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
              Transform Your Life with {product.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Join thousands of satisfied customers who made the smart choice
            </p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 font-semibold">4.9/5 (2,847 reviews)</span>
            </div>
          </div>

          {/* Product Image & Offer */}
          <Card className="overflow-hidden mb-6">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img 
                  src={product.images[0]} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full font-bold">
                  {discount}% OFF
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground line-through">${originalPrice}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">${product.price}</span>
                    <span className="text-lg text-muted-foreground">Today Only!</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">{product.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Package className="w-4 h-4" />
                  <span>Only 23 left in stock!</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>347 people viewing this right now</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg">
              <ShieldCheck className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold">Secure Checkout</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg">
              <Truck className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold">Free Shipping</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg">
              <RotateCcw className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold">30-Day Returns</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg">
              <Award className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold">2-Year Warranty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-accent/30 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose {product.title}?</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Built to last with the finest materials and craftsmanship</p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Award-Winning Design</h3>
              <p className="text-sm text-muted-foreground">Recognized by industry experts for innovation and excellence</p>
            </Card>
            <Card className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Trusted by Thousands</h3>
              <p className="text-sm text-muted-foreground">Join our community of satisfied customers worldwide</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-4">"Absolutely love it! Best purchase I've made this year. Quality exceeded my expectations."</p>
              <p className="font-semibold text-sm">- Sarah M.</p>
            </Card>
            <Card className="p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-4">"Fast shipping, great customer service, and the product is exactly as described. Highly recommend!"</p>
              <p className="font-semibold text-sm">- Michael T.</p>
            </Card>
            <Card className="p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-4">"Worth every penny! I've already recommended it to all my friends and family."</p>
              <p className="font-semibold text-sm">- Jennifer L.</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="bg-gradient-to-b from-accent/30 to-background py-12">
        <div className="container max-w-4xl mx-auto px-4">

          <Card className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Claim Your Special Offer Now!</h2>
              <p className="text-muted-foreground">Fill in your details below to complete your order</p>
            </div>
          
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quantity Selector */}
              <div>
                <Label className="text-base font-semibold">Select Quantity</Label>
                <div className="flex items-center gap-4 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-3xl font-bold w-16 text-center">{quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {quantity > 1 && (
                    <span className="ml-4 text-sm font-semibold text-primary">
                      Save ${(totalOriginalPrice - totalPrice).toFixed(0)}!
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-base">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="John Doe"
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-base">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-base">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, City, State, ZIP"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-base">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border-2 border-primary/20">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original Price:</span>
                    <span className="line-through text-muted-foreground">${totalOriginalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Special Discount:</span>
                    <span className="text-destructive font-semibold">-${totalOriginalPrice - totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="text-primary font-semibold">FREE</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Today's Total:</span>
                      <span className="text-3xl font-bold text-primary">${totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-accent/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-semibold">100% Secure & Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RotateCcw className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-semibold">30-Day Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-semibold">Your Information is Protected</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-lg h-14 font-bold" 
                style={{
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-button)'
                }}
              >
                🎉 Complete Order - ${totalPrice}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </form>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">How long does shipping take?</AccordionTrigger>
              <AccordionContent>
                We offer free standard shipping which typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">What is your return policy?</AccordionTrigger>
              <AccordionContent>
                We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, simply return it within 30 days for a full refund, no questions asked.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Is this a one-time payment?</AccordionTrigger>
              <AccordionContent>
                Yes! This is a one-time payment with no hidden fees or recurring charges. The price you see is the price you pay.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">Is my payment information secure?</AccordionTrigger>
              <AccordionContent>
                Absolutely. We use industry-standard SSL encryption to protect your personal and payment information. Your data is completely secure with us.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">What if I have issues with my order?</AccordionTrigger>
              <AccordionContent>
                Our customer support team is here to help! Contact us anytime and we'll resolve any issues quickly. Your satisfaction is our top priority.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Don't Miss Out on This Limited Offer!</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Join thousands of satisfied customers and transform your life today
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Clock className="w-6 h-6 text-destructive" />
            <span className="text-2xl font-bold text-destructive">
              Offer Expires in {formatTime(timeLeft)}
            </span>
          </div>
          <Button 
            size="lg" 
            className="text-xl h-16 px-12 font-bold"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-button)'
            }}
            onClick={() => {
              document.getElementById('name')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          >
            Order Now - Save {discount}% Today!
          </Button>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
