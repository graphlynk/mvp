# 📦 Repo: graph-authority

```
.
├── README.md
├── package.json
├── tsconfig.json
├── next.config.mjs
├── .env.example
├── prisma/
│   └── schema.prisma
├── src/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── email.ts
│   │   ├── seo.ts
│   │   └── auth.ts
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── RankResult.tsx
│   │   ├── LinkProfileBuilder.tsx
│   │   ├── BlogEditor.tsx
│   │   └── SubscribeForm.tsx
│   └── styles/globals.css
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/page.tsx
│   ├── login/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── request-code/route.ts
│   │   │   └── verify-code/route.ts
│   │   ├── search/route.ts
│   │   ├── blog/
│   │   │   ├── posts/route.ts
│   │   │   └── posts/[id]/route.ts
│   │   ├── mailing/
│   │   │   └── subscribe/route.ts
│   │   └── profile/route.ts
│   └── u/
│       └── [username]/page.tsx
├── scripts/
│   └── weeklyDigest.ts
├── replit.nix
└── .replit
```

---

## README.md

```md
# Graph Authority — MVP

An MVP SaaS that combines Knowledge Graph prep, SEO automation, Link-in-bio short profiles with schema markup, a Google-connected search bar with rank numbers, weekly blog → newsletter, and magic-link (email passcode) login. Built for easy deploy on Replit.

## Features (MVP scope)
- Email passcode login (no passwords)
- Short-link profile pages at `/u/[username]` (SEO-ready, JSON-LD schema)
- Schema Markup Builder (paid plans) — Person/Organization/SocialProfile
- Blog (CRUD) + Mailing list with `/scripts/weeklyDigest.ts`
- Search bar backed by Google Custom Search API (rank numbers + filters)
- Basic SEO toolkit: sitemap, OpenGraph, JSON-LD helpers

## Quick start
1. Copy `.env.example` to `.env` and fill values
2. Install deps and migrate DB
   ```bash
   npm i
   npx prisma migrate dev --name init
   npm run dev
   ```

### Deploy on Replit
- This repo includes `.replit` and `replit.nix` for Node 20 + Prisma.
- On first run, Replit will install and start `npm run dev`.

## Environment
- `DATABASE_URL` (SQLite path or Postgres URL)
- `EMAIL_FROM` (display only)
- `SENDGRID_API_KEY` or `RESEND_API_KEY` (choose one)
- `GOOGLE_CSE_ID` and `GOOGLE_CSE_KEY` (Custom Search)
- `APP_URL` (e.g., https://<your-repl>.repl.co)
- `JWT_SECRET` (for signing session tokens)

## Plans & gating (MVP)
- Free: core profile + search (limited)
- Pro: schema markup builder, blog+newsletter, advanced analytics (stubs)
- Authority: API access & expert services (stubs)

> NOTE: Knowledge Graph claiming/verification flows are mocked as tasks for now; real integrations require OAuth + partner APIs.
```

---

## package.json

```json
{
  "name": "graph-authority",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "postinstall": "prisma generate",
    "digest": "ts-node --transpile-only scripts/weeklyDigest.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.20.0",
    "jsonwebtoken": "^9.0.2",
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zod": "^3.23.8",
    "nodemailer": "^6.9.15",
    "@sendgrid/mail": "^8.1.1",
    "resend": "^3.4.0",
    "isomorphic-dompurify": "^2.13.0"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "prisma": "^5.20.0",
    "typescript": "5.5.4",
    "ts-node": "^10.9.2"
  }
}
```

---

## .env.example

```ini
DATABASE_URL="file:./dev.db" # or postgres://...
EMAIL_FROM="Graph Authority <noreply@yourdomain.com>"
SENDGRID_API_KEY=""
RESEND_API_KEY=""
GOOGLE_CSE_ID=""
GOOGLE_CSE_KEY=""
APP_URL="http://localhost:3000"
JWT_SECRET="change-me"
```

---

## next.config.mjs

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ["*"] } },
};
export default nextConfig;
```

---

## prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  username  String?  @unique
  plan      Plan     @default(FREE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  magicCodes MagicCode[]
  profiles  Profile[]
  posts     Post[]
  subscribers Subscriber[]
}

enum Plan { FREE PRO AUTHORITY }

model MagicCode {
  id        String   @id @default(cuid())
  userId    String
  code      String
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  @@index([userId, code])
}

model Profile {
  id        String   @id @default(cuid())
  userId    String
  username  String   @unique
  title     String?
  bio       String?
  avatarUrl String?
  theme     Json?
  links     Link[]
  showKgMetrics Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}

model Link {
  id        String   @id @default(cuid())
  profileId String
  label     String
  url       String
  order     Int       @default(0)
  createdAt DateTime  @default(now())
  profile   Profile   @relation(fields: [profileId], references: [id])
}

model Post {
  id        String   @id @default(cuid())
  userId    String
  title     String
  slug      String   @unique
  html      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}

model Subscriber {
  id        String   @id @default(cuid())
  userId    String
  email     String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  @@unique([userId, email])
}
```

---

## src/lib/db.ts

```ts
import { PrismaClient } from "@prisma/client";
export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;
```

## src/lib/auth.ts

```ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE = "ga_session";

export function signSession(payload: object, days = 30) {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: `${days}d` });
  return token;
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/" });
}

export function getSession<T=any>(): T | null {
  try {
    const cookie = cookies().get(COOKIE)?.value;
    if (!cookie) return null;
    return jwt.verify(cookie, process.env.JWT_SECRET!) as T;
  } catch {
    return null;
  }
}
```

## src/lib/email.ts

```ts
import nodemailer from "nodemailer";
import sg from "@sendgrid/mail";
import { Resend } from "resend";

export async function sendEmail(to: string, subject: string, html: string) {
  if (process.env.SENDGRID_API_KEY) {
    sg.setApiKey(process.env.SENDGRID_API_KEY);
    await sg.send({ to, from: process.env.EMAIL_FROM!, subject, html });
    return;
  }
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: process.env.EMAIL_FROM!, to, subject, html });
    return;
  }
  // Dev fallback: log to console
  console.log("EMAIL →", to, subject, html);
}
```

## src/lib/seo.ts

```ts
export function jsonLd(obj: any) {
  return {
    __html: `\n<script type="application/ld+json">${JSON.stringify(obj)}</script>`
  };
}

export function personSchema({ name, url, sameAs = [] as string[], image }: {name: string, url: string, sameAs?: string[], image?: string}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name, url, sameAs, image
  };
}

export function organizationSchema({ name, url, sameAs = [] as string[], logo }: {name: string, url: string, sameAs?: string[], logo?: string}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name, url, sameAs, logo
  };
}
```

---

## app/layout.tsx

```tsx
import "../src/styles/globals.css";
import { ReactNode } from "react";

export const metadata = { title: "Graph Authority", description: "SEO + KG + Link Profiles" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl p-4 font-semibold">Graph Authority</div>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
```

## app/page.tsx (Landing)

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Build your brand's Knowledge Graph & SEO</h1>
      <p>Create SEO-ready link profiles, publish blogs, and send weekly digests—all in one place.</p>
      <div className="flex gap-3">
        <Link className="px-4 py-2 bg-black text-white rounded" href="/login">Get Started</Link>
        <Link className="px-4 py-2 border rounded" href="/u/demo">View a Demo Profile</Link>
      </div>
    </div>
  );
}
```

## app/login/page.tsx

```tsx
'use client';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<'request'|'verify'>('request');

  async function requestCode() {
    await fetch('/api/auth/request-code', { method: 'POST', body: JSON.stringify({ email }) });
    setStage('verify');
  }

  async function verify() {
    await fetch('/api/auth/verify-code', { method: 'POST', body: JSON.stringify({ email, code }) });
    window.location.href = '/dashboard';
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      {stage==='request' ? (
        <>
          <input className="border p-2 w-full" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="px-4 py-2 bg-black text-white rounded" onClick={requestCode}>Send Passcode</button>
        </>
      ) : (
        <>
          <input className="border p-2 w-full" placeholder="6-digit code" value={code} onChange={e=>setCode(e.target.value)} />
          <button className="px-4 py-2 bg-black text-white rounded" onClick={verify}>Verify</button>
        </>
      )}
    </div>
  );
}
```

## app/dashboard/page.tsx

```tsx
import Link from 'next/link';
import { getSession } from '@/src/lib/auth';

export default function Dashboard() {
  const session = getSession<{ id: string; email: string; }>();
  if (!session) return <div>Please <Link href="/login" className="underline">login</Link>.</div>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card href="/u/demo">View Profile</Card>
        <Card href="/api-docs">API (soon)</Card>
        <Card href="#" >Knowledge Graph (coming soon)</Card>
        <Card href="#">SEO Tools (coming soon)</Card>
        <Card href="#">Blog</Card>
        <Card href="#">Mailing List</Card>
      </div>
    </div>
  );
}

function Card({ href, children }: {href: string, children: any}) {
  return (
    <a className="block border rounded p-4 hover:shadow" href={href}>{children}</a>
  );
}
```

---

## API Routes — Auth (email passcode)

### app/api/auth/request-code/route.ts
```ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { sendEmail } from '@/src/lib/email';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) user = await prisma.user.create({ data: { email } });

  const code = Math.floor(100000 + Math.random()*900000).toString();
  const expiresAt = new Date(Date.now() + 10*60*1000);
  await prisma.magicCode.create({ data: { userId: user.id, code, expiresAt } });

  await sendEmail(email, 'Your Graph Authority code', `<p>Your login code is <b>${code}</b>. It expires in 10 minutes.</p>`);
  return NextResponse.json({ ok: true });
}
```

### app/api/auth/verify-code/route.ts
```ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { signSession, setSessionCookie } from '@/src/lib/auth';

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const record = await prisma.magicCode.findFirst({ where: { userId: user.id, code, used: false } });
  if (!record || record.expiresAt < new Date()) return NextResponse.json({ error: 'Invalid/expired code' }, { status: 400 });

  await prisma.magicCode.update({ where: { id: record.id }, data: { used: true } });

  const token = signSession({ id: user.id, email: user.email });
  setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
```

---

## API — Search (Google CSE) with rank numbers & basic filters

### app/api/search/route.ts
```ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const cseId = process.env.GOOGLE_CSE_ID!;
  const key = process.env.GOOGLE_CSE_KEY!;
  if (!q) return NextResponse.json({ items: [] });

  const url = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cseId}&q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  const data = await res.json();

  const items = (data.items || []).map((it: any, idx: number) => ({
    rank: idx + 1,
    title: it.title,
    link: it.link,
    snippet: it.snippet,
    displayLink: it.displayLink
  }));

  // naive suggestions (placeholder)
  const suggestions = [ `${q} review`, `${q} pricing`, `${q} alternatives` ];

  return NextResponse.json({ items, suggestions });
}
```

---

## API — Blog + Mailing

### app/api/blog/posts/route.ts (POST create, GET list)
```ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import DOMPurify from 'isomorphic-dompurify';

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { userId, title, slug, html } = await req.json();
  const safe = DOMPurify.sanitize(html || '');
  const post = await prisma.post.create({ data: { userId, title, slug, html: safe } });
  return NextResponse.json(post);
}
```

### app/api/blog/posts/[id]/route.ts
```ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';

export async function GET(_: NextRequest, { params }: { params: { id: string }}) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}
```

### app/api/mailing/subscribe/route.ts
```ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';

export async function POST(req: NextRequest) {
  const { userId, email } = await req.json();
  if (!userId || !email) return NextResponse.json({ error: 'Missing' }, { status: 400 });
  const sub = await prisma.subscriber.upsert({
    where: { userId_email: { userId, email } },
    create: { userId, email },
    update: {}
  });
  return NextResponse.json(sub);
}
```

---

## Profile API (create/update)

### app/api/profile/route.ts
```ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';

export async function POST(req: NextRequest) {
  const { userId, username, title, bio, avatarUrl, links, showKgMetrics } = await req.json();
  const profile = await prisma.profile.upsert({
    where: { username },
    create: { userId, username, title, bio, avatarUrl, showKgMetrics, links: { create: links || [] } },
    update: { title, bio, avatarUrl, showKgMetrics, links: { deleteMany: {}, create: links || [] } }
  });
  return NextResponse.json(profile);
}
```

---

## Public Profile Page — app/u/[username]/page.tsx

```tsx
import { prisma } from '@/src/lib/db';
import { jsonLd, personSchema, organizationSchema } from '@/src/lib/seo';

export default async function Profile({ params }: { params: { username: string }}) {
  const profile = await prisma.profile.findUnique({ where: { username: params.username }, include: { links: true, user: true } });
  if (!profile) return <div className="py-12">Profile not found.</div>;

  const url = `${process.env.APP_URL}/u/${profile.username}`;
  const sameAs = profile.links.map(l => l.url);
  const schema = (profile.title?.toLowerCase().includes('llc') || profile.title?.toLowerCase().includes('inc'))
    ? organizationSchema({ name: profile.title || profile.username, url, sameAs, logo: profile.avatarUrl || undefined })
    : personSchema({ name: profile.title || profile.username, url, sameAs, image: profile.avatarUrl || undefined });

  return (
    <div className="mx-auto max-w-xl py-8">
      <div className="text-center space-y-3">
        {profile.avatarUrl && <img src={profile.avatarUrl} alt="avatar" className="w-24 h-24 rounded-full mx-auto"/>}
        <h1 className="text-2xl font-bold">{profile.title || profile.username}</h1>
        {profile.bio && <p className="text-gray-600">{profile.bio}</p>}
      </div>
      <ul className="mt-6 space-y-3">
        {profile.links.sort((a,b)=>a.order-b.order).map(link => (
          <li key={link.id}>
            <a className="block w-full border rounded px-4 py-3 hover:bg-gray-50" href={link.url} rel="noopener noreferrer">{link.label}</a>
          </li>
        ))}
      </ul>
      {profile.showKgMetrics && (
        <div className="mt-8 p-4 border rounded">
          <h2 className="font-semibold mb-2">Knowledge Graph Metrics</h2>
          <p className="text-sm text-gray-600">(Placeholder) Claim status, entity IDs, last crawl, mentions.</p>
        </div>
      )}
      <div dangerouslySetInnerHTML={jsonLd(schema)} />
    </div>
  );
}
```

---

## UI Components (high level)

### src/components/SearchBar.tsx
```tsx
'use client';
import { useState } from 'react';

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function search() {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setItems(data.items || []);
    setSuggestions(data.suggestions || []);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="border p-2 flex-1" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="px-4 py-2 bg-black text-white rounded" onClick={search}>Search</button>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div className="border rounded p-3" key={i}>
            <div className="text-sm text-gray-500">#{it.rank} — {it.displayLink}</div>
            <a href={it.link} className="font-semibold hover:underline">{it.title}</a>
            <p className="text-sm text-gray-600">{it.snippet}</p>
          </div>
        ))}
      </div>
      {suggestions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">Suggestions</h3>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((s, i)=>(
              <button key={i} onClick={()=>{ setQ(s); }} className="text-sm px-2 py-1 border rounded">{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### src/components/LinkProfileBuilder.tsx (schema on paid plans)
```tsx
'use client';
import { useState } from 'react';

export default function LinkProfileBuilder({ userId, plan }: { userId: string, plan: 'FREE'|'PRO'|'AUTHORITY' }) {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showKgMetrics, setShowKgMetrics] = useState(false);
  const [links, setLinks] = useState<{label: string; url: string;}[]>([]);

  async function save() {
    await fetch('/api/profile', { method: 'POST', body: JSON.stringify({ userId, username, title, bio, avatarUrl, showKgMetrics, links }) });
    alert('Saved!');
  }

  return (
    <div className="space-y-3">
      <input className="border p-2 w-full" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Title (name or business)" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="border p-2 w-full" placeholder="Bio" value={bio} onChange={e=>setBio(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Avatar URL" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} />
      <label className="flex items-center gap-2"><input type="checkbox" checked={showKgMetrics} onChange={e=>setShowKgMetrics(e.target.checked)} /> Show Knowledge Graph metrics</label>

      <div className="space-y-2">
        <h3 className="font-semibold">Links</h3>
        {links.map((l, i)=> (
          <div key={i} className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Label" value={l.label} onChange={e=>{ const a=[...links]; a[i].label=e.target.value; setLinks(a); }} />
            <input className="border p-2 flex-1" placeholder="https://" value={l.url} onChange={e=>{ const a=[...links]; a[i].url=e.target.value; setLinks(a); }} />
          </div>
        ))}
        <button className="px-3 py-1 border rounded" onClick={()=>setLinks([...links, {label:'New', url:'https://'}])}>Add link</button>
      </div>

      {plan !== 'FREE' && (
        <div className="p-3 border rounded">
          <h3 className="font-semibold mb-1">Schema Markup (Pro+)</h3>
          <p className="text-sm text-gray-600">Your profile page will embed JSON-LD for better Google visibility.</p>
        </div>
      )}

      <button className="px-4 py-2 bg-black text-white rounded" onClick={save}>Save Profile</button>
    </div>
  );
}
```

---

## scripts/weeklyDigest.ts (blog → newsletter)

```ts
import { prisma } from '@/src/lib/db';
import { sendEmail } from '@/src/lib/email';

(async () => {
  const users = await prisma.user.findMany({ include: { subscribers: true } });
  for (const u of users) {
    const posts = await prisma.post.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' }, take: 5 });
    if (!posts.length || !u.subscribers.length) continue;
    const html = `
      <h1>${u.name || u.email} — Weekly Digest</h1>
      <ul>${posts.map(p=>`<li><a href="${process.env.APP_URL}/post/${p.slug}">${p.title}</a></li>`).join('')}</ul>
    `;
    for (const s of u.subscribers) {
      await sendEmail(s.email, 'Your Weekly Digest', html);
    }
  }
  console.log('Digest sent');
  process.exit(0);
})();
```

---

## Styling — src/styles/globals.css

```css
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"}
```

---

## Replit configs

### .replit
```ini
run = ["bash","-lc","npm run dev"]
``` 

### replit.nix
```nix
{ pkgs }: {
  deps = [ pkgs.nodejs-20_x pkgs.openssl pkgs.pkg-config pkgs.python3 pkgs.sqlite ];
}
```

---

## Notes & Next Steps
- **Knowledge Graph**: build ingestion + claim flows behind `/dashboard` (scaffolded panel). For launch, guide users to provide entity facts and sources; store for later automation.
- **Ranking filters**: expand `/api/search` to call additional APIs (e.g., backlink/DA providers) and compute metrics for the UI.
- **Payments/tiers**: add Stripe; gate Schema Builder & blog/email under Pro+.
- **Custom domains**: add DNS linking for profiles; default path `/u/[username]`.
- **Analytics**: add click/open tracking and profile analytics tables.
