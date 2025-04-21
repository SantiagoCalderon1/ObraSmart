<?php

namespace App\Http\Controllers;

use App\Models\BudgetDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BudgetDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     *  url: GET  /budget-details
     */
    public function index($id = null)
    {
        $budgetDetails = $id
            ? BudgetDetail::where('budget_id', $id)->get()
            : BudgetDetail::all();

        if ($budgetDetails->isEmpty()) {
            return response()->json([
                'message' => 'No budgetsDetails found',
            ], 404);
        }
        return response()->json($budgetDetails, 200);
    }

    /**
     * Display the specified resource.
     *  url: GET /budget-detail/{id}
     */
    public function show(string $id)
    {
        $BudgetDetail = BudgetDetail::find($id);

        if (!$BudgetDetail) {
            return response()->json(['message' => 'No budgets details found'], 404);
        }

        return response()->json($BudgetDetail, 200);
    }

    /**
     * Store a newly created resource in storage.
     *  url: POST /budget-detail
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'budget_id'      => 'required|string|exists:budgets,budget_id',
            'concept'     => 'required|string|min:5',
            'quantity'     => 'required|number|min:0',
            'discount'     => 'nullable|number|min:0',
            'unit_price'     => 'required|number|min:0',
            'description'     => 'nullable|string',
            'tax'       => 'required|number|min:0',
            'subtotal'           => 'required|number',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error creating budgets details',
                'errors' => $validator->errors(),
            ], 400);
        }

        $BudgetDetail = BudgetDetail::create($validator);

        return response()->json($BudgetDetail, 201);
    }



    /**
     * Update the specified resource in storage.
     * url: PUT o  PATCH /budget-detail/{id}
     */
    public function update(Request $request, string $id)
    {
        $BudgetDetail = BudgetDetail::find($id);

        if (!$BudgetDetail) {
            return response()->json(['message' => 'No budgets details found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'budget_id'      => 'required|string|exists:budgets,budget_id',
            'concept'     => 'required|string|min:5',
            'quantity'     => 'required|number|min:0',
            'discount'     => 'nullable|number|min:0',
            'unit_price'     => 'required|number|min:0',
            'description'     => 'nullable|string',
            'tax'       => 'required|number|min:0',
            'subtotal'           => 'required|number',
        ]);

        $BudgetDetail->update($validator);

        return response()->json($BudgetDetail, 200);
    }

    /**
     * Remove the specified resource from storage.
     * url: DELETE /budget-detail/{id}    
     */
    public function destroy(string $id)
    {
        $BudgetDetail = BudgetDetail::find($id);

        if (!$BudgetDetail) {
            return response()->json(['message' => 'No budgets details found'], 404);
        }

        $BudgetDetail->delete();

        return response()->json(['message' => 'budgets details deleted'], 200);
    }
}
