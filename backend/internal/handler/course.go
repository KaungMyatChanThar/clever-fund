package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/cleverfund/backend/internal/model"
)

func GetCourses(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		program := strings.TrimSpace(r.URL.Query().Get("program"))

		query := `SELECT id, title, description, program, provider, duration, price_mmk FROM courses`
		args := []any{}

		if program != "" {
			query += ` WHERE program = $1 ORDER BY id`
			args = append(args, program)
		} else {
			query += ` ORDER BY program, id`
		}

		rows, err := pool.Query(r.Context(), query, args...)
		if err != nil {
			jsonError(w, "failed to fetch courses", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		courses := make([]model.Course, 0)
		for rows.Next() {
			var c model.Course
			if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.Program, &c.Provider, &c.Duration, &c.PriceMMK); err != nil {
				continue
			}
			courses = append(courses, c)
		}
		if err := rows.Err(); err != nil {
			jsonError(w, "error reading courses", http.StatusInternalServerError)
			return
		}

		jsonOK(w, http.StatusOK, map[string]any{"courses": courses})
	}
}

func jsonOK(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func jsonError(w http.ResponseWriter, msg string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
