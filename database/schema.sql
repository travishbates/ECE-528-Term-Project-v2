CREATE TABLE IF NOT EXISTS transaction
(
    id uuid,
    time_transacted timestamp,
    asset_purchased_name varchar(255),
    asset_purchased_quantity numeric(18, 8),
    asset_sold_name varchar(255),
    asset_sold_quantity numeric(18, 8),

    primary key (id)
);