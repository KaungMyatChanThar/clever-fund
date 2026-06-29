package model

import "time"

type Application struct {
	ID         string    `json:"id"`
	FullName   string    `json:"full_name"`
	Contact    string    `json:"contact"`
	Program    string    `json:"program"`
	Motivation string    `json:"motivation,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
}

type CreateApplicationRequest struct {
	FullName   string `json:"full_name"`
	Contact    string `json:"contact"`
	Program    string `json:"program"`
	Motivation string `json:"motivation"`
}
