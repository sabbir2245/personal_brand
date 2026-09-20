import { EducationForm } from "@/components/admin/education-form";

export default function NewEducationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New education link</h1>
      <EducationForm item={{ title: "", description: "", url: "", sort_order: 0 }} />
    </div>
  );
}