import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/supabase';

export const POST: RequestHandler = async ({ cookies }) => {
	const supabase = createSupabaseServerClient(cookies);
	await supabase.auth.signOut();
	return redirect(303, '/');
};
