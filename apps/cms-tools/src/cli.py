from __future__ import annotations

import sys
from pathlib import Path
import click
from rich.console import Console
from rich.table import Table

from src.validator import validate_catalogue, validate_lesson_file
from src.cdacc_database import (
    CDACC_UNIT_REGISTRY,
    all_unit_ids,
    lookup_unit,
    lookup_units_for_lesson,
    units_by_level,
    units_by_type,
)

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


# ─── CDACC subcommand group ──────────────────────────────────────────────────

@main.group("cdacc")
def cdacc_group() -> None:
    """CDACC TVET unit database commands."""
    pass


@cdacc_group.command("list-units")
@click.option("--level", type=int, default=None, help="Filter by KNQA level (1–8).")
@click.option("--type", "unit_type", default=None, help="Filter by unit type: FD, CR, or EL.")
def cdacc_list_units(level: int | None, unit_type: str | None) -> None:
    """List all registered CDACC TVET units."""
    units = CDACC_UNIT_REGISTRY
    if level is not None:
        units = [u for u in units if u.knqa_level == level]
    if unit_type is not None:
        units = [u for u in units if u.unit_type == unit_type.upper()]

    table = Table(title="CDACC TVET Unit Registry")
    table.add_column("Unit ID", style="cyan")
    table.add_column("Title", style="white")
    table.add_column("Type", style="yellow")
    table.add_column("KNQA Level", style="green")
    table.add_column("Lessons", style="dim")

    for unit in units:
        table.add_row(
            unit.unit_id,
            unit.title,
            unit.unit_type,
            str(unit.knqa_level),
            ", ".join(unit.suggested_cyberlearn_lessons) or "—",
        )

    console.print(table)
    console.print(f"\nTotal: [bold]{len(units)}[/bold] units registered.")


@cdacc_group.command("unit-info")
@click.argument("unit_id")
def cdacc_unit_info(unit_id: str) -> None:
    """Show full details for a CDACC unit by its ID."""
    unit = lookup_unit(unit_id)
    if unit is None:
        console.print(f"[red]Unit '{unit_id}' not found in CDACC registry.[/red]")
        sys.exit(1)

    console.rule(f"[bold]{unit.unit_id}[/bold]")
    console.print(f"[bold]Title:[/bold]       {unit.title}")
    console.print(f"[bold]Type:[/bold]        {unit.unit_type} ({'Core' if unit.unit_type == 'CR' else 'Elective' if unit.unit_type == 'EL' else 'Foundation'})")
    console.print(f"[bold]KNQA Level:[/bold]  {unit.knqa_level}")
    console.print(f"[bold]Sector:[/bold]      {unit.sector} / {unit.sub_sector}")
    console.print(f"\n[bold]Description:[/bold]\n  {unit.description}\n")

    if unit.learning_outcomes:
        console.print("[bold]Learning Outcomes:[/bold]")
        for i, lo in enumerate(unit.learning_outcomes, 1):
            console.print(f"  {i}. {lo}")

    if unit.performance_criteria:
        console.print("\n[bold]Performance Criteria:[/bold]")
        for i, pc in enumerate(unit.performance_criteria, 1):
            console.print(f"  {i}. {pc}")

    if unit.suggested_cyberlearn_lessons:
        console.print(f"\n[bold]Mapped CyberLearn Lessons:[/bold]  {', '.join(unit.suggested_cyberlearn_lessons)}")
    else:
        console.print("\n[yellow]No CyberLearn lessons mapped yet.[/yellow]")


@cdacc_group.command("check-lesson-coverage")
@click.argument("lesson_id")
def cdacc_check_lesson(lesson_id: str) -> None:
    """Show which CDACC units a CyberLearn lesson satisfies."""
    units = lookup_units_for_lesson(lesson_id)
    if not units:
        console.print(f"[yellow]Lesson '{lesson_id}' is not mapped to any CDACC unit yet.[/yellow]")
        console.print("Add it to the suggested_cyberlearn_lessons list in apps/cms-tools/src/cdacc_database.py")
        return

    table = Table(title=f"CDACC Units satisfied by '{lesson_id}'")
    table.add_column("Unit ID", style="cyan")
    table.add_column("Title", style="white")
    table.add_column("Type", style="yellow")
    table.add_column("KNQA Level", style="green")
    for unit in units:
        table.add_row(unit.unit_id, unit.title, unit.unit_type, str(unit.knqa_level))
    console.print(table)


@cdacc_group.command("coverage-report")
def cdacc_coverage_report() -> None:
    """Show a full coverage report: which CDACC units have no CyberLearn lessons yet."""
    covered = [u for u in CDACC_UNIT_REGISTRY if u.suggested_cyberlearn_lessons]
    uncovered = [u for u in CDACC_UNIT_REGISTRY if not u.suggested_cyberlearn_lessons]

    console.print(f"\n[bold]CDACC Coverage Report[/bold]")
    console.print(f"  Total units: [bold]{len(CDACC_UNIT_REGISTRY)}[/bold]")
    console.print(f"  With CyberLearn lessons: [green]{len(covered)}[/green]")
    console.print(f"  Without lessons (gaps):  [red]{len(uncovered)}[/red]")

    if uncovered:
        console.print("\n[bold red]Units with no CyberLearn lessons yet:[/bold red]")
        for u in uncovered:
            console.print(f"  • [cyan]{u.unit_id}[/cyan] — {u.title} (Level {u.knqa_level}, {u.unit_type})")


if __name__ == "__main__":
    main()

