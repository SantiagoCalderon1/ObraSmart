<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BudgetController extends Controller
{
    /**
     * Display a listing of the resource.
     *  url: GET  /budgets
     */
    public function index()
    {
        $budgets = Budget::all();

        if (!$budgets) {
            return response()->json([
                'message' => 'No budgets found',
            ], 404);
        }
        return response()->json($budgets, 200);
    }

    /**
     * Display the specified resource.
     *  url: GET /budget/{id}
     */
    public function show(string $id)
    {
        $budget = Budget::find($id);

        if (!$budget) {
            return response()->json(['message' => 'No budget found'], 404);
        }

        return response()->json($budget, 200);
    }

    /**
     * Store a newly created resource in storage.
     *  url: POST /budget
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
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

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al crear el presupuesto',
                'errors' => $validator->errors(),
            ], 400);
        }

        $budget = Budget::create($validator);

        return response()->json($budget, 201);
    }

    

    /**
     * Update the specified resource in storage.
     * url: PUT o  PATCH /budget/{id}
     */
    public function update(Request $request, string $id)
    {
        $budget = Budget::find($id);

        if (!$budget) {
            return response()->json(['message' => 'No budget found'], 404);
        }

        $validator = Validator::make($request->all(), [
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

        $budget->update($validator);

        return response()->json($budget, 200);
    }

    /**
     * Remove the specified resource from storage.
     * url: DELETE /budget/{id}    
     */
    public function destroy(string $id)
    {
        $budget = Budget::find($id);

        if (!$budget) {
            return response()->json(['message' => 'No budget found'], 404);
        }

        $budget->delete();

        return response()->json(['message' => 'Budget deleted'], 200);
    }
}
