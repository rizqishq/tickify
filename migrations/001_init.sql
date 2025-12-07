CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	full_name varchar(150) NOT NULL,
	email varchar(150) NULL,
	phone_number varchar(30) NULL,
	password_hash text NOT NULL,
	"role" varchar(20) DEFAULT 'user'::character varying NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	profile_picture_url text NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE events (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	organizer_id uuid NULL,
	title varchar(255) NOT NULL,
	description text NULL,
	"location" varchar(255) NULL,
	venue varchar(255) NULL,
	start_time timestamptz NOT NULL,
	end_time timestamptz NULL,
	banner_url text NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT events_pkey PRIMARY KEY (id),
	CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE orders (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id uuid NULL,
	total_price numeric(12, 2) NOT NULL,
	status varchar(30) DEFAULT 'pending'::character varying NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	paid_at timestamptz NULL,
	CONSTRAINT orders_pkey PRIMARY KEY (id),
	CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE payments (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	order_id uuid NULL,
	provider varchar(100) NULL,
	"method" varchar(100) NULL,
	payload jsonb NULL,
	status varchar(30) DEFAULT 'pending'::character varying NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT payments_pkey PRIMARY KEY (id),
	CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE ticket_categories (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	event_id uuid NULL,
	"name" varchar(100) NOT NULL,
	price numeric(12, 2) NOT NULL,
	quota int4 NOT NULL,
	sold int4 DEFAULT 0 NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT ticket_categories_pkey PRIMARY KEY (id),
	CONSTRAINT ticket_categories_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	order_id uuid NULL,
	category_id uuid NULL,
	quantity int4 NOT NULL,
	price_each numeric(12, 2) NOT NULL,
	subtotal numeric(12, 2) NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT order_items_pkey PRIMARY KEY (id),
	CONSTRAINT order_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES ticket_categories(id) ON DELETE SET NULL,
	CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE tickets (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	order_item_id uuid NULL,
	user_id uuid NULL,
	category_id uuid NULL,
	ticket_code varchar(150) NOT NULL,
	is_used bool DEFAULT false NULL,
	used_at timestamptz NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT tickets_pkey PRIMARY KEY (id),
	CONSTRAINT tickets_ticket_code_key UNIQUE (ticket_code),
	CONSTRAINT tickets_category_id_fkey FOREIGN KEY (category_id) REFERENCES ticket_categories(id) ON DELETE SET NULL,
	CONSTRAINT tickets_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
	CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);