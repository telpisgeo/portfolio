import { notFound } from "next/navigation";
import { readCaseFile } from "@/lib/case-store";
import CaseEditorClient from "./CaseEditorClient";

export default async function AdminCaseEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseFile = readCaseFile(slug);
  if (!caseFile) notFound();

  return <CaseEditorClient slug={slug} initialCase={caseFile} />;
}
