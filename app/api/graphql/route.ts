const endpoint = process.env.GRAPHQL_API_URL || "https://main-practice.codebootcamp.co.kr/graphql";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("application/json") && !contentType.startsWith("multipart/form-data")) {
    return Response.json({ errors: [{ message: "지원하지 않는 Content-Type입니다." }] }, { status: 415 });
  }

  const headers = new Headers({ "content-type": contentType });
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  if (authorization) headers.set("authorization", authorization);
  if (cookie) headers.set("cookie", cookie);

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers,
      body: await request.arrayBuffer(),
      cache: "no-store",
    });
    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get("content-type");
    const setCookie = upstream.headers.get("set-cookie");
    if (upstreamContentType) responseHeaders.set("content-type", upstreamContentType);
    if (setCookie) responseHeaders.set("set-cookie", setCookie);

    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json({ errors: [{ message: "GraphQL 서버에 연결하지 못했습니다." }] }, { status: 502 });
  }
}
