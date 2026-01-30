---
name: software-architect
description: Software architecture design using DDD, SOLID principles, and design patterns. Use when Kimi needs to design system architecture, refactor code for better structure, apply design patterns, implement layered architectures, or create maintainable software structures. Triggers include - "Design architecture for...", "Apply DDD/SOLID to...", "Refactor this to use Repository pattern", "Set up CQRS/Clean Architecture/Hexagonal", "Create interfaces and abstractions", "Separate concerns in this codebase".
---

# Software Architect Skill

Design robust, maintainable software architectures using Domain-Driven Design, SOLID principles, and proven design patterns.

## Quick Decision Matrix

| Goal | Pattern | Reference |
|------|---------|-----------|
| Separate business logic from infrastructure | Layered Architecture | [architecture-styles.md](references/architecture-styles.md) |
| Make domain independent of frameworks | Hexagonal/Clean Arch | [architecture-styles.md](references/architecture-styles.md) |
| Model complex business domains | DDD Tactical Patterns | [ddd-patterns.md](references/ddd-patterns.md) |
| Enable testing without database | Repository + Unit of Work | [design-patterns.md](references/design-patterns.md) |
| Swap implementations (solvers, providers) | Strategy + Factory | [design-patterns.md](references/design-patterns.md) |
| Optimize reads separately from writes | CQRS | [design-patterns.md](references/design-patterns.md) |
| Decouple components | Dependency Injection | [solid-python.md](references/solid-python.md) |

## Core Principles

### 1. Dependency Rule
Dependencies point inward: Interface → Application → Domain. Infrastructure depends on abstractions defined in inner layers.

### 2. Protocols over ABCs (Python)
Use `typing.Protocol` for interfaces - no inheritance required, more flexible.

```python
from typing import Protocol

class IRepository(Protocol[T]):
    def get(self, id: str) -> T: ...
    def save(self, entity: T) -> None: ...
```

### 3. Composition Root
Wire dependencies at application entry point, not inside classes:

```python
# main.py - Composition Root
repository = SQLRepository(db_session)
service = DomainService(repository)
handler = CommandHandler(service)
```

## Workflow

1. **Analyze**: Identify bounded contexts, aggregates, use cases
2. **Design**: Choose architecture style, define interfaces
3. **Structure**: Create layer directories, define module boundaries
4. **Implement**: Start with domain, work outward
5. **Wire**: Set up DI container at composition root

## When to Use References

- **DDD details**: Aggregates, Value Objects, Domain Events → [ddd-patterns.md](references/ddd-patterns.md)
- **SOLID in Python**: Protocols, DI patterns → [solid-python.md](references/solid-python.md)
- **Pattern implementations**: Repository, Strategy, CQRS → [design-patterns.md](references/design-patterns.md)
- **Architecture comparison**: Layered vs Hexagonal vs Clean → [architecture-styles.md](references/architecture-styles.md)

## Template Selection

Use `assets/project-templates/` for boilerplate:
- **layered/**: Classic 4-layer (Domain, Application, Infrastructure, Interface)
- **hexagonal/**: Ports and Adapters style
- **clean/**: Clean Architecture with explicit use cases
