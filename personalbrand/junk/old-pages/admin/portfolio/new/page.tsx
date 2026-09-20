import { PortfolioForm } from "@/components/admin/portfolio-form";

export default function NewPortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New portfolio item</h1>
      <PortfolioForm item={{ type: "own", title: "", description: "", url: "", image: "", tech_stack: "" }} />
    </div>
  );
}