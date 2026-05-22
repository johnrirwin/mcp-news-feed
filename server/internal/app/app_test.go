package app

import (
	"strings"
	"testing"

	"github.com/johnrirwin/flyingforge/internal/config"
)

func TestNew_RejectsInvalidProductionJWTSecret(t *testing.T) {
	app, err := New(&config.Config{
		Environment: "production",
		Logging:     config.LoggingConfig{Level: "error"},
		Auth:        config.AuthConfig{JWTSecret: config.DefaultJWTSecret},
	})
	if err == nil {
		t.Fatal("expected New to reject an insecure production JWT secret")
	}
	if app != nil {
		t.Fatal("expected no app instance on invalid configuration")
	}
	if !strings.Contains(err.Error(), "AUTH_JWT_SECRET") {
		t.Fatalf("expected AUTH_JWT_SECRET validation error, got %v", err)
	}
}
