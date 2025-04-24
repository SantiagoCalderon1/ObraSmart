<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     * url: GET /clients
     */
    public function index()
    {
        $clients = Client::all();

        if ($clients->isEmpty()) {
            return response()->json([
                'message' => 'No clients found',
            ], 404);
        }

        return response()->json($clients, 200);
    }

    /**
     * Display the specified resource.
     * url: GET /client/{id}
     */
    public function show(string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        return response()->json($client, 200);
    }

    /**
     * Store a newly created resource in storage.
     * url: POST /client
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                => 'required|string|max:255',
            'surname'             => 'nullable|string|max:255',
            'type_document'       => 'required|in:dni,pasaporte,nie,nif',
            'client_id_document'  => 'required|string|unique:clients,client_id_document',
            'email'               => 'required|email|max:255',
            'phone'               => 'nullable|string|max:50',
            'address'             => 'required|string|max:255',
            'city'                => 'required|string|max:100',
            'zip_code'            => 'nullable|string|max:20',
            'country'             => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error creating client',
                'errors' => $validator->errors(),
            ], 400);
        }

        $client = Client::create($validator->validated());

        return response()->json($client, 201);
    }

    /**
     * Update the specified resource in storage.
     * url: PUT/PATCH /client/{id}
     */
    public function update(Request $request, string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'                => 'required|string|max:255',
            'surname'             => 'nullable|string|max:255',
            'type_document'       => 'required|in:dni,pasaporte,nie,nif',
            'client_id_document'  => 'required|string|unique:clients,client_id_document,' . $id . ',client_id',
            'email'               => 'required|email|max:255',
            'phone'               => 'nullable|string|max:50',
            'address'             => 'required|string|max:255',
            'city'                => 'required|string|max:100',
            'zip_code'            => 'nullable|string|max:20',
            'country'             => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error updating client',
                'errors' => $validator->errors(),
            ], 400);
        }

        $client->update($validator->validated());

        return response()->json($client, 200);
    }

    /**
     * Remove the specified resource from storage.
     * url: DELETE /client/{id}
     */
    public function destroy(string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $client->delete();

        return response()->json(['message' => 'Client deleted'], 200);
    }
}
