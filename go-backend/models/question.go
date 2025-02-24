package models

type SeedQuestion struct {
	ID        int    `json:"id"`
	Question  string `json:"question"`
	ChapterID int    `json:"chapterId"`
}
