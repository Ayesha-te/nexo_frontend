import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTree, TreeNode as TreeNodeType } from "@/lib/mock-data";
import { GitBranch, User } from "lucide-react";

const TreeNodeComponent = ({ node, depth = 0 }: { node: TreeNodeType; depth?: number }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`px-4 py-3 rounded-xl border text-center min-w-[120px] transition-all duration-200 hover:scale-105 ${
        node.position === "root"
          ? "nexo-gradient text-primary-foreground nexo-gold-glow"
          : node.position === "left"
          ? "bg-primary/10 border-primary/30 text-foreground"
          : "bg-secondary/10 border-secondary/30 text-foreground"
      }`}>
        <User className="w-4 h-4 mx-auto mb-1 opacity-70" />
        <p className="text-sm font-semibold">{node.name}</p>
        <p className="text-xs opacity-60 capitalize">{node.position}</p>
      </div>

      {(node.children.left || node.children.right) && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-8 relative">
            {/* connector line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-border" />
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-border" />
              {node.children.left ? (
                <TreeNodeComponent node={node.children.left} depth={depth + 1} />
              ) : (
                <div className="px-4 py-3 rounded-xl border border-dashed border-border text-muted-foreground text-sm min-w-[120px] text-center">
                  Empty
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-border" />
              {node.children.right ? (
                <TreeNodeComponent node={node.children.right} depth={depth + 1} />
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
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-primary" />
          My Tree
        </h1>

        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Binary Tree View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto py-8">
              <div className="flex justify-center min-w-[600px]">
                <TreeNodeComponent node={mockTree} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyTree;
