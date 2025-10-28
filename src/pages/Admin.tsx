import { useState, useEffect } from "react";
import { storage, Order } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trash2, LogOut } from "lucide-react";
import { AdminProducts } from "./AdminProducts";

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      setOrders(storage.getOrders());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = storage.getAdminPassword();
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setOrders(storage.getOrders());
      toast({ title: "Welcome!", description: "Logged in successfully" });
    } else {
      toast({ 
        title: "Access Denied", 
        description: "Incorrect password",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleToggleProcessed = (orderId: string, currentStatus: boolean) => {
    storage.updateOrder(orderId, { processed: !currentStatus });
    setOrders(storage.getOrders());
    toast({ 
      title: currentStatus ? "Order unmarked" : "Order marked as processed",
      description: "Status updated"
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      storage.deleteOrder(orderId);
      setOrders(storage.getOrders());
      toast({ title: "Deleted", description: "Order removed" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
            <p className="text-sm text-muted-foreground text-center">
              Default password: admin123
            </p>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No orders yet</p>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className={`p-6 ${order.processed ? 'bg-muted' : ''}`}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{order.customerName}</h3>
                      <p className="text-sm text-muted-foreground">Phone: {order.phone}</p>
                      <p className="text-sm text-muted-foreground">Email: {order.email || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground mt-2">Address: {order.address}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Quantity: <span className="font-semibold">{order.quantity}</span></p>
                      <p className="text-sm">Total: <span className="font-semibold text-primary">${order.totalPrice}</span></p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant={order.processed ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleToggleProcessed(order.id, order.processed)}
                        >
                          {order.processed ? "Mark Unprocessed" : "Mark Processed"}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
