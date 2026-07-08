import { Images, Share2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const posters = [
  {
    title: "Networking Poster",
    description: "Use this poster when introducing Nexocart to new team members.",
    tone: "from-emerald-500 to-cyan-500",
  },
  {
    title: "Given Poster",
    description: "Share this poster with prospects who need a simple earning overview.",
    tone: "from-sky-500 to-violet-500",
  },
  {
    title: "Income System Poster",
    description: "Quickly explain binary set income, rewards, and team growth.",
    tone: "from-amber-400 to-emerald-500",
  },
];

const NetworkingPosters = () => {
  return (
    <DashboardLayout>
      <div className="relative -m-4 min-h-full overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(56,189,248,0.22),transparent_28%),linear-gradient(145deg,#caeee8_0%,#c7e5f3_48%,#e2f1f8_100%)] px-3 py-4 sm:px-6 md:-m-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(16,185,129,0.40)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto max-w-5xl space-y-4">
          <section className="rounded-[24px] border border-white/80 bg-white p-4 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.65)] sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Images className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Networking / Given Poster</p>
                <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Poster Records</h1>
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            {posters.map((poster) => (
              <Card key={poster.title} className="overflow-hidden rounded-[24px] border-white bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.75)]">
                <div className={`h-28 bg-gradient-to-br ${poster.tone}`} />
                <CardContent className="p-4">
                  <h2 className="font-display text-lg font-semibold text-slate-900">{poster.title}</h2>
                  <p className="mt-2 min-h-[60px] text-sm text-slate-500">{poster.description}</p>
                  <Button variant="outline" className="mt-4 w-full gap-2 rounded-2xl">
                    <Share2 className="h-4 w-4" />
                    View Poster
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NetworkingPosters;
