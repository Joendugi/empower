from __future__ import annotations

import sys
from pathlib import Path
import click
from rich.console import Console
from rich.table import Table

from src.validator import validate_catalogue, validate_lesson_file

console = Console()


@click.group()
def main() -> None:
    """CyberLearn Curriculum & Content CLI."""
    pass


@main.command("validate")
@click.argument("path", type=click.Path(exists=True, path_type=Path))
def validate_command(path: Path) -> None:
    """Validate a lesson file or directory of lesson YAML files."""
    files = list(path.glob("**/*.yaml")) if path.is_dir() else [path]

    if not files:
        console.print(f"[yellow]No YAML lesson files found at {path}[/yellow]")
        return

    table = Table(title="CyberLearn Content Validation")
    table.add_column("File", style="cyan")
    table.add_column("Status", style="bold")
    table.add_column("Details", style="white")

    total_errors = 0
    total_warnings = 0

    for file in files:
        res = validate_lesson_file(file)
        if res.is_valid:
            status = "[green]PASS[/green]"
            details = f"{len(res.warnings)} warnings" if res.warnings else "OK"
        else:
            status = "[red]FAIL[/red]"
            details = "; ".join(res.errors)

        if res.warnings and res.is_valid:
            details += f" ({'; '.join(res.warnings)})"

        table.add_row(str(file.name), status, details)
        total_errors += len(res.errors)
        total_warnings += len(res.warnings)

    console.print(table)

    if total_errors > 0:
        console.print(f"\n[red]Validation failed with {total_errors} error(s).[/red]")
        sys.exit(1)
    else:
        console.print(f"\n[green]All {len(files)} files passed validation ({total_warnings} warnings).[/green]")


@main.command("validate-catalogue")
@click.argument("path", type=click.Path(exists=True, path_type=Path))
def validate_catalogue_command(path: Path) -> None:
    """Fail if a featured id or path lesson_ids entry is missing from content/."""
    res = validate_catalogue(path)
    if res.errors:
        for error in res.errors:
            console.print(f"[red]{error}[/red]")
        sys.exit(1)
    console.print(f"[green]Catalogue OK ({len(res.warnings)} warnings).[/green]")


if __name__ == "__main__":
    main()

