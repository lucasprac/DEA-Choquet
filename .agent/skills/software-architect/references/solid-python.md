# SOLID Principles in Python

## Table of Contents
- [Single Responsibility](#single-responsibility-srp)
- [Open/Closed](#openclosed-ocp)
- [Liskov Substitution](#liskov-substitution-lsp)
- [Interface Segregation](#interface-segregation-isp)
- [Dependency Inversion](#dependency-inversion-dip)

---

## Single Responsibility (SRP)

A class should have one reason to change.

**Violation:**
```python
class EmployeeService:
    def calculate_pay(self, employee): ...      # HR responsibility
    def report_hours(self, employee): ...       # Accounting responsibility  
    def save_to_database(self, employee): ...   # Persistence responsibility
```

**Correct:**
```python
class PayCalculator:
    def calculate(self, employee: Employee) -> Money:
        ...

class HoursReporter:
    def report(self, employee: Employee) -> Timesheet:
        ...

class EmployeeRepository:
    def save(self, employee: Employee) -> None:
        ...

class EmployeeFacade:
    """Coordinating facade, not doing the work"""
    def __init__(self, calculator, reporter, repository):
        self._calculator = calculator
        self._reporter = reporter
        self._repository = repository
```

---

## Open/Closed (OCP)

Open for extension, closed for modification.

**Strategy Pattern:**
```python
from typing import Protocol

class DiscountStrategy(Protocol):
    def calculate_discount(self, order: Order) -> Money:
        ...

class RegularCustomerDiscount:
    def calculate_discount(self, order: Order) -> Money:
        return order.total * 0.05

class PremiumCustomerDiscount:
    def calculate_discount(self, order: Order) -> Money:
        return order.total * 0.15

class DiscountCalculator:
    def __init__(self, strategy: DiscountStrategy):
        self._strategy = strategy
    
    def get_discount(self, order: Order) -> Money:
        return self._strategy.calculate_discount(order)

# Extend without modifying
calculator = DiscountCalculator(PremiumCustomerDiscount())
```

**Policy Pattern with Registry:**
```python
class PricingPolicy(ABC):
    @abstractmethod
    def applies_to(self, product: Product) -> bool: ...
    
    @abstractmethod
    def calculate_price(self, product: Product) -> Money: ...

class PricingEngine:
    def __init__(self):
        self._policies: List[PricingPolicy] = []
    
    def register(self, policy: PricingPolicy) -> None:
        self._policies.append(policy)
    
    def calculate_price(self, product: Product) -> Money:
        for policy in self._policies:
            if policy.applies_to(product):
                return policy.calculate_price(product)
        return product.base_price
```

---

## Liskov Substitution (LSP)

Subtypes must be substitutable for their base types.

**Violation:**
```python
class Rectangle:
    def __init__(self, width, height):
        self._width = width
        self._height = height
    
    def set_width(self, value):
        self._width = value
    
    def set_height(self, value):
        self._height = value

class Square(Rectangle):  # Violates LSP!
    def set_width(self, value):
        self._width = value
        self._height = value  # Side effect breaks expectations
    
    def set_height(self, value):
        self._width = value
        self._height = value
```

**Correct - Composition over Inheritance:**
```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Rectangle:
    width: float
    height: float
    
    def area(self) -> float:
        return self.width * self.height

@dataclass(frozen=True)
class Square:
    side: float
    
    def area(self) -> float:
        return self.side ** 2
    
    def to_rectangle(self) -> Rectangle:
        return Rectangle(self.side, self.side)

# Or use a common interface
class Shape(Protocol):
    def area(self) -> float: ...
```

**Pre/Post Conditions:**
```python
class OrderProcessor(ABC):
    @abstractmethod
    def process(self, order: Order) -> Receipt:
        """
        Pre: order.is_valid()
        Post: receipt.order_id == order.id
        """
        ...

class StandardOrderProcessor(OrderProcessor):
    def process(self, order: Order) -> Receipt:
        # Can strengthen preconditions? NO
        # Can weaken preconditions? YES
        # Can strengthen postconditions? YES
        # Can weaken postconditions? NO
        ...
```

---

## Interface Segregation (ISP)

Don't force clients to depend on methods they don't use.

**Violation:**
```python
class Machine(ABC):
    @abstractmethod
    def print(self, document): ...
    @abstractmethod
    def scan(self, document): ...
    @abstractmethod
    def fax(self, document): ...

class OldPrinter(Machine):  # Forced to implement scan/fax!
    def print(self, doc): ...
    def scan(self, doc): raise NotImplementedError()
    def fax(self, doc): raise NotImplementedError()
```

**Correct:**
```python
class Printer(Protocol):
    def print(self, document: Document) -> None: ...

class Scanner(Protocol):
    def scan(self) -> Document: ...

class Fax(Protocol):
    def fax(self, document: Document) -> None: ...

class MultiFunctionDevice(Printer, Scanner, Fax): ...

class SimplePrinter:
    def print(self, document: Document) -> None:
        ...  # No forced dependencies
```

**Protocol Granularity:**
```python
# Too broad
class Repository(Protocol[T]):
    def get(self, id: str) -> T: ...
    def find(self, spec: Spec) -> List[T]: ...
    def add(self, entity: T) -> None: ...
    def update(self, entity: T) -> None: ...
    def remove(self, id: str) -> None: ...
    def count(self) -> int: ...

# Better - split by use case
class Readable(Protocol[T]):
    def get(self, id: str) -> T: ...

class Writable(Protocol[T]):
    def add(self, entity: T) -> None: ...

class QueryService(Protocol[T]):
    def find(self, criteria: Query) -> List[T]: ...

# Client depends only on what it needs
class ReportGenerator:
    def __init__(self, repository: Readable[Order]):
        ...
```

---

## Dependency Inversion (DIP)

Depend on abstractions, not concretions.

**Violation:**
```python
class OrderService:
    def __init__(self):
        self._repository = SQLOrderRepository()  # Concrete!
        self._email_service = SmtpEmailService()  # Concrete!
```

**Correct - Constructor Injection:**
```python
class OrderService:
    def __init__(
        self,
        repository: IOrderRepository,  # Protocol
        notifier: INotificationService  # Protocol
    ):
        self._repository = repository
        self._notifier = notifier
```

**Dependency Injection Patterns:**

```python
# 1. Constructor Injection (preferred)
class OrderHandler:
    def __init__(self, service: OrderService, validator: OrderValidator):
        self._service = service
        self._validator = validator

# 2. Factory Injection
class OrderHandler:
    def __init__(self, service_factory: Callable[[], OrderService]):
        self._service_factory = service_factory

# 3. Optional with defaults
class OrderHandler:
    def __init__(
        self,
        service: OrderService,
        logger: Optional[Logger] = None
    ):
        self._service = service
        self._logger = logger or NullLogger()
```

**Composition Root:**
```python
# composition_root.py - Only place with 'new'
def create_application(config: Config) -> Application:
    # Infrastructure
    db = Database(config.db_url)
    cache = RedisCache(config.redis_url)
    
    # Repositories
    order_repo = SQLOrderRepository(db)
    customer_repo = SQLCustomerRepository(db)
    
    # Services
    pricing = PricingService(discount_calculator=SeasonalDiscount())
    notification = EmailNotificationService(
        smtp=SmtpClient(config.smtp_host),
        template_engine=JinjaTemplates()
    )
    
    # Domain Services
    order_service = OrderService(
        repository=order_repo,
        pricing=pricing,
        notification=notification
    )
    
    # Handlers
    create_handler = CreateOrderHandler(order_service)
    cancel_handler = CancelOrderHandler(order_service, customer_repo)
    
    return Application(create_handler, cancel_handler)
```

**Abstract Factory:**
```python
class RepositoryFactory(Protocol):
    def create_order_repo(self) -> IOrderRepository: ...
    def create_customer_repo(self) -> ICustomerRepository: ...

class SQLRepositoryFactory:
    def __init__(self, session: Session):
        self._session = session
    
    def create_order_repo(self) -> IOrderRepository:
        return SQLOrderRepository(self._session)
    
    def create_customer_repo(self) -> ICustomerRepository:
        return SQLCustomerRepository(self._session)

# Usage in tests
class InMemoryRepositoryFactory:
    def create_order_repo(self) -> IOrderRepository:
        return InMemoryOrderRepository()
```

---

## Protocol vs ABC

| Use | When |
|-----|------|
| **Protocol** | Structural subtyping, implicit implementation, flexibility |
| **ABC** | Strict inheritance required, shared base implementation |

```python
# Protocol - Duck typing
class Flyer(Protocol):
    def fly(self) -> None: ...

class Bird:
    def fly(self) -> None: ...  # Is a Flyer automatically

# ABC - Inheritance required
class Animal(ABC):
    @abstractmethod
    def speak(self) -> str: ...
    
    def breathe(self) -> None:  # Shared implementation
        ...

class Dog(Animal):  # Must inherit
    def speak(self) -> str:
        return "Woof"
```
