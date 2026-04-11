(function () {
	try {
		var h = location.hostname;
		if (h === 'localhost' || h === '127.0.0.1') return;
		if (sessionStorage.getItem('_pk_tracked')) return;
		sessionStorage.setItem('_pk_tracked', '1');

		var el = document.currentScript;
		var site = (el && el.getAttribute('data-site')) || '';
		if (!site) {
			if (h === 'pklauv.github.io') {
				site = location.pathname.split('/')[1] || 'github-pages';
			} else {
				site = 'portfolio';
			}
		}

		var sid = sessionStorage.getItem('_pk_sid');
		if (!sid) {
			sid = typeof crypto !== 'undefined' && crypto.randomUUID
				? crypto.randomUUID()
				: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
			sessionStorage.setItem('_pk_sid', sid);
		}

		fetch('https://pklauv.vercel.app/api/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				site: site,
				path: location.pathname,
				referrer: document.referrer || null,
				session_id: sid
			}),
			keepalive: true
		}).catch(function () {});
	} catch (e) {}
})();
