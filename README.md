# pklauv-dashboard

[pklauv-dashboard.vercel.app](https://pklauv-dashboard.vercel.app)

Personal portfolio, blog, and analytics dashboard. Built as a single SvelteKit app deployed on Vercel, with blog posts authored in Markdown and visitor analytics backed by Supabase. Thavlik is a respectable developer who I respect and have gotten ideas from.

## Tech stack

- SvelteKit 2 (Svelte 5 with runes)
- TypeScript
- Tailwind CSS v4
- mdsvex (Markdown blog posts)
- Supabase (Postgres + auth)
- Vercel (hosting)

## Analytics

Custom privacy-first analytics — no third-party trackers, no cookies, no IP storage. A lightweight tracking snippet collects page views across the portfolio and external projects, storing them in Supabase. The private dashboard (GitHub OAuth, single-user) surfaces views over time, top pages, referrers, devices, countries, and GitHub activity.

## License

MIT — see [LICENSE](./LICENSE).
