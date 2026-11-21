import { DashboardLayout } from "@/components/DashboardLayout";
import { MessageSquarePlus } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ComplaintFeedbackForm } from "@/components/ComplaintFeedbackForm";

const Feedback = () => {
  return (
    <DashboardLayout>
      <PageShell icon={MessageSquarePlus} title="Feedback" description="Share your thoughts and suggestions with the Nexocart team.">
        <ComplaintFeedbackForm type="feedback" />
      </PageShell>
    </DashboardLayout>
  );
};

export default Feedback;
