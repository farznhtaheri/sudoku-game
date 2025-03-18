import { createRoot } from 'react-dom/client'
import Sudoku from './App.jsx'
import { Provider } from "@/components/ui/provider"


createRoot(document.getElementById('root')).render(
    <Sudoku />
)
