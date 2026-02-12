// import { useState, useEffect } from 'react'
// import TodoForm from '../src/components/TodoForm'
// import TodoList from '../src/components/TodoForm'
// import FilterButtons from '../src/components/FilterButtons'

// function App() {
//   const [todos, setTodos] = useState(() => {
//     const savedTodos = localStorage.getItem('todos')
//     return savedTodos ? JSON.parse(savedTodos) : []
//   })
//   const [filter, setFilter] = useState('all')

//   useEffect(() => {
//     localStorage.setItem('todos', JSON.stringify(todos))
//   }, [todos])

//   const addTodo = (text) => {
//     const newTodo = {
//       id: Date.now(),
//       text,
//       completed: false,
//       createdAt: new Date().toISOString()
//     }
//     setTodos([newTodo, ...todos])
//   }

//   const toggleTodo = (id) => {
//     setTodos(todos.map(todo =>
//       todo.id === id ? { ...todo, completed: !todo.completed } : todo
//     ))
//   }

//   const deleteTodo = (id) => {
//     setTodos(todos.filter(todo => todo.id !== id))
//   }

//   const editTodo = (id, newText) => {
//     setTodos(todos.map(todo =>
//       todo.id === id ? { ...todo, text: newText } : todo
//     ))
//   }

//   const clearCompleted = () => {
//     setTodos(todos.filter(todo => !todo.completed))
//   }

//   const getFilteredTodos = () => {
//     switch (filter) {
//       case 'active':
//         return todos.filter(todo => !todo.completed)
//       case 'completed':
//         return todos.filter(todo => todo.completed)
//       default:
//         return todos
//     }
//   }

//   const activeTodosCount = todos.filter(todo => !todo.completed).length

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
//           📝 My TODO List
//         </h1>
        
//         <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
//           <TodoForm onAdd={addTodo} />
//         </div>

//         <div className="bg-white rounded-lg shadow-2xl p-6">
//           <FilterButtons 
//             currentFilter={filter} 
//             onFilterChange={setFilter}
//             activeTodosCount={activeTodosCount}
//             onClearCompleted={clearCompleted}
//             hasCompletedTodos={todos.some(todo => todo.completed)}
//           />
          
//           <TodoList 
//             todos={getFilteredTodos()}
//             onToggle={toggleTodo}
//             onDelete={deleteTodo}
//             onEdit={editTodo}
//           />

//           {todos.length === 0 && (
//             <p className="text-gray-400 text-center py-8">
//               No todos yet. Add one above to get started! 🚀
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App


import TaskList from '../src/components/TaskList'

function App() {
  return (
    <div className="App">
      <TaskList />
    </div>
  )
}

export default App