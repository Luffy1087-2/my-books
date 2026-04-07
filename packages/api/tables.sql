-- PostgreSQL database dump

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';

CREATE TABLE IF NOT EXISTS public.users (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "gId" text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    u_role integer CHECK (u_role IN (1, 2))
);

CREATE TABLE IF NOT EXISTS public.books (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title text NOT NULL,
    author text NOT NULL,
    description text NOT NULL,
    image bytea,
    "userId" bigint REFERENCES public.users(id)
);

CREATE TABLE IF NOT EXISTS public.comments (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "userId" bigint NOT NULL REFERENCES public.users(id),
    "bookId" bigint NOT NULL REFERENCES public.books(id),
    comment text NOT NULL
);

ALTER TABLE IF EXISTS public.users OWNER TO root;
ALTER TABLE IF EXISTS public.books OWNER TO root;
ALTER TABLE IF EXISTS public.comments OWNER TO root;

-- PostgreSQL database dump complete