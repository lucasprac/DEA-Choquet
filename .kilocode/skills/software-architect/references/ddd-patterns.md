# DDD Tactical Patterns

## Table of Contents
- [Entity](#entity)
- [Value Object](#value-object)
- [Aggregate](#aggregate)
- [Domain Service](#domain-service)
- [Domain Event](#domain-event)
- [Repository](#repository)
- [Factory](#factory)
- [Specification](#specification)

---

## Entity

Has identity that persists through state changes.

```python
from dataclasses import dataclass, field
from typing import NewType

OrderId = NewType('OrderId', str)

@dataclass
class Order:
    id: OrderId                    # Identity
    customer_id: str               # Reference to other aggregate
    items: List[OrderItem] = field(default_factory=list)
    _status: OrderStatus = OrderStatus.PENDING
    
    def add_item(self, product: Product, quantity: int) -> None:
        if quantity <= 0:
            raise DomainError("Quantity must be positive")
        self.items.append(OrderItem(product.id, quantity, product.price))
        self._recalculate_total()
    
    def confirm(self) -> None:
        if not self.items:
            raise DomainError("Cannot confirm empty order")
        self._status = OrderStatus.CONFIRMED
        self._register_event(OrderConfirmed(self.id))
```

**Rules:**
- Identity determined at creation, never changes
- Mutable state through behavior methods
- Encapsulate business invariants
- Raise domain errors for invalid operations

---

## Value Object

Immutable, defined by attributes, no identity.

```python
from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class Money:
    amount: Decimal
    currency: str
    
    def __post_init__(self):
        if self.amount < 0:
            raise DomainError("Money cannot be negative")
        if len(self.currency) != 3:
            raise DomainError("Invalid currency code")
    
    def add(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise DomainError("Cannot add different currencies")
        return Money(self.amount + other.amount, self.currency)
    
    def __eq__(self, other):
        if not isinstance(other, Money):
            return False
        return self.amount == other.amount and self.currency == other.currency
```

**Rules:**
- Use `@dataclass(frozen=True)`
- Validate in `__post_init__`
- Operations return new instances
- Value equality (not identity)

---

## Aggregate

Cluster of entities and value objects with transactional consistency boundary.

```python
@dataclass
class Order:  # Aggregate Root
    id: OrderId
    _items: List[OrderItem] = field(default_factory=list)
    _events: List[DomainEvent] = field(default_factory=list, repr=False)
    
    # Only expose what's needed
    @property
    def total(self) -> Money:
        return sum((item.subtotal for item in self._items), Money.zero())
    
    @property
    def items(self) -> Tuple[OrderItem, ...]:
        return tuple(self._items)  # Immutable view
    
    def add_item(self, product: Product, qty: int) -> None:
        # Enforce invariant: max 10 items per order
        if len(self._items) >= 10:
            raise DomainError("Order cannot exceed 10 items")
        self._items.append(OrderItem(product, qty))
    
    def _register_event(self, event: DomainEvent) -> None:
        self._events.append(event)
    
    def pull_events(self) -> List[DomainEvent]:
        events = self._events[:]
        self._events.clear()
        return events
```

**Rules:**
- Root is the only entry point
- External refs via identity (not object refs)
- One transaction = one aggregate
- Events captured for side effects

---

## Domain Service

Stateless business logic that doesn't belong to an entity.

```python
class PricingService:
    """Calculates pricing across aggregates"""
    
    def calculate_order_total(
        self, 
        order: Order,
        customer: Customer,
        promotions: List[Promotion]
    ) -> Money:
        subtotal = order.total
        
        # Apply customer tier discount
        discount = self._calculate_loyalty_discount(subtotal, customer.tier)
        
        # Apply best applicable promotion
        promo_discount = self._find_best_promotion(order, promotions)
        
        return subtotal - discount - promo_discount
```

**When to use:**
- Logic spans multiple aggregates
- Calculation involves external input
- Operation doesn't fit entity lifecycle

---

## Domain Event

Record of something that happened in the domain.

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass(frozen=True)
class OrderConfirmed:
    order_id: OrderId
    confirmed_at: datetime
    total: Money
    customer_id: str

@dataclass(frozen=True)
class InventoryReserved:
    product_id: str
    quantity: int
    order_id: OrderId
```

**Patterns:**

```python
# Event Sourcing: Store events as state
class EventStore:
    def append(self, aggregate_id: str, events: List[DomainEvent]) -> None:
        ...
    
    def get_events(self, aggregate_id: str) -> List[DomainEvent]:
        ...

# Event Bus: Publish for side effects
class EventBus:
    def subscribe(self, event_type: Type[T], handler: Handler[T]) -> None:
        ...
    
    def publish(self, event: DomainEvent) -> None:
        ...
```

---

## Repository

Abstract collection interface for aggregates.

```python
from typing import Protocol

class IOrderRepository(Protocol):
    def get(self, id: OrderId) -> Order:
        ...
    
    def add(self, order: Order) -> None:
        ...
    
    def update(self, order: Order) -> None:
        ...
    
    def remove(self, id: OrderId) -> None:
        ...

# With specifications
class IOrderRepository(Protocol):
    def get(self, id: OrderId) -> Optional[Order]: ...
    def find(self, spec: Specification[Order]) -> List[Order]: ...
    def exists(self, spec: Specification[Order]) -> bool: ...
```

---

## Factory

Encapsulate complex object creation.

```python
class OrderFactory:
    def create_from_cart(
        self, 
        cart: ShoppingCart,
        customer: Customer
    ) -> Order:
        if cart.is_empty():
            raise DomainError("Cannot create order from empty cart")
        
        order = Order(
            id=self._generate_id(),
            customer_id=customer.id,
            shipping_address=customer.default_address
        )
        
        for item in cart.items:
            order.add_item(item.product, item.quantity)
        
        return order
```

---

## Specification

Encapsulate query criteria as reusable objects.

```python
from typing import TypeVar, Generic

T = TypeVar('T')

class Specification(ABC, Generic[T]):
    @abstractmethod
    def is_satisfied_by(self, candidate: T) -> bool:
        ...
    
    def and_(self, other: 'Specification[T]') -> 'Specification[T]':
        return AndSpecification(self, other)
    
    def not_(self) -> 'Specification[T]':
        return NotSpecification(self)

class OverdueOrderSpec(Specification[Order]):
    def __init__(self, reference_date: datetime):
        self.reference_date = reference_date
    
    def is_satisfied_by(self, order: Order) -> bool:
        return order.expected_delivery < self.reference_date

# Usage
overdue = OverdueOrderSpec(datetime.now())
high_value = HighValueOrderSpec(Money(1000, "USD"))
overdue_high_value = overdue.and_(high_value)
```

---

## Anti-Corruption Layer

Protect domain from external system models.

```python
class ExternalPaymentGateway:
    """Third-party API with different model"""
    def charge(self, request: GatewayChargeRequest) -> GatewayResponse:
        ...

class PaymentServiceAdapter:
    """ACL: Translate domain to external model"""
    
    def __init__(self, gateway: ExternalPaymentGateway):
        self._gateway = gateway
    
    def process_payment(self, payment: Payment) -> PaymentResult:
        # Translate domain model to external format
        request = self._to_gateway_request(payment)
        
        try:
            response = self._gateway.charge(request)
            # Translate response back to domain
            return self._to_domain_result(response)
        except GatewayError as e:
            # Translate exception to domain exception
            raise PaymentFailed(self._map_error(e))
```
