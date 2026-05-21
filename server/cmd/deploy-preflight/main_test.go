package main

import (
	"bytes"
	"strings"
	"testing"
)

func TestRun(t *testing.T) {
	tests := []struct {
		name    string
		env     map[string]string
		wantErr string
		wantOut string
	}{
		{
			name: "valid secrets",
			env: map[string]string{
				"AUTH_JWT_SECRET":          "this-is-a-strong-production-secret-1234",
				"MCP_AUTH_PRIVATE_KEY_PEM": "-----BEGIN PRIVATE KEY-----\npretend-key\n-----END PRIVATE KEY-----",
			},
			wantOut: "Deploy auth secret preflight passed.\n",
		},
		{
			name: "invalid jwt secret bubbles shared validation error",
			env: map[string]string{
				"AUTH_JWT_SECRET":          "too-short-secret",
				"MCP_AUTH_PRIVATE_KEY_PEM": "-----BEGIN PRIVATE KEY-----\npretend-key\n-----END PRIVATE KEY-----",
			},
			wantErr: "AUTH_JWT_SECRET must be at least 32 characters",
		},
		{
			name: "missing private key pem",
			env: map[string]string{
				"AUTH_JWT_SECRET": "this-is-a-strong-production-secret-1234",
			},
			wantErr: "MCP_AUTH_PRIVATE_KEY_PEM is required",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var output bytes.Buffer
			err := run(&output, func(key string) string {
				return tt.env[key]
			})

			if tt.wantErr != "" {
				if err == nil {
					t.Fatalf("expected error containing %q", tt.wantErr)
				}
				if !strings.Contains(err.Error(), tt.wantErr) {
					t.Fatalf("expected error containing %q, got %v", tt.wantErr, err)
				}
				return
			}

			if err != nil {
				t.Fatalf("run() error = %v", err)
			}
			if output.String() != tt.wantOut {
				t.Fatalf("run() output = %q, want %q", output.String(), tt.wantOut)
			}
		})
	}
}
