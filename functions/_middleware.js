function isPreviewHost(hostname) {
  return hostname.endsWith(".pages.dev");
}

function withPreviewRobotsMeta(html) {
  if (html.includes('name="robots" content="noindex,nofollow"')) {
    return html;
  }

  if (html.includes('name="robots" content="index, follow"')) {
    return html.replace('name="robots" content="index, follow"', 'name="robots" content="noindex,nofollow"');
  }

  return html.replace("</head>", '    <meta name="robots" content="noindex,nofollow">\n  </head>');
}

export async function onRequest(context) {
  const response = await context.next();
  const url = new URL(context.request.url);

  if (!isPreviewHost(url.hostname)) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");

  const contentType = headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const html = await response.text();

  return new Response(withPreviewRobotsMeta(html), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
