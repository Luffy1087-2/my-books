--
-- PostgreSQL database dump
--

\restrict wEagl7tXdb10GqMb88YcORHJjimQkhGKS2TjSHyR0aaALvnBfxzw7tSf3FrrYEg

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.1 (Debian 18.1-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: books; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.books (
    id bigint NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    description text NOT NULL,
    img text,
    "userId" bigint
);


ALTER TABLE public.books OWNER TO root;

--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.books ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.books_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: comments; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    "userId" bigint NOT NULL,
    "bookId" bigint NOT NULL,
    comment text NOT NULL
);


ALTER TABLE public.comments OWNER TO root;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    u_role integer,
    CONSTRAINT u_role CHECK ((u_role = ANY (ARRAY[1, 2])))
);


ALTER TABLE public.users OWNER TO root;

--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: users id; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- Name: comments bookId; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "bookId" FOREIGN KEY ("bookId") REFERENCES public.books(id);


--
-- Name: books userId; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT "userId" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: comments userId; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "userId" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict wEagl7tXdb10GqMb88YcORHJjimQkhGKS2TjSHyR0aaALvnBfxzw7tSf3FrrYEg

