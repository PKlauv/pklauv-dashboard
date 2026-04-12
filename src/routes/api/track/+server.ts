import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
};

const ALLOWED_SITES = new Set(['portfolio', 'keycrack', 'math-phenomena', 'gesturemute']);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseReferrerOrigin(raw: string): string | null {
	try {
		return new URL(raw).origin;
	} catch {
		return null;
	}
}

function getDeviceType(ua: string | null): string {
	if (!ua) return 'desktop';
	if (/Tablet|iPad/i.test(ua)) return 'tablet';
	if (/Mobi|Android/i.test(ua)) return 'mobile';
	return 'desktop';
}

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, { status: 204, headers: corsHeaders });
};

export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return new Response(null, { status: 400, headers: corsHeaders });
	}

	const { site, path, referrer, session_id } = body as Record<string, unknown>;

	if (typeof site !== 'string' || !ALLOWED_SITES.has(site)) {
		return new Response(null, { status: 400, headers: corsHeaders });
	}
	if (typeof path !== 'string' || !path || path.length > 500) {
		return new Response(null, { status: 400, headers: corsHeaders });
	}
	if (session_id !== undefined && (typeof session_id !== 'string' || !UUID_RE.test(session_id))) {
		return new Response(null, { status: 400, headers: corsHeaders });
	}

	const country = request.headers.get('x-vercel-ip-country') || null;
	const device_type = getDeviceType(request.headers.get('user-agent'));

	const { error } = await supabase.from('page_views').insert({
		site,
		path,
		referrer: typeof referrer === 'string' ? parseReferrerOrigin(referrer) : null,
		session_id: typeof session_id === 'string' ? session_id : null,
		country,
		device_type
	});

	if (error) {
		return new Response(null, { status: 500, headers: corsHeaders });
	}

	return new Response(null, { status: 204, headers: corsHeaders });
};
