export default function AnimatedValueCell({ value }) {
  if (value || value == 0) {
    return value;
  }

  return (
    <span className="inline-block animate-pulse rounded bg-slate-200 h-6 w-16"></span>
  )
}
