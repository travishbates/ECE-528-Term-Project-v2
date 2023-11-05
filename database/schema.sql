CREATE TABLE IF NOT EXISTS transaction_type
(
    type varchar(255) unique,

    primary key (type)
);

INSERT INTO transaction_type values
                                    ('buy'),
                                    ('sell'),
                                    ('deposit'),
                                    ('withdraw');

CREATE TABLE IF NOT EXISTS transaction
(
    id uuid,
    user_id varchar(255),
    time_transacted timestamp,
    transaction_type varchar(255) references transaction_type (type),
    asset_name varchar(255),
    asset_quantity numeric(18, 8),
    total_asset_amount_usd numeric(18, 8),

    primary key (id)
);

CREATE TABLE IF NOT EXISTS report_status
(
    status varchar(255) unique,

    primary key (status)
);

INSERT INTO report_status values
('in-progress'),
('failed'),
('complete');

CREATE TABLE IF NOT EXISTS report
(
    id uuid,
    user_id varchar(255) not null,
    status varchar(255) not null references report_status (status),
    requested_date timestamp not null,
    start_date timestamp not null,
    end_date timestamp not null,
    download_url text,

    primary key (id)
);