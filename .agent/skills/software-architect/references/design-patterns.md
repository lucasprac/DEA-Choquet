# Design Patterns Catalog

## Table of Contents
- [Creational](#creational)
- [Structural](#structural)
- [Behavioral](#behavioral)
- [Architectural](#architectural)

---

## Creational

### Factory Method

```python
from typing import Protocol

class DocumentParser(Protocol):
    def parse(self, content: str) -> Document: ...

class PDFParser:
    def parse(self, content: str) -> Document: ...

class XMLParser:
    def parse(self, content: str) -> Document: ...

class ParserFactory:
    _parsers = {
        'pdf': PDFParser,
        'xml': XMLParser,
    }
    
    @classmethod
    def create(cls, file_type: str) -> DocumentParser:
        parser_class = cls._parsers.get(file_type)
        if not parser_class:
            raise ValueError(f"Unknown type: {file_type}")
        return parser_class()
```

### Abstract Factory

```python
class UIComponentFactory(Protocol):
    def create_button(self) -> Button: ...
    def create_textbox(self) -> TextBox: ...

class WindowsUIFactory:
    def create_button(self) -> Button:
        return WindowsButton()
    def create_textbox(self) -> TextBox:
        return WindowsTextBox()

class MacUIFactory:
    def create_button(self) -> Button:
        return MacButton()
    def create_textbox(self) -> TextBox:
        return MacTextBox()
```

### Builder

```python
from typing import Self

class QueryBuilder:
    def __init__(self):
        self._select: List[str] = []
        self._from: str = ""
        self._where: List[str] = []
        self._params: Dict[str, Any] = {}
    
    def select(self, *columns: str) -> Self:
        self._select.extend(columns)
        return self
    
    def from_table(self, table: str) -> Self:
        self._from = table
        return self
    
    def where(self, condition: str, **params) -> Self:
        self._where.append(condition)
        self._params.update(params)
        return self
    
    def build(self) -> Tuple[str, Dict]:
        sql = f"SELECT {', '.join(self._select)} FROM {self._from}"
        if self._where:
            sql += " WHERE " + " AND ".join(self._where)
        return sql, self._params

# Usage
query = (QueryBuilder()
    .select("id", "name", "email")
    .from_table("users")
    .where("age > :min_age", min_age=18)
    .where("status = :status", status="active")
    .build())
```

### Singleton (Use sparingly)

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def get_config() -> Config:
    return Config.load_from_env()

# Or explicit singleton
class Singleton:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

---

## Structural

### Adapter

```python
class LegacyPaymentGateway:
    """Third-party class with incompatible interface"""
    def make_payment(self, amount_cents: int, currency_code: str) -> dict:
        ...

class PaymentProcessor(Protocol):
    def process(self, amount: Money) -> PaymentResult: ...

class LegacyPaymentAdapter:
    def __init__(self, gateway: LegacyPaymentGateway):
        self._gateway = gateway
    
    def process(self, amount: Money) -> PaymentResult:
        response = self._gateway.make_payment(
            amount_cents=int(amount.amount * 100),
            currency_code=amount.currency
        )
        return self._adapt_response(response)
```

### Decorator

```python
from functools import wraps
from typing import Callable

class DataSource(Protocol):
    def read(self) -> str: ...
    def write(self, data: str) -> None: ...

class FileDataSource:
    def __init__(self, filename: str):
        self._filename = filename
    def read(self) -> str: ...
    def write(self, data: str) -> None: ...

class CompressionDecorator:
    def __init__(self, source: DataSource):
        self._source = source
    
    def read(self) -> str:
        compressed = self._source.read()
        return self._decompress(compressed)
    
    def write(self, data: str) -> None:
        compressed = self._compress(data)
        self._source.write(compressed)

class EncryptionDecorator:
    def __init__(self, source: DataSource, key: str):
        self._source = source
        self._key = key
    
    def read(self) -> str:
        encrypted = self._source.read()
        return self._decrypt(encrypted)
    
    def write(self, data: str) -> None:
        encrypted = self._encrypt(data)
        self._source.write(encrypted)

# Usage
source = EncryptionDecorator(
    CompressionDecorator(FileDataSource("data.txt")),
    key="secret"
)
```

### Facade

```python
class OrderProcessingFacade:
    """Simplifies complex subsystem interactions"""
    
    def __init__(
        self,
        inventory: InventoryService,
        payment: PaymentService,
        shipping: ShippingService,
        notification: NotificationService
    ):
        self._inventory = inventory
        self._payment = payment
        self._shipping = shipping
        self._notification = notification
    
    def place_order(self, order: Order) -> OrderResult:
        # Check inventory
        if not self._inventory.reserve(order.items):
            return OrderResult.failed("Out of stock")
        
        # Process payment
        payment = self._payment.charge(order.total)
        if not payment.success:
            self._inventory.release(order.items)
            return OrderResult.failed("Payment failed")
        
        # Schedule shipping
        shipment = self._shipping.create_shipment(order)
        
        # Send confirmation
        self._notification.send_order_confirmation(order)
        
        return OrderResult.success(order.id, shipment.tracking_id)
```

### Proxy

```python
from typing import Optional

class Image(Protocol):
    def display(self) -> None: ...

class RealImage:
    def __init__(self, filename: str):
        self._filename = filename
        self._load_from_disk()
    
    def _load_from_disk(self) -> None:
        print(f"Loading {self._filename}")
    
    def display(self) -> None:
        print(f"Displaying {self._filename}")

class ImageProxy:
    """Virtual Proxy - lazy loading"""
    def __init__(self, filename: str):
        self._filename = filename
        self._real_image: Optional[RealImage] = None
    
    def display(self) -> None:
        if self._real_image is None:
            self._real_image = RealImage(self._filename)
        self._real_image.display()

class ProtectionProxy:
    """Access control proxy"""
    def __init__(self, service: Service, user: User):
        self._service = service
        self._user = user
    
    def delete(self, id: str) -> None:
        if not self._user.has_permission("delete"):
            raise PermissionError()
        self._service.delete(id)
```

---

## Behavioral

### Strategy

```python
from typing import Protocol

class CompressionStrategy(Protocol):
    def compress(self, data: bytes) -> bytes: ...

class ZipCompression:
    def compress(self, data: bytes) -> bytes:
        import zlib
        return zlib.compress(data)

class RarCompression:
    def compress(self, data: bytes) -> bytes:
        ...

class Compressor:
    def __init__(self, strategy: CompressionStrategy):
        self._strategy = strategy
    
    def compress_file(self, filepath: str) -> bytes:
        data = Path(filepath).read_bytes()
        return self._strategy.compress(data)

# Usage
compressor = Compressor(ZipCompression())
compressed = compressor.compress_file("data.txt")
```

### Observer / Event Bus

```python
from typing import TypeVar, Generic, List, Callable

T = TypeVar('T')

class EventBus:
    def __init__(self):
        self._handlers: Dict[Type, List[Callable]] = {}
    
    def subscribe(self, event_type: Type[T], handler: Callable[[T], None]) -> None:
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
    
    def publish(self, event: T) -> None:
        event_type = type(event)
        handlers = self._handlers.get(event_type, [])
        for handler in handlers:
            handler(event)

@dataclass
class OrderCreated:
    order_id: str
    customer_id: str

# Usage
bus = EventBus()
bus.subscribe(OrderCreated, lambda e: print(f"Order {e.order_id} created"))
bus.subscribe(OrderCreated, lambda e: send_email(e.customer_id))
bus.publish(OrderCreated("123", "cust-456"))
```

### Template Method

```python
from abc import ABC, abstractmethod

class DataImporter(ABC):
    """Template defines algorithm skeleton"""
    
    def import_data(self, source: str) -> ImportResult:
        raw_data = self._fetch_data(source)
        parsed = self._parse(raw_data)
        validated = self._validate(parsed)
        return self._save(validated)
    
    @abstractmethod
    def _fetch_data(self, source: str) -> str:
        """Primitive operation - must implement"""
        ...
    
    @abstractmethod
    def _parse(self, data: str) -> List[Dict]:
        ...
    
    def _validate(self, records: List[Dict]) -> List[Dict]:
        """Hook - default implementation, can override"""
        return [r for r in records if self._is_valid(r)]
    
    def _is_valid(self, record: Dict) -> bool:
        return True
    
    def _save(self, records: List[Dict]) -> ImportResult:
        ...  # Common implementation

class CSVImporter(DataImporter):
    def _fetch_data(self, source: str) -> str:
        return Path(source).read_text()
    
    def _parse(self, data: str) -> List[Dict]:
        import csv
        return list(csv.DictReader(data.splitlines()))

class APIImporter(DataImporter):
    def _fetch_data(self, source: str) -> str:
        import requests
        return requests.get(source).text
    
    def _parse(self, data: str) -> List[Dict]:
        import json
        return json.loads(data)
```

### Command

```python
from dataclasses import dataclass
from typing import Protocol
from datetime import datetime

class Command(Protocol):
    def execute(self) -> None: ...
    def undo(self) -> None: ...

@dataclass
class TransferMoneyCommand:
    from_account: str
    to_account: str
    amount: Decimal
    _repository: AccountRepository
    _executed: bool = False
    _timestamp: Optional[datetime] = None
    
    def execute(self) -> None:
        if self._executed:
            return
        
        from_acc = self._repository.get(self.from_account)
        to_acc = self._repository.get(self.to_account)
        
        from_acc.debit(self.amount)
        to_acc.credit(self.amount)
        
        self._timestamp = datetime.now()
        self._executed = True
    
    def undo(self) -> None:
        if not self._executed:
            return
        
        from_acc = self._repository.get(self.from_account)
        to_acc = self._repository.get(self.to_account)
        
        from_acc.credit(self.amount)
        to_acc.debit(self.amount)
        
        self._executed = False

class CommandInvoker:
    def __init__(self):
        self._history: List[Command] = []
        self._current = -1
    
    def execute(self, command: Command) -> None:
        command.execute()
        self._history = self._history[:self._current + 1]
        self._history.append(command)
        self._current += 1
    
    def undo(self) -> None:
        if self._current >= 0:
            self._history[self._current].undo()
            self._current -= 1
    
    def redo(self) -> None:
        if self._current < len(self._history) - 1:
            self._current += 1
            self._history[self._current].execute()
```

---

## Architectural

### Repository + Unit of Work

```python
from typing import Protocol, TypeVar, Generic
from contextlib import contextmanager

T = TypeVar('T')

class IRepository(Protocol, Generic[T]):
    def get(self, id: str) -> T: ...
    def add(self, entity: T) -> None: ...
    def update(self, entity: T) -> None: ...
    def remove(self, entity: T) -> None: ...

class IUnitOfWork(Protocol):
    def commit(self) -> None: ...
    def rollback(self) -> None: ...

class SQLUnitOfWork:
    def __init__(self, session_factory):
        self._session_factory = session_factory
        self._session = None
    
    def __enter__(self):
        self._session = self._session_factory()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.rollback()
        self._session.close()
    
    def commit(self) -> None:
        self._session.commit()
    
    def rollback(self) -> None:
        self._session.rollback()
    
    @property
    def orders(self) -> IRepository[Order]:
        return SQLOrderRepository(self._session)

# Usage
with SQLUnitOfWork(session_factory) as uow:
    order = uow.orders.get(order_id)
    order.confirm()
    uow.commit()
```

### CQRS (Command Query Responsibility Segregation)

```python
# Commands (Write Model)
@dataclass
class CreateOrderCommand:
    customer_id: str
    items: List[OrderItemDto]

class CreateOrderHandler:
    def __init__(self, repository: IOrderRepository, event_bus: IEventBus):
        self._repository = repository
        self._event_bus = event_bus
    
    def handle(self, command: CreateOrderCommand) -> str:
        order = Order.create(command.customer_id, command.items)
        self._repository.add(order)
        self._event_bus.publish(OrderCreated(order.id))
        return order.id

# Queries (Read Model)
@dataclass
class OrderSummaryDto:
    order_id: str
    customer_name: str
    total: Decimal
    status: str

class IOrderQueryService(Protocol):
    def get_order_summary(self, order_id: str) -> OrderSummaryDto: ...
    def get_customer_orders(
        self, 
        customer_id: str,
        page: int,
        size: int
    ) -> PaginatedResult[OrderSummaryDto]: ...

class SQLOrderQueryService:
    """Optimized for reads - can bypass domain model"""
    def __init__(self, db: Database):
        self._db = db
    
    def get_order_summary(self, order_id: str) -> OrderSummaryDto:
        row = self._db.execute("""
            SELECT o.id, c.name, o.total, o.status
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.id = :id
        """, {"id": order_id}).fetchone()
        
        return OrderSummaryDto(
            order_id=row.id,
            customer_name=row.name,
            total=row.total,
            status=row.status
        )
```

### Saga / Process Manager

```python
@dataclass
class OrderSaga:
    """Orchestrates long-running transaction"""
    order_id: str
    customer_id: str
    status: SagaStatus = SagaStatus.STARTED
    
    def handle_inventory_reserved(self, event: InventoryReserved) -> None:
        self.status = SagaStatus.INVENTORY_RESERVED
        # Trigger payment
        process_payment(self.order_id)
    
    def handle_payment_completed(self, event: PaymentCompleted) -> None:
        self.status = SagaStatus.PAYMENT_COMPLETED
        # Trigger shipping
        schedule_shipping(self.order_id)
    
    def handle_payment_failed(self, event: PaymentFailed) -> None:
        # Compensating transaction
        release_inventory(self.order_id)
        self.status = SagaStatus.FAILED
```

### Circuit Breaker

```python
from enum import Enum, auto
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = auto()      # Normal operation
    OPEN = auto()        # Failing, reject calls
    HALF_OPEN = auto()   # Testing if recovered

class CircuitBreaker:
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: timedelta = timedelta(seconds=30)
    ):
        self._failure_threshold = failure_threshold
        self._recovery_timeout = recovery_timeout
        self._state = CircuitState.CLOSED
        self._failures = 0
        self._last_failure_time: Optional[datetime] = None
    
    def call(self, func: Callable, *args, **kwargs):
        if self._state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self._state = CircuitState.HALF_OPEN
            else:
                raise CircuitBreakerOpen("Service unavailable")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
    
    def _on_success(self) -> None:
        self._failures = 0
        self._state = CircuitState.CLOSED
    
    def _on_failure(self) -> None:
        self._failures += 1
        self._last_failure_time = datetime.now()
        if self._failures >= self._failure_threshold:
            self._state = CircuitState.OPEN
    
    def _should_attempt_reset(self) -> bool:
        if self._last_failure_time is None:
            return True
        return datetime.now() - self._last_failure_time > self._recovery_timeout
```
