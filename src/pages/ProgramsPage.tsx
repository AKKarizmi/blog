import { PublishedPrograms } from "../features/EducationPublic";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ServicesSection } from "../components/ServicesSection";
import { AnnouncementSection } from "../components/AnnouncementSection";
import { AppLink } from "../components/ui/AppLink";
import { fetchJson } from "../services/api";

type Course = {
  id: number;
  name: string;
  description: string;
  subject: string;
  delivery: string;
  modules: string[];
  teacher: { fullName: string } | null;
};
function useRemote<T>(path: string) {
  const [state, setState] = useState<{
    loading: boolean;
    error: boolean;
    data?: T;
  }>({ loading: true, error: false });
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, error: false });
    fetchJson<T>(path, { signal: controller.signal })
      .then((data) => setState({ loading: false, error: false, data }))
      .catch(() => {
        if (!controller.signal.aborted)
          setState({ loading: false, error: true });
      });
    return () => controller.abort();
  }, [path]);
  return state;
}
export function ProgramsPage() {
  return (
    <main tabIndex={-1} className="pt-28">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-4xl font-bold">Programs & Opportunities</h1>
        <p className="mt-4">
          Explore FOROZ programs and approved educational offerings.
        </p>
      </div>
      <ServicesSection dedicated />
      <PublishedPrograms />
      <AnnouncementSection />
    </main>
  );
}

export function CoursePage() {
  const { id } = useParams();
  const state = useRemote<Course>(
    `/v1/courses/${encodeURIComponent(id || "")}/`,
  );
  return (
    <main tabIndex={-1} className="mx-auto max-w-4xl px-6 py-32">
      <AppLink href="/programs">← Programs & Opportunities</AppLink>
      {state.loading ? (
        <p role="status">Loading course…</p>
      ) : state.error || !state.data ? (
        <p role="alert">This course is unavailable or could not be loaded.</p>
      ) : (
        <article>
          <h1 className="mt-8 text-4xl font-bold">{state.data.name}</h1>
          <p className="mt-4 whitespace-pre-line">{state.data.description}</p>
          <p className="mt-4">
            {state.data.subject} · {state.data.delivery}
          </p>
          {state.data.teacher?.fullName && (
            <p>Teacher: {state.data.teacher.fullName}</p>
          )}
          <p className="mt-6">
            <AppLink href={`/apply?class=${id}`}>Apply for this class</AppLink>
          </p>
          <h2 className="mt-8 text-2xl font-bold">Course modules</h2>
          {Array.isArray(state.data.modules) && state.data.modules.length ? (
            <ul className="list-disc pl-6">
              {state.data.modules.map((module, i) => (
                <li key={i}>{module}</li>
              ))}
            </ul>
          ) : (
            <p>No module information has been published.</p>
          )}
        </article>
      )}
    </main>
  );
}
