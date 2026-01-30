"""Command handlers - Process write operations.

Each handler:
- Receives a command (data + intent)
- Orchestrates domain objects
- Persists changes
- May publish events
"""
