// Preserve request/response metadata from Lighthouse's CDP log as HAR 1.2.
// Bodies are intentionally omitted; byte counts come from Network events.
export function networkHar(events) {
  const requests = new Map();
  for (const { method, params: p } of events) {
    if (method === 'Network.requestWillBeSent') requests.set(p.requestId, { request: p.request, start: p.timestamp, wall: p.wallTime, decoded: 0, encoded: 0 });
    const item = requests.get(p.requestId);
    if (!item) continue;
    if (method === 'Network.responseReceived') { item.response = p.response; item.received = p.timestamp; }
    if (method === 'Network.dataReceived') { item.decoded += p.dataLength; item.encoded += p.encodedDataLength; }
    if (method === 'Network.loadingFinished') item.end = p.timestamp;
  }
  const headers = values => Object.entries(values ?? {}).map(([name, value]) => ({ name, value: String(value) }));
  const entries = [...requests.values()].filter(item => item.response && item.wall).map(item => {
    const url = new URL(item.request.url);
    const wait = Math.max(0, (item.received - item.start) * 1000);
    const receive = Math.max(0, ((item.end ?? item.received) - item.received) * 1000);
    return {
      startedDateTime: new Date(item.wall * 1000).toISOString(), time: wait + receive,
      request: { method: item.request.method, url: item.request.url, httpVersion: item.response.protocol, cookies: [], headers: headers(item.request.headers), queryString: [...url.searchParams].map(([name, value]) => ({ name, value })), headersSize: -1, bodySize: -1 },
      response: { status: item.response.status, statusText: item.response.statusText, httpVersion: item.response.protocol, cookies: [], headers: headers(item.response.headers), content: { size: item.decoded, mimeType: item.response.mimeType }, redirectURL: item.response.headers?.location ?? '', headersSize: -1, bodySize: item.encoded },
      cache: {}, timings: { blocked: -1, dns: -1, connect: -1, ssl: -1, send: 0, wait, receive }, serverIPAddress: item.response.remoteIPAddress,
    };
  });
  return { log: { version: '1.2', creator: { name: 'Smart Agency Lighthouse audit', version: '1.0' }, entries } };
}
