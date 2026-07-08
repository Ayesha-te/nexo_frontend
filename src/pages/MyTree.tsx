import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { GitBranch, User, ArrowLeft, TreePine } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { glassCardClass, PageShell } from "@/components/PageShell";

const MAX_VISIBLE_TREE_LEVEL = 4;

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

const findNodeById = (node: TreeNodeType | null | undefined, nodeId: string): TreeNodeType | null => {
  if (!node) return null;
  if (node.id === nodeId) return node;
  const leftResult = findNodeById(node.children.left, nodeId);
  if (leftResult) return leftResult;
  return findNodeById(node.children.right, nodeId);
};

const TreeNodeComponent = ({
  node,
  onNodeClick,
  selectedNodeId,
  currentUserId,
  level = 1,
}: {
  node: TreeNodeType;
  onNodeClick: (node: TreeNodeType, level: number) => void;
  selectedNodeId?: string;
  currentUserId?: string;
  level?: number;
}) => {
  const isCurrentUser = currentUserId === node.id;
  const hasChildren = Boolean(node.children.left || node.children.right);
  const isLevelLimit = level >= MAX_VISIBLE_TREE_LEVEL;
  const canOpenNextLevels = isLevelLimit && hasChildren;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => onNodeClick(node, level)}
        className={`relative min-h-[92px] w-[82px] rounded-lg border px-1.5 py-2 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:min-h-[132px] sm:w-[180px] sm:px-3 sm:py-3 ${
          isCurrentUser
            ? "nexo-gradient text-primary-foreground nexo-gold-glow"
            : node.position === "root"
            ? "bg-card border-border text-foreground"
            : node.position === "left"
            ? "bg-primary/10 border-primary/30 text-foreground"
            : "bg-secondary/10 border-secondary/30 text-foreground"
        } ${selectedNodeId === node.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
      >
        <div className="mb-1 flex items-center justify-center gap-1 sm:mb-2 sm:justify-between sm:gap-2">
          <span className="rounded bg-background/70 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide opacity-80 sm:px-2 sm:text-[10px]">
            L{level}
          </span>
          <span className="hidden rounded bg-background/70 px-2 py-0.5 text-[10px] font-semibold capitalize opacity-80 sm:inline">
            {node.position}
          </span>
        </div>
        <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 sm:mb-2 sm:h-8 sm:w-8">
          <User className="h-3.5 w-3.5 opacity-70 sm:h-4 sm:w-4" />
        </div>
        <p className="truncate text-[10px] font-semibold sm:text-sm" title={node.name}>{node.name}</p>
        <p className="mt-1 truncate text-[8px] opacity-75 sm:text-[11px]" title={node.email}>{node.email}</p>
        <div className="mt-2 grid grid-cols-2 gap-1 text-[9px] sm:mt-3 sm:gap-2 sm:text-xs">
          <span className="rounded border border-primary/20 bg-primary/15 px-1 py-0.5 sm:px-2 sm:py-1">L {getLeftCount(node)}</span>
          <span className="rounded border border-secondary/20 bg-secondary/15 px-1 py-0.5 sm:px-2 sm:py-1">R {getRightCount(node)}</span>
        </div>
        {canOpenNextLevels && (
          <p className="mt-1 rounded border border-primary/20 bg-background/80 px-1 py-0.5 text-[8px] font-semibold text-primary sm:mt-2 sm:px-2 sm:py-1 sm:text-[10px]">
            Open
          </p>
        )}
      </button>

      {hasChildren && !isLevelLimit && (
        <>
          <div className="h-4 w-px bg-border sm:h-7" />
          <div className="relative flex gap-2 sm:gap-10">
            {/* connector line */}
            <div className="absolute left-1/4 right-1/4 top-0 h-px bg-border" />
            <div className="flex flex-col items-center">
              <div className="h-3 w-px bg-border sm:h-4" />
              {node.children.left ? (
                <TreeNodeComponent
                  node={node.children.left}
                  onNodeClick={onNodeClick}
                  selectedNodeId={selectedNodeId}
                  currentUserId={currentUserId}
                  level={level + 1}
                />
              ) : (
                <div className="min-h-[70px] w-[76px] rounded-lg border border-dashed border-border px-2 py-4 text-center text-xs text-muted-foreground sm:min-h-[86px] sm:w-[150px] sm:px-4 sm:py-5 sm:text-sm">
                  Empty
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="h-3 w-px bg-border sm:h-4" />
              {node.children.right ? (
                <TreeNodeComponent
                  node={node.children.right}
                  onNodeClick={onNodeClick}
                  selectedNodeId={selectedNodeId}
                  currentUserId={currentUserId}
                  level={level + 1}
                />
              ) : (
                <div className="min-h-[70px] w-[76px] rounded-lg border border-dashed border-border px-2 py-4 text-center text-xs text-muted-foreground sm:min-h-[86px] sm:w-[150px] sm:px-4 sm:py-5 sm:text-sm">
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
  const [treeRootStack, setTreeRootStack] = useState<TreeNodeType[]>([]);

  useEffect(() => {
    api("/api/accounts/tree/")
      .then((fullTree) => {
        // Find the current user's node in the tree
        if (user?.id && fullTree) {
          const userNode = findNodeById(fullTree, user.id);
          if (userNode) {
            // Set the user's node as root with position "root" for display
            const userRoot = { ...userNode, position: "root" as const };
            setTree(userRoot);
            setTreeRootStack([userRoot]);
          } else {
            setTree(fullTree);
            setTreeRootStack([fullTree]);
          }
        } else {
          setTree(fullTree);
          if (fullTree) setTreeRootStack([fullTree]);
        }
      })
      .catch(() => {
        setTree(null);
        setTreeRootStack([]);
      });
  }, [user?.id]);

  const activeRoot = treeRootStack[treeRootStack.length - 1] ?? tree;
  const canGoBack = treeRootStack.length > 1;

  const handleNodeClick = (node: TreeNodeType, level: number) => {
    setSelectedUserNode(node);
    if (level >= MAX_VISIBLE_TREE_LEVEL && (node.children.left || node.children.right)) {
      setTreeRootStack((prev) => [...prev, { ...node, position: "root" as const }]);
      setSelectedUserNode(null);
    }
  };

  const handleBack = () => {
    setTreeRootStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    setSelectedUserNode(null);
  };

  return (
    <DashboardLayout>
      <PageShell
        icon={GitBranch}
        title="My Tree"
        description="Showing 4 levels at a time. Click a 4th-level account to open its next tree levels."
        maxWidth="max-w-7xl"
      >
        <div className="min-w-0 space-y-6">
          <Card className={glassCardClass}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Open Your Network Tree</h2>
                <p className="text-sm text-muted-foreground">Tap the button below, then click any 4th-level account to open its next tree levels.</p>
              </div>
              <Button
                type="button"
                className="gap-2 rounded-2xl"
                onClick={() => document.getElementById("binary-tree-view")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                <TreePine className="h-4 w-4" />
                Open My Tree
              </Button>
            </CardContent>
          </Card>

          {canGoBack && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Previous Tree
              </Button>
            </div>
          )}

          <Card id="binary-tree-view" className={`${glassCardClass} min-w-0`}>
            <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
              <CardTitle className="font-display text-base sm:text-lg">Binary Tree View</CardTitle>
              <p className="text-xs text-muted-foreground sm:text-sm">Showing 4 levels at a time. Click a 4th-level account to open its next tree levels.</p>
            </CardHeader>
            <CardContent className="min-w-0 px-1.5 pb-3 sm:px-6 sm:pb-6">
              <div className="w-full overflow-x-auto overflow-y-visible rounded-lg border border-border/40 bg-muted/20 py-4 [scrollbar-width:thin] sm:py-8">
                <div className="flex w-max min-w-[390px] justify-center px-3 sm:mx-auto sm:min-w-[720px] sm:px-6">
                  {activeRoot && (
                    <TreeNodeComponent
                      node={activeRoot}
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
            <Card className={glassCardClass}>
              <CardHeader>
                <CardTitle className="font-display text-lg">Selected Account</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Name: <span className="font-medium text-foreground">{selectedUserNode.name}</span> | Email: {" "}
                  <span className="font-medium text-foreground">{selectedUserNode.email}</span>
                </p>
              </CardHeader>
            </Card>
          )}
        </div>
      </PageShell>
    </DashboardLayout>
  );
};

export default MyTree;
