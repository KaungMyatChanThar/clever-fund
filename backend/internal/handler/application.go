package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/cleverfund/backend/internal/model"
)

func CreateApplication(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req model.CreateApplicationRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			jsonError(w, "invalid request body", http.StatusBadRequest)
			return
		}

		req.FullName = strings.TrimSpace(req.FullName)
		req.Contact = strings.TrimSpace(req.Contact)
		req.Program = strings.TrimSpace(req.Program)
		req.Motivation = strings.TrimSpace(req.Motivation)

		if req.FullName == "" || req.Contact == "" || req.Program == "" {
			jsonError(w, "full_name, contact, and program are required", http.StatusBadRequest)
			return
		}

		var app model.Application
		err := pool.QueryRow(r.Context(), `
			INSERT INTO applications (full_name, contact, program, motivation)
			VALUES ($1, $2, $3, $4)
			RETURNING id, full_name, contact, program, motivation, created_at
		`, req.FullName, req.Contact, req.Program, req.Motivation).Scan(
			&app.ID, &app.FullName, &app.Contact, &app.Program, &app.Motivation, &app.CreatedAt,
		)
		if err != nil {
			jsonError(w, "failed to save application", http.StatusInternalServerError)
			return
		}

		rows, err := pool.Query(r.Context(), `
			SELECT id, title, description, program, provider, duration, price_mmk
			FROM courses
			WHERE program = $1
			ORDER BY id
		`, req.Program)
		if err != nil {
			jsonError(w, "failed to fetch matched courses", http.StatusInternalServerError)
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

		jsonOK(w, http.StatusCreated, map[string]any{
			"application":     app,
			"matched_courses": courses,
		})
	}
}
