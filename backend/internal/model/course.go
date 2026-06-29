package model

type Course struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Program     string `json:"program"`
	Provider    string `json:"provider"`
	Duration    string `json:"duration"`
	PriceMMK    int    `json:"price_mmk"`
}
