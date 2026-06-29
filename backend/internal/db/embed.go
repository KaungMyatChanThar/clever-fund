package db

import "embed"

//go:embed migrations
var migrationFiles embed.FS
