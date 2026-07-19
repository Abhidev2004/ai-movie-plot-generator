export default function LoadingSkeleton() {
  return (
    <div className="card mx-auto w-full max-w-3xl bg-base-100 shadow-xl">
      <div className="card-body gap-4">
        <div className="skeleton h-8 w-3/4" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-4 w-3/5" />
        </div>
        <div className="skeleton h-40 w-full" />
      </div>
    </div>
  );
}
