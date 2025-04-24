<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     * url: GET /projects
     */
    public function index()
    {
        $projects = Project::all();

        if ($projects->isEmpty()) {
            return response()->json(['message' => 'No projects found'], 404);
        }

        return response()->json($projects, 200);
    }

    /**
     * Display the specified resource.
     * url: GET /project/{id}
     */
    public function show(string $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json($project, 200);
    }

    /**
     * Store a newly created resource in storage.
     * url: POST /project
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'description'  => 'nullable|string',
            'client_id'    => 'nullable|exists:clients,client_id',
            'user_id'      => 'nullable|exists:users,user_id',
            'status'       => 'required|in:en proceso,completado,cancelado',
            'issue_date'   => 'required|date',
            'due_date'     => 'required|date|after_or_equal:issue_date',
            'start_date'   => 'nullable|date',
            'end_date'     => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error creating project',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $project = Project::create($validator->validated());

        return response()->json($project, 201);
    }

    /**
     * Update the specified resource in storage.
     * url: PUT/PATCH /project/{id}
     */
    public function update(Request $request, string $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'description'  => 'nullable|string',
            'client_id'    => 'nullable|exists:clients,client_id',
            'user_id'      => 'nullable|exists:users,user_id',
            'status'       => 'required|in:en proceso,completado,cancelado',
            'issue_date'   => 'required|date',
            'due_date'     => 'required|date|after_or_equal:issue_date',
            'start_date'   => 'nullable|date',
            'end_date'     => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error updating project',
                'errors'  => $validator->errors(),
            ], 400);
        }

        $project->update($validator->validated());

        return response()->json($project, 200);
    }

    /**
     * Remove the specified resource from storage.
     * url: DELETE /project/{id}
     */
    public function destroy(string $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted'], 200);
    }
}
