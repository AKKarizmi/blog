import { appUrls } from "../services/applicationUrls";
import { useEffect, useState } from "react";
import { educationRequest } from "../services/forozClient";
import type {
  CredentialRecord,
  ClassRecord,
  Program,
} from "../services/educationTypes";
const input =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900";
const button =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#252b69] px-5 py-2 font-semibold text-white disabled:opacity-50";
export function AdmissionForm({ initialClass }: { initialClass?: number }) {
  const [offers, setOffers] = useState<ClassRecord[]>([]),
    [course, setCourse] = useState(String(initialClass || "")),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false);
  useEffect(() => {
    const abort = new AbortController();
    educationRequest<{ classes: ClassRecord[] }>(
      "/public/offerings/",
      { signal: abort.signal },
      true,
    )
      .then((data) => setOffers(data.classes.filter((c) => c.state === "open")))
      .catch(() => {
        if (!abort.signal.aborted)
          setError(
            "Class choices could not be loaded. You may still apply for general admission.",
          );
      });
    return () => abort.abort();
  }, []);
  return (
    <section className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900">
      <h1 className="text-2xl font-bold">Apply to FOROZ education</h1>
      <p>
        Admin reviews system admission and issues your student ID. Your class
        teacher then reviews enrollment. One account can join multiple classes.
      </p>
      {done ? (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 p-4 text-emerald-900"
        >
          Your request has been received. Check your email for admission and
          activation instructions. Already admitted? Use your student portal for
          further class requests.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const values = new FormData(event.currentTarget);
            setBusy(true);
            setError("");
            try {
              await educationRequest(
                "/public/apply/",
                {
                  method: "POST",
                  body: JSON.stringify({
                    name: values.get("name"),
                    email: values.get("email"),
                    phone: values.get("phone"),
                    motivation: values.get("motivation"),
                    course: course ? Number(course) : null,
                  }),
                },
                true,
              );
              setDone(true);
            } catch (e) {
              setError(
                e instanceof Error
                  ? e.message
                  : "Application could not be submitted.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="block">
            Full name
            <input className={input} name="name" required maxLength={150} />
          </label>
          <label className="block">
            Email
            <input className={input} name="email" type="email" required />
          </label>
          <label className="block">
            Phone (optional)
            <input className={input} name="phone" maxLength={30} />
          </label>
          <label className="block">
            Requested class
            <select
              className={input}
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="">General admission</option>
              {offers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.teacher_name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            What would you like to learn? (optional)
            <textarea className={input} name="motivation" maxLength={5000} />
          </label>
          {error && (
            <p role="alert" className="text-rose-700">
              {error}
            </p>
          )}
          <button disabled={busy} className={button}>
            {busy ? "Submitting…" : "Submit application"}
          </button>
        </form>
      )}
      <a className="inline-block underline" href={appUrls.lms + "/"}>
        Already admitted? Sign in with your student ID
      </a>
    </section>
  );
}
export function CredentialVerifier({
  code,
  onVerify,
}: {
  code?: string;
  onVerify?: (code: string) => void;
}) {
  const [value, setValue] = useState(code || ""),
    [selected, setSelected] = useState(code || ""),
    [result, setResult] = useState<CredentialRecord | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  useEffect(() => {
    setSelected(code || "");
    setValue(code || "");
  }, [code]);
  useEffect(() => {
    if (!selected) {
      setResult(null);
      return;
    }
    const abort = new AbortController();
    setLoading(true);
    setError("");
    setResult(null);
    educationRequest<CredentialRecord>(
      `/public/credentials/${encodeURIComponent(selected)}/`,
      { signal: abort.signal },
      true,
    )
      .then(setResult)
      .catch(() => {
        if (!abort.signal.aborted)
          setError(
            "This credential was not found or could not be verified. Check the code and try again.",
          );
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, [selected]);
  return (
    <section className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900">
      <h1 className="text-2xl font-bold">
        Verify a FOROZ certificate or award
      </h1>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (value.trim()) {
            if (onVerify) onVerify(value.trim());
            else setSelected(value.trim());
          }
        }}
      >
        <label className="flex-1">
          Verification code
          <input
            className={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </label>
        <button className={button}>Verify credential</button>
      </form>
      {loading && <p role="status">Verifying…</p>}
      {error && (
        <p role="alert" className="text-rose-700">
          {error}
        </p>
      )}
      {result && (
        <dl className="space-y-3 rounded-xl border p-5">
          <div>
            <dt className="font-semibold">Status</dt>
            <dd
              className={
                result.status === "valid" ? "text-emerald-800" : "text-rose-800"
              }
            >
              {result.status}
            </dd>
          </div>
          {[
            ["Recipient", result.recipient_name],
            ["Achievement", result.title],
            ["Kind", result.kind],
            ["Issuer", result.issuer],
            ["Issued", new Date(result.issued_at).toLocaleDateString()],
            [
              "Expiry",
              result.expires_at
                ? new Date(result.expires_at).toLocaleDateString()
                : "No expiry",
            ],
          ].map(([label, text]) => (
            <div key={label}>
              <dt className="font-semibold">{label}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
export function PublishedPrograms() {
  const [data, setData] = useState<{
      programs: Program[];
      classes: ClassRecord[];
    }>({ programs: [], classes: [] }),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    const abort = new AbortController();
    educationRequest<typeof data>(
      "/public/offerings/",
      { signal: abort.signal },
      true,
    )
      .then(setData)
      .catch(() => {
        if (!abort.signal.aborted)
          setError(
            "Educational offerings could not be loaded. Please try again later.",
          );
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, []);
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      <h2 className="text-2xl font-bold">Published programs and classes</h2>
      {loading ? (
        <p role="status">Loading offerings…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          {!data.programs.length && !data.classes.length && (
            <p>
              No educational programs or classes are open for public
              registration right now.
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            {data.programs.map((p) => (
              <article key={p.id} className="rounded-2xl border bg-white p-6">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="mt-3 whitespace-pre-line">{p.description}</p>
              </article>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.classes.map((c) => (
              <article
                key={c.id}
                className="space-y-3 rounded-2xl border bg-white p-6"
              >
                <h3 className="text-xl font-bold">{c.name}</h3>
                <p>{c.description}</p>
                <p>Teacher: {c.teacher_name}</p>
                <p>Status: {c.state}</p>
                {c.state === "open" ? (
                  <a className={button} href={`/apply?class=${c.id}`}>
                    Apply for this class
                  </a>
                ) : (
                  <p>Registration is not currently open.</p>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
