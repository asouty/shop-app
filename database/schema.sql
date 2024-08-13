/*create table base
(
    id          uuid                     default uuid_generate_v4() not null
        constraint entity_pkey
            primary key,
    created_at  timestamp with time zone default now(),
    created_by  text,
    updated_at  timestamp with time zone default now(),
    updated_by  text
);*/

create table item
(
    id          uuid                     default uuid_generate_v4() not null
        constraint item_pkey
            primary key,
    name        text,
    description text,
    created_at  timestamp with time zone default now(),
    created_by  text,
    updated_at  timestamp with time zone default now(),
    updated_by  text
);


create table person
(
    id          uuid                     default uuid_generate_v4() not null
        constraint person_pkey
            primary key,
    created_at  timestamp with time zone default now(),
    created_by  text,
    updated_at  timestamp with time zone default now(),
    updated_by  text,
    email       text not null unique,
    password    text not null,
    name        text,
    lastname    text
);

create table address_
(
    id          uuid                     default uuid_generate_v4() not null
        constraint address_pkey
            primary key,
    created_at  timestamp with time zone default now(),
    created_by  text,
    updated_at  timestamp with time zone default now(),
    updated_by  text,
    person_id   uuid,
    street      text not null,
    city        text not null,
    postcode    text not null,
    country     text not null,
    CONSTRAINT fk_person FOREIGN KEY(person_id) REFERENCES person(id)
);

