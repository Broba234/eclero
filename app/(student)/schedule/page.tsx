import dynamic from "next/dynamic";

const StudentSelector = dynamic(
  () => import("@/components/StudentSchedule"),
  { ssr: false }
);

export default function StudentSchedulePage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Schedule (Student)</h1>
      <StudentSelector />
    </main>
  );
}
