import requests
import json

BASE_URL = "http://localhost:8001/api"

def test_todo_endpoints():
    print("Testing Todo API endpoints...")
    
    # Test creating a todo
    print("\n1. Creating a new todo...")
    todo_data = {"title": "Test todo item"}
    response = requests.post(f"{BASE_URL}/todos", json=todo_data)
    
    if response.status_code == 200:
        created_todo = response.json()
        print(f"✅ Todo created: {created_todo}")
        todo_id = created_todo["id"]
    else:
        print(f"❌ Failed to create todo: {response.status_code} - {response.text}")
        return
    
    # Test getting all todos
    print("\n2. Getting all todos...")
    response = requests.get(f"{BASE_URL}/todos")
    
    if response.status_code == 200:
        todos = response.json()
        print(f"✅ Retrieved {len(todos)} todos")
        for todo in todos:
            print(f"   - {todo['title']} (completed: {todo['completed']})")
    else:
        print(f"❌ Failed to get todos: {response.status_code} - {response.text}")
    
    # Test updating a todo
    print("\n3. Updating todo (mark as completed)...")
    update_data = {"completed": True}
    response = requests.put(f"{BASE_URL}/todos/{todo_id}", json=update_data)
    
    if response.status_code == 200:
        updated_todo = response.json()
        print(f"✅ Todo updated: {updated_todo}")
    else:
        print(f"❌ Failed to update todo: {response.status_code} - {response.text}")
    
    # Test creating another todo
    print("\n4. Creating another todo...")
    todo_data2 = {"title": "Second test todo"}
    response = requests.post(f"{BASE_URL}/todos", json=todo_data2)
    
    if response.status_code == 200:
        created_todo2 = response.json()
        print(f"✅ Second todo created: {created_todo2}")
        todo_id2 = created_todo2["id"]
    else:
        print(f"❌ Failed to create second todo: {response.status_code} - {response.text}")
        return
    
    # Test getting todos again
    print("\n5. Getting all todos after updates...")
    response = requests.get(f"{BASE_URL}/todos")
    
    if response.status_code == 200:
        todos = response.json()
        print(f"✅ Retrieved {len(todos)} todos")
        for todo in todos:
            print(f"   - {todo['title']} (completed: {todo['completed']})")
    else:
        print(f"❌ Failed to get todos: {response.status_code} - {response.text}")
    
    # Test deleting a todo
    print(f"\n6. Deleting todo with ID: {todo_id2}...")
    response = requests.delete(f"{BASE_URL}/todos/{todo_id2}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Todo deleted: {result}")
    else:
        print(f"❌ Failed to delete todo: {response.status_code} - {response.text}")
    
    # Test getting todos after deletion
    print("\n7. Getting all todos after deletion...")
    response = requests.get(f"{BASE_URL}/todos")
    
    if response.status_code == 200:
        todos = response.json()
        print(f"✅ Retrieved {len(todos)} todos")
        for todo in todos:
            print(f"   - {todo['title']} (completed: {todo['completed']})")
    else:
        print(f"❌ Failed to get todos: {response.status_code} - {response.text}")

if __name__ == "__main__":
    try:
        test_todo_endpoints()
        print("\n🎉 All tests completed!")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Make sure the backend is running on port 8001.")
    except Exception as e:
        print(f"❌ An error occurred: {e}")