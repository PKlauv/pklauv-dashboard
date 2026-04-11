import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
};

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

	if (typeof site !== 'string' || !site || site.length > 500) {
		return new Response(null, { status: 400, headers: corsHeaders });
	}
	if (typeof path !== 'string' || !path || path.length > 500) {
		return new Response(null, { status: 400, headers: corsHeaders });
	}

	const country = request.headers.get('x-vercel-ip-country') || null;
	const device_type = getDeviceType(request.headers.get('user-agent'));

	const { error } = await supabaseAdmin().from('page_views').insert({
		site,
		path,
		referrer: typeof referrer === 'string' ? referrer.slice(0, 500) : null,
		session_id: typeof session_id === 'string' ? session_id.slice(0, 100) : null,
		country,
		device_type
	});

	if (error) {
		return new Response(null, { status: 500, headers: corsHeaders });
	}

	return new Response(null, { status: 204, headers: corsHeaders });
};
