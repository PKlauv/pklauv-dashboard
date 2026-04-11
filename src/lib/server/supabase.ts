import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

let _client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
	if (!_client) {
		_client = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	}
	return _client;
}
