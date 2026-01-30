# Architecture Styles

## Table of Contents
- [Layered Architecture](#layered-architecture)
- [Hexagonal Architecture](#hexagonal-architecture)
- [Clean Architecture](#clean-architecture)
- [Comparison](#comparison)
- [Selection Guide](#selection-guide)

---

## Layered Architecture

Traditional horizontal layering. Most common, easiest to understand.

```
┌─────────────────────────────────────┐
│  Presentation Layer (Controllers)   │
├─────────────────────────────────────┤
│  Application Layer (Use Cases)      │
├─────────────────────────────────────┤
│  Domain Layer (Entities, Services)  │
├─────────────────────────────────────┤
│  Infrastructure Layer (DB, HTTP)    │
└─────────────────────────────────────┘
```

**Structure:**
```
project/
├── domain/
│   ├── entities/
│   ├── value_objects/
│   ├── services/
│   └── repositories.py      # Protocols only
├── application/
│   ├── commands/
│   ├── queries/
│   └── dto/
├── infrastructure/
│   ├── persistence/
│   ├── external_services/
│   └── messaging/
└── interfaces/
    ├── api/
    ├── cli/
    └── events/
```

**Dependency Rule:**
- Domain has no dependencies
- Application depends on Domain
- Infrastructure depends on Domain/Application
- Interface depends on Application/Infrastructure

**When to use:**
- CRUD-heavy applications
- Teams new to architecture patterns
- Simple domains without complex business rules

---

## Hexagonal Architecture

Also known as Ports and Adapters. Focus on making domain independent of frameworks.

```
                    ┌─────────────────┐
                    │   External UI   │
                    └────────┬────────┘
                             │
┌──────────────┐      ┌──────┴──────┐      ┌──────────────┐
│  External    │◄────►│   Domain    │◄────►│  External    │
│  Service     │      │   (Core)    │      │  Database    │
└──────────────┘      └──────┬──────┘      └──────────────┘
                             │
                    ┌────────┴────────┐
                    │  External API   │
                    └─────────────────┘

        ◄────► = Port (interface)
        External = Adapter (implementation)
```

**Structure:**
```
project/
├── domain/                  # Core - no dependencies
│   ├── model/
│   ├── ports/
│   │   ├── inbound/        # Driven ports (use cases)
│   │   └── outbound/       # Driving ports (repositories)
│   └── services/
├── application/             # Use case implementations
│   └── services/
├── adapters/                # External world
│   ├── inbound/            # Driving adapters
│   │   ├── web/
│   │   ├── cli/
│   │   └── messaging/
│   └── outbound/           # Driven adapters
│       ├── persistence/
│       ├── external_api/
│       └── notifications/
└── configuration/           # Wiring everything
```

**Ports (Interfaces):**
```python
# domain/ports/inbound/order_service.py
class OrderService(Protocol):
    """Primary port - driven by external actors"""
    def create_order(self, command: CreateOrderCommand) -> OrderResult: ...
    def cancel_order(self, order_id: str) -> None: ...

# domain/ports/outbound/order_repository.py
class OrderRepository(Protocol):
    """Secondary port - drives external systems"""
    def save(self, order: Order) -> None: ...
    def find_by_id(self, order_id: str) -> Optional[Order]: ...
```

**Adapters (Implementations):**
```python
# adapters/outbound/persistence/sql_order_repository.py
class SQLOrderRepository:
    def __init__(self, session: Session):
        self._session = session
    
    def save(self, order: Order) -> None:
        orm_order = self._to_orm(order)
        self._session.merge(orm_order)
```

**Configuration (Wiring):**
```python
# configuration/container.py
def configure() -> Application:
    # Adapters
    db_session = create_session()
    
    # Driven adapters (outbound)
    order_repo = SQLOrderRepository(db_session)
    payment_gateway = StripePaymentAdapter()
    
    # Domain service with ports injected
    order_service = OrderServiceImpl(
        repository=order_repo,
        payment=payment_gateway
    )
    
    # Driving adapters (inbound)
    api_controller = OrderController(order_service)
    
    return Application(api_controller)
```

**When to use:**
- Need to swap frameworks (DB, web framework)
- Testing is critical
- Long-lived projects with changing requirements

---

## Clean Architecture

Robert C. Martin's evolution of layered/hexagonal. Concentric circles with strict dependency rule.

```
         ┌───────────────────────┐
         │    External Layer     │  Frameworks, UI, DB
         │  ┌─────────────────┐  │
         │  │ Interface Layer │  │  Controllers, Presenters
         │  │ ┌─────────────┐ │  │
         │  │ │  Use Cases  │ │  │  Application Business Rules
         │  │ │ ┌─────────┐ │ │  │
         │  │ │ │ Entities│ │ │  │  Enterprise Business Rules
         │  │ │ │ (Domain)│ │ │  │
         │  │ │ └─────────┘ │ │  │
         │  │ └─────────────┘ │  │
         │  └─────────────────┘  │
         └───────────────────────┘

     Dependency direction: Inward only
```

**Structure:**
```
project/
├── enterprise/              # Inner circle - most stable
│   └── entities/
│       ├── core_domain.py
│       └── shared_kernel.py
├── application/             # Use cases
│   ├── boundaries/         # Input/output ports
│   ├── usecases/
│   └── dto/
├── interface_adapters/      # Presenters, controllers
│   ├── controllers/
│   ├── presenters/
│   └── view_models/
├── frameworks/              # Outer circle - most volatile
│   ├── web_framework/
│   ├── database/
│   └── external_services/
└── main.py                  # Composition root
```

**The Dependency Rule:**
- Source code dependencies point inward
- Inner circles know nothing about outer circles
- Data formats crossing boundaries should be simple structures

**Use Case Example:**
```python
# application/usecases/create_order.py
@dataclass
class CreateOrderInput:
    customer_id: str
    items: List[ItemDto]

@dataclass
class CreateOrderOutput:
    order_id: str
    total: Decimal
    status: str

class CreateOrderUseCase:
    def __init__(
        self,
        order_repo: OrderRepository,
        customer_repo: CustomerRepository,
        presenter: CreateOrderPresenter
    ):
        self._order_repo = order_repo
        self._customer_repo = customer_repo
        self._presenter = presenter
    
    def execute(self, input: CreateOrderInput) -> None:
        customer = self._customer_repo.get(input.customer_id)
        order = Order.create(customer, input.items)
        self._order_repo.save(order)
        
        output = CreateOrderOutput(
            order_id=order.id,
            total=order.total,
            status=order.status.value
        )
        self._presenter.present(output)

# interface_adapters/presenters/order_presenter.py
class CreateOrderPresenter:
    def present(self, output: CreateOrderOutput) -> None:
        # Format for specific UI (web, CLI, etc.)
        ...
```

**When to use:**
- Complex business domains
- Multiple UIs (web, mobile, CLI) sharing logic
- High testability requirements
- Long-term enterprise projects

---

## Comparison

| Aspect | Layered | Hexagonal | Clean |
|--------|---------|-----------|-------|
| **Focus** | Technical separation | Dependency inversion | Business rules centrality |
| **Structure** | Horizontal layers | Ports/Adapters | Concentric circles |
| **Domain location** | Middle layer | Center | Inner circle |
| **Flexibility** | Medium | High | High |
| **Complexity** | Low | Medium | Medium-High |
| **Best for** | CRUD apps | Framework swaps | Complex domains |
| **Dependencies** | Top-down | Inward | Inward |

---

## Selection Guide

**Choose Layered when:**
- Team is new to architecture patterns
- Simple CRUD operations dominate
- Standard framework (Django, Rails, Spring) does most work
- Rapid prototyping needed

**Choose Hexagonal when:**
- Need to swap databases or frameworks
- Heavy testing requirements
- Multiple external integrations
- Team understands dependency inversion

**Choose Clean when:**
- Complex business domain
- Multiple delivery mechanisms (web, mobile, API)
- Domain will outlive frameworks
- Team experienced with DDD

---

## Hybrid Approaches

Most real projects mix these. Common hybrid:

```
project/
├── domain/                  # Clean/Hexagonal: Pure domain
│   ├── entities/
│   ├── value_objects/
│   └── services/
├── application/             # Layered: Commands/Queries
│   ├── commands/
│   ├── queries/
│   └── ports/
├── infrastructure/          # Hexagonal: Adapters
│   ├── persistence/
│   ├── messaging/
│   └── external/
└── interfaces/              # Layered: Input mechanisms
    ├── api/
    ├── cli/
    └── events/
```

**Guidelines:**
1. Start with Layered for speed
2. Add Repository pattern early
3. Extract to Hexagonal when testing pain appears
4. Move to Clean when domain complexity demands
