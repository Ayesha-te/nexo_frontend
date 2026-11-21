import { DashboardLayout } from "@/components/DashboardLayout";
import { AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ComplaintFeedbackForm } from "@/components/ComplaintFeedbackForm";

const Complaint = () => {
  return (
    <DashboardLayout>
      <PageShell icon={AlertTriangle} title="Complaint" description="Let us know about any issue so our team can resolve it quickly.">
        <ComplaintFeedbackForm type="complaint" />
      </PageShell>
    </DashboardLayout>
  );
};

export default Complaint;
