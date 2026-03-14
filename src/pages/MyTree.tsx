import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { GitBranch, User, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type TreeNodeType = {
  id: string;
  name: string;
  email: string;
  position: "left" | "right" | "root";
  children: { left?: TreeNodeType | null; right?: TreeNodeType | null };
};

const countTeamMembers = (node: TreeNodeType | undefined): number => {
  if (!node) return 0;
  return 1 + countTeamMembers(node.children.left) + countTeamMembers(node.children.right);
};

const getLeftCount = (node: TreeNodeType): number => {
  return countTeamMembers(node.children.left);
};

const getRightCount = (node: TreeNodeType): number => {
  return countTeamMembers(node.children.right);
};

const TreeNodeComponent = ({
  node,
  onNodeClick,
  selectedNodeId,
  currentUserId,
}: {
  node: TreeNodeType;
  onNodeClick: (node: TreeNodeType) => void;
  selectedNodeId?: string;
  currentUserId?: string;
}) => {
  const isCurrentUser = currentUserId === node.id;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => onNodeClick(node)}
        className={`px-4 py-3 rounded-xl border text-center min-w-[170px] transition-all duration-200 hover:scale-105 ${
          isCurrentUser
            ? "nexo-gradient text-primary-foreground nexo-gold-glow"
            : node.position === "root"
            ? "bg-card border-border text-foreground"
            : node.position === "left"
            ? "bg-primary/10 border-primary/30 text-foreground"
            : "bg-secondary/10 border-secondary/30 text-foreground"
        } ${selectedNodeId === node.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
      >
        <User className="w-4 h-4 mx-auto mb-1 opacity-70" />
        <p className="text-sm font-semibold">{node.name}</p>
        <p className="text-[11px] opacity-80 break-all">{node.email}</p>
        <p className="text-xs opacity-60 capitalize mb-2">{node.position}</p>
        <div className="flex justify-center gap-2 text-xs">
          <span className="bg-primary/20 px-2 py-1 rounded">L: {getLeftCount(node)}</span>
          <span className="bg-secondary/20 px-2 py-1 rounded">R: {getRightCount(node)}</span>
        </div>
      </button>

      {(node.children.left || node.children.right) && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-8 relative">
            {/* connector line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-border" />
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-border" />
              {node.children.left ? (
                <TreeNodeComponent
                  node={node.children.left}
                  onNodeClick={onNodeClick}
                  selectedNodeId={selectedNodeId}
                  currentUserId={currentUserId}
                />
              ) : (
                <div className="px-4 py-3 rounded-xl border border-dashed border-border text-muted-foreground text-sm min-w-[120px] text-center">
                  Empty
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-border" />
              {node.children.right ? (
                <TreeNodeComponent
                  node={node.children.right}
                  onNodeClick={onNodeClick}
                  selectedNodeId={selectedNodeId}
                  currentUserId={currentUserId}
                />
              ) : (
                <div className="px-4 py-3 rounded-xl border border-dashed border-border text-muted-foreground text-sm min-w-[120px] text-center">
                  Empty
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MyTree = () => {
  const { user } = useAuth();
  const [selectedUserNode, setSelectedUserNode] = useState<TreeNodeType | null>(null);
  const [tree, setTree] = useState<TreeNodeType | null>(null);

  useEffect(() => {
    api("/api/accounts/tree/").then(setTree).catch(() => setTree(null));
  }, []);

  const handleNodeClick = (node: TreeNodeType) => {
    setSelectedUserNode(node);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          {selectedUserNode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedUserNode(null)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Main Tree
            </Button>
          )}
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-primary" />
            My Tree
          </h1>
        </div>

        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Binary Tree View</CardTitle>
            <p className="text-sm text-muted-foreground">Click any account to view its withdraw history and subtree snapshot.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto overflow-y-visible py-8 max-w-full">
              <div className="flex justify-center min-w-[600px] w-max mx-auto">
                {tree && (
                  <TreeNodeComponent
                    node={tree}
                    onNodeClick={handleNodeClick}
                    selectedNodeId={selectedUserNode?.id}
                    currentUserId={user?.id}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedUserNode && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg">Selected User Tree</CardTitle>
              <p className="text-sm text-muted-foreground">
                Name: <span className="font-medium text-foreground">{selectedUserNode.name}</span> | Email: {" "}
                <span className="font-medium text-foreground">{selectedUserNode.email}</span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto overflow-y-visible py-6 max-w-full">
                <div className="flex justify-center min-w-[600px] w-max mx-auto">
                  <TreeNodeComponent
                    node={selectedUserNode}
                    onNodeClick={handleNodeClick}
                    selectedNodeId={selectedUserNode.id}
                    currentUserId={user?.id}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTree;
