-- Temple Street 2030 - Multiplayer Group Order Database Schema

CREATE TABLE IF NOT EXISTS group_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    host_name TEXT NOT NULL,
    group_id TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'Active',
    budget_limit REAL DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS group_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    dietary_tag TEXT,
    FOREIGN KEY (group_id) REFERENCES group_sessions(group_id)
);

CREATE TABLE IF NOT EXISTS group_cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    guest_id INTEGER NOT NULL,
    qty INTEGER DEFAULT 1,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES group_sessions(group_id),
    FOREIGN KEY (guest_id) REFERENCES group_members(id)
);
