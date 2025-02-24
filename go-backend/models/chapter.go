package models

type Chapter struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	CourseID int    `json:"courseId"`
}
