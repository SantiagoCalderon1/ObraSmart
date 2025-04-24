<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\BudgetDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    /**
     * Display a listing of the resource.
     *  url: GET  /budgets
     */
    public function index()
    {
        $budgets = Budget::all();

        if ($budgets->isEmpty()) {
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
    /* public function store(Request $request)
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
    } */
    public function store(Request $request)
    {
        $data = $request->all();

        $header = $data['header'] ?? [];
        $concepts = $data['concepts'] ?? [];

        $validator = Validator::make($header, [
            'inputClient'    => 'nullable|exists:clients,client_id',
            'inputProject'   => 'nullable|exists:projects,project_id',
            'inputStatus'    => 'nullable|in:Aceptado,Pendiente,Rechazado',
            'inputCreation'  => 'required|date',
            'inputExpiration' => 'required|date|after_or_equal:inputCreation',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al crear el presupuesto, datos invalidos.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Generar número único de presupuesto
        $budgetNumber = 'BGT-' . now()->format('YmdH');

        $budget = Budget::create([
            'client_id'     => $header['inputClient'],
            'project_id'    => $header['inputProject'],
            'user_id'       => Auth::user()->id,
            'budget_number' => $budgetNumber,
            'issue_date'    => $header['inputCreation'],
            'due_date'      => $header['inputExpiration'],
            'date'          => now(),
            'status'        => $header['inputStatus'] ?? 'Pendiente',
            'total'         => collect($concepts)->sum('subtotal'),
        ]);

        // Insertar conceptos si existen
        foreach ($concepts as $item) {
            $conceptValidator = Validator::make($item, [
                'concept'     => 'required|string|min:5',
                'quantity'    => 'required|numeric|min:0',
                'unit_price'  => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'tax'         => 'required|numeric|min:0',
                'discount'    => 'nullable|numeric|min:0',
                'subtotal'    => 'required|numeric',
            ]);

            if ($conceptValidator->fails()) {
                return response()->json([
                    'message' => 'Error en detalle de presupuesto, datos invalidos.',
                    'errors' => $conceptValidator->errors(),
                ], 400);
            }

            BudgetDetail::create([
                'budget_id'   => $budget->budget_id,
                'concept'     => $item['concept'],
                'quantity'    => $item['quantity'],
                'unit_price'  => $item['unit_price'],
                'description' => $item['description'] ?? '',
                'tax'         => $item['tax'],
                'discount'    => $item['discount'] ?? 0,
                'subtotal'    => $item['subtotal'],
            ]);
        }

        return response()->json([
            'message' => 'Presupuesto creado correctamente',
            'data' => $budget,
        ], 201);
    }




    /**
     * Update the specified resource in storage.
     * url: PUT o  PATCH /budget/{id}
     */
    /* public function update(Request $request, string $id)
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
    } */
    public function update(Request $request, $id)
    {
        $budget = Budget::findOrFail($id);

        $data = $request->all();

        $header = $data['header'] ?? [];
        $concepts = $data['concepts'] ?? [];

        $validator = Validator::make($header, [
            'inputClient'    => 'nullable|exists:clients,client_id',
            'inputProject'   => 'nullable|exists:projects,project_id',
            'inputStatus'    => 'nullable|in:Aceptado,Pendiente,Rechazado',
            'inputCreation'  => 'required|date',
            'inputExpiration' => 'required|date|after_or_equal:inputCreation',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al actualizar el presupuesto',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Actualizar presupuesto
        $budget->update([
            'client_id'  => $header['inputClient'],
            'project_id' => $header['inputProject'],
            'issue_date' => $header['inputCreation'],
            'due_date'   => $header['inputExpiration'],
            'status'     => $header['inputStatus'] ?? 'Pendiente',
            'total'      => collect($concepts)->sum('subtotal'),
        ]);

        $existingDetailIds = [];

        foreach ($concepts as $item) {
            $conceptValidator = Validator::make($item, [
                'concept'     => 'required|string|min:5',
                'quantity'    => 'required|numeric|min:0',
                'unit_price'  => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'tax'         => 'required|numeric|min:0',
                'discount'    => 'nullable|numeric|min:0',
                'subtotal'    => 'required|numeric',
            ]);

            if ($conceptValidator->fails()) {
                return response()->json([
                    'message' => 'Error en detalle de presupuesto',
                    'errors' => $conceptValidator->errors(),
                ], 400);
            }

            if (isset($item['id'])) {
                // Actualizar detalle existente
                $detail = BudgetDetail::where('budget_id', $budget->budget_id)
                    ->where('id', $item['id'])
                    ->first();

                if ($detail) {
                    $detail->update([
                        'concept'     => $item['concept'],
                        'quantity'    => $item['quantity'],
                        'unit_price'  => $item['unit_price'],
                        'description' => $item['description'] ?? '',
                        'tax'         => $item['tax'],
                        'discount'    => $item['discount'] ?? 0,
                        'subtotal'    => $item['subtotal'],
                    ]);
                    $existingDetailIds[] = $detail->id;
                }
            } else {
                // Crear nuevo detalle
                $newDetail = BudgetDetail::create([
                    'budget_id'   => $budget->budget_id,
                    'concept'     => $item['concept'],
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $item['unit_price'],
                    'description' => $item['description'] ?? '',
                    'tax'         => $item['tax'],
                    'discount'    => $item['discount'] ?? 0,
                    'subtotal'    => $item['subtotal'],
                ]);
                $existingDetailIds[] = $newDetail->id;
            }
        }

        // Eliminar detalles que ya no están
        BudgetDetail::where('budget_id', $budget->budget_id)
            ->whereNotIn('id', $existingDetailIds)
            ->delete();

        return response()->json([
            'message' => 'Presupuesto actualizado correctamente',
            'data' => $budget->load('details'),
        ]);
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
