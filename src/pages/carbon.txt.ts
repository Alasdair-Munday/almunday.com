import { site } from '../lib/site.js';

export const prerender = true;

export function GET() {
  const disclosures = site.greenweb.disclosures
    .map(disclosure => `{ doc_type='${disclosure.docType}', url='${disclosure.url}', domain='${disclosure.domain}' }`)
    .join(',');

  const services = site.greenweb.services
    .map(service => `{ domain='${service.domain}', service_type='${service.serviceType}' }`)
    .join(',');

  const body = `[org]\ndisclosures = [${disclosures}]\n\n[upstream]\nservices = [${services}]\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
