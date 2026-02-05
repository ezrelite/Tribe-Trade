import requests

def test_marketplace():
    url = "http://localhost:8000/api/store/marketplace/"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                print("First Drop Data:")
                for key, value in data[0].items():
                    print(f"{key}: {value}")
            else:
                print("No drops found.")
        else:
            print(f"Failed to fetch drops: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_marketplace()
