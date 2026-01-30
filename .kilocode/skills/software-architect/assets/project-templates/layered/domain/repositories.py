"""Repository protocols - interfaces for persistence.

Repositories abstract the data access logic and allow the domain
layer to remain persistence-agnostic.
"""
from typing import Protocol, TypeVar, Optional, List

T = TypeVar('T')

class Repository(Protocol[T]):
    """Generic repository interface."""
    
    def get(self, id: str) -> Optional[T]:
        """Retrieve entity by ID."""
        ...
    
    def add(self, entity: T) -> None:
        """Add new entity."""
        ...
    
    def update(self, entity: T) -> None:
        """Update existing entity."""
        ...
    
    def remove(self, id: str) -> None:
        """Remove entity by ID."""
        ...
    
    def find_all(self) -> List[T]:
        """Retrieve all entities."""
        ...
