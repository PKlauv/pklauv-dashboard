import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/supabase';

export const POST: RequestHandler = async ({ cookies, url }) => {
	const supabase = createSupabaseServerClient(cookies);
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'github',
		options: {
			redirectTo: `${url.origin}/auth/callback`
		}
	});

	if (error || !data.url) {
		return redirect(303, '/dashboard');
	}

	return redirect(303, data.url);
};
