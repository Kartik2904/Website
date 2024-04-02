import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos");
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const handleSort = (column) => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        setTodos((prevTodos) => [...prevTodos].sort((a, b) => {
            const order = sortOrder === "asc" ? 1 : -1;
            return order * (a[column] - b[column]);
        }));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTodos = todos.filter((todo) =>
        Object.values(todo).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="container mt-4">
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("id")}>Todo ID</th>
                        <th onClick={() => handleSort("title")}>Title</th>
                        <th onClick={() => handleSort("completed")}>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTodos.map((todo) => (
                        <tr key={todo.id}>
                            <td>{todo.id}</td>
                            <td>{todo.title}</td>
                            <td>{todo.completed ? "Completed" : "Incomplete"}</td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => console.log("View User Clicked")}
                                >
                                    View User
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TodoList;
