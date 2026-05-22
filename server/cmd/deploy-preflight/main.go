package main

import (
	"fmt"
	"io"
	"os"

	"github.com/johnrirwin/flyingforge/internal/config"
)

func main() {
	if err := run(os.Stdout, os.Getenv); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(stdout io.Writer, getenv func(string) string) error {
	if err := config.ValidateDeployAuthSecrets(
		getenv("AUTH_JWT_SECRET"),
		getenv("MCP_AUTH_PRIVATE_KEY_PEM"),
	); err != nil {
		return err
	}

	_, err := fmt.Fprintln(stdout, "Deploy auth secret preflight passed.")
	return err
}
