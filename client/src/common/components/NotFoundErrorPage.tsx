export function NotFoundErrorPage() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center mb-60">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Not found</h1>
          <p className="py-6">This page is missing. Please double check your URL.</p>
          <a href="/" className="btn btn-primary">Go back</a>
        </div>
      </div>
    </div>
  );
}
