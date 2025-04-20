<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetsController extends Controller
{
    /**
     * Display a listing of the resource.
     *  url: GET  /budgets
     */
    public function index()
    {
        return Budget::all(); 
    }

    /**
     * Store a newly created resource in storage.
     *  url: POST /budgets
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'      => 'nullable|exists:clients,client_id',
            'project_id'     => 'nullable|exists:projects,project_id',
            'user_id'        => 'nullable|exists:users,user_id',
            'budget_number'  => 'required|string|unique:budgets,budget_number',
            'issue_date'     => 'required|date',
            'due_date'       => 'required|date|after_or_equal:issue_date',
            'date'           => 'required|date',
            'total'          => 'required|numeric|min:0',
            'status'         => 'nullable|in:Aceptado,Pendiente,Rechazado',
        ]);
    
        $budget = Budget::create($validated);
    
        return response()->json($budget, 201);
    }

    /**
     * Display the specified resource.
     *  url: GET /budgets/{id}
     */
    public function show(string $id)
    {
        $budget = Budget::find($id);

        if (!$budget) {
            return response()->json(['message' => 'Presupuesto no encontrado'], 404);
        }

        return response()->json($budget, 200);
    }

    /**
     * Update the specified resource in storage.
     * url: PUT o  PATCH /budgets/{id}
     */
    public function update(Request $request, string $id)
    {
        $budget = Budget::find($id);

        if (!$budget) {
            return response()->json(['message' => 'Presupuesto no encontrado'], 404);
        }

        $validated = $request->validate([
            'client_id'     => 'nullable|exists:clients,client_id',
            'project_id'    => 'nullable|exists:projects,project_id',
            'user_id'       => 'nullable|exists:users,user_id',
            'budget_number' => 'required|string|unique:budgets,budget_number,' . $id . ',budget_id',
            'issue_date'    => 'required|date',
            'due_date'      => 'required|date|after_or_equal:issue_date',
            'date'          => 'required|date',
            'total'         => 'required|numeric|min:0',
            'status'        => 'nullable|in:Aceptado,Pendiente,Rechazado',
        ]);

        $budget->update($validated);

        return response()->json($budget, 200);
    }

    /**
     * Remove the specified resource from storage.
     * url: DELETE /budgets/{id}    
     */
    public function destroy(string $id)
    {
        $budget = Budget::find($id);

        if (!$budget) {
            return response()->json(['message' => 'Presupuesto no encontrado'], 404);
        }

        $budget->delete();

        return response()->json(['message' => 'Presupuesto eliminado'], 200);
    }
}
