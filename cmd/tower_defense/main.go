package main

import (
    "errors"
    "fmt"
)

// Tower represents a tower in the game
type Tower struct {
    Name  string
    Power int
}

// Enemy represents an enemy in the game
type Enemy struct {
    Name       string
    Difficulty int
}

// GameState holds the game state including towers and enemies
type GameState struct {
    Towers  []Tower
    Enemies []Enemy
    Points  int
}

// ValidateTower checks if the tower has valid properties
func (t Tower) Validate() error {
    if t.Name == "" {
        return errors.New("Tower name cannot be empty")
    }
    if t.Power < 0 {
        return errors.New("Tower power cannot be negative")
    }
    return nil
}

// ValidateEnemy checks if the enemy has valid properties
func (e Enemy) Validate() error {
    if e.Name == "" {
        return errors.New("Enemy name cannot be empty")
    }
    if e.Difficulty < 0 {
        return errors.New("Enemy difficulty cannot be negative")
    }
    return nil
}

// AddTower adds a tower to the game state after validation
func (gs *GameState) AddTower(t Tower) error {
    if err := t.Validate(); err != nil {
        return err
    }
    gs.Towers = append(gs.Towers, t)
    return nil
}

// AddEnemy adds an enemy to the game state after validation
func (gs *GameState) AddEnemy(e Enemy) error {
    if err := e.Validate(); err != nil {
        return err
    }
    gs.Enemies = append(gs.Enemies, e)
    return nil
}

// UpdatePoints updates the Game State points
func (gs *GameState) UpdatePoints(points int) {
    gs.Points += points
}

func main() {
    gs := &GameState{}
    
    tower := Tower{Name: "Cannon", Power: 10}
    if err := gs.AddTower(tower); err != nil {
        fmt.Println(err)
    }
    
    enemy := Enemy{Name: "Goblin", Difficulty: 1}
    if err := gs.AddEnemy(enemy); err != nil {
        fmt.Println(err)
    }
    
    fmt.Printf("Game state: %+v\n", gs)
}