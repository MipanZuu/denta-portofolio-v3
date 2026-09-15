const removalHeaders = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

export function GET() {
  return new Response(null, { status: 410, headers: removalHeaders });
}

export function HEAD() {
  return new Response(null, { status: 410, headers: removalHeaders });
}
