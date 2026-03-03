import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockAllUsers, User } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Users, Edit, Power } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([...mockAllUsers]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const { toast } = useToast();

  const toggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    toast({ title: "User Updated", description: "User status has been changed." });
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setEditEmail(user.email);
    setEditPhone(user.phone);
  };

  const saveEdit = () => {
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, email: editEmail, phone: editPhone } : u));
      toast({ title: "User Updated", description: `${editUser.firstName}'s info has been updated.` });
      setEditUser(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Manage Users
        </h1>

        <Card className="nexo-card-glow border-border/50">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Team (L/R)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.leftTeam}/{user.rightTeam}</TableCell>
                    <TableCell>
                      <Badge className={user.isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => openEdit(user)}>
                              <Edit className="w-3 h-3 mr-1" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User: {editUser?.firstName} {editUser?.lastName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                              </div>
                              <Button onClick={saveEdit} className="w-full nexo-gradient text-primary-foreground">Save Changes</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" onClick={() => toggleActive(user.id)} className={user.isActive ? "text-destructive" : "text-primary"}>
                          <Power className="w-3 h-3 mr-1" /> {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
