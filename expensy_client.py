import requests
from typing import List, Dict


class ExpensyClient:
    """REST client for the Expensy service"""

    def __init__(self, base_url: str = "http://192.168.0.243:8000"):
        """
        Initialize the REST client
        Args:
            base_url: Base URL of the REST service
        """
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        # Set default headers
        self.session.headers.update(
            {"Content-Type": "application/json", "Accept": "application/json"}
        )

    def get_categories(self) -> List[Dict[str, any]]:
        """
        Get available categories from the service
        Returns:
            List of categories with structure:
            [
                {
                    "id": 20,
                    "name": "Amistades y familia",
                    "alt_name": "Life & Entertainment"
                },
                {
                    "id": 2,
                    "name": "Comidas y bebidas",
                    "alt_name": "Food"
                },
                ...
            ]
        Raises:
            requests.RequestException: If there's an error communicating with the
            server
        """
        try:
            response = self.session.get(f"{self.base_url}/api/categories/")
            response.raise_for_status()
            return response.json()["results"]
        except requests.RequestException as e:
            print(f"Error getting categories: {e}")
            raise

    def create_record(self, record_data: Dict[str, any]) -> Dict[str, any]:
        """
        Create a new expense/income record
        Args:
            record_data: Dictionary with record data:
                {
                    "description": "Description of the expense/income",
                    "amount": 100.50,
                    "source": "manual",
                    "date": "2024-12-01",
                    "category": 1
                }
        Raises:
            requests.RequestException: If there's an error communicating with the
            server
            ValueError: If the record data is not valid
        """
        # Validate required fields
        required_fields = ["description", "amount", "source", "date", "category"]
        for field in required_fields:
            if field not in record_data or not record_data[field]:
                raise ValueError(f"The field '{field}' is required")
        # Validate amount
        try:
            amount = float(record_data["amount"])
            if amount <= 0:
                raise ValueError("Amount must be greater than 0")
        except (ValueError, TypeError):
            raise ValueError("Amount must be a valid number")
        try:
            response = self.session.post(
                f"{self.base_url}/api/records/", json=record_data
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error creating record: {e}")
            raise

    def close(self):
        """Close the client session"""
        self.session.close()

    def __enter__(self):
        """Context manager entry"""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()
