<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\MasterData\Suppliers;
use App\Http\Requests\MasterData\SupplierRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $user = auth()->user();

            if (!$user->hasPermissionTo('Master Data - Suppliers - Can List Supppliers Management')) {
                return response()->json([
                    'error' => true,
                    'code' => 403,
                    'error_message' => "Sorry, you do not have permissions to this action."
                ], 403);
            }

            $query = Suppliers::query();

            $searchableColumns = Suppliers::getSearchables();
            $orderByColumns = Suppliers::getDefaultOrderBy();

            foreach ($searchableColumns as $column => $operator) {
                if (!empty($request->$column)) {
                    if (strtolower($operator) === 'like') {
                        $query->where($column, $operator, '%' . $request->$column . '%');
                    } else {
                        $query->where($column, $operator, $request->$column);
                    }
                }
            }

            $suppliers = $query
                ->orderBy($orderByColumns['column_name'], $orderByColumns['order'])
                ->paginate(25);

            return response()->json([
                'error' => false,
                'code' => 200,
                'suppliers' => $suppliers,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'code' => 500,
                'error_message' => 'Failed get data suppliers.',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SupplierRequest $request)
    {
        try {
            $user = auth()->user();

            if (!$user->hasPermissionTo('Master Data - Suppliers - Can Create Supppliers Management')) {
                return response()->json([
                    'error' => true,
                    'code' => 403,
                    'error_message' => "Sorry, you do not have permissions to this action."
                ], 403);
            }

            $supplier = Suppliers::create($request->validated());

            return response()->json([
                'error' => false,
                'code' => 201,
                'message' => 'Successful Supplier added.',
                'supplier' => $supplier,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'code' => 500,
                'error_message' => 'Sorry Something when wrong, Please try again later.',
                'exception' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $user = auth()->user();

            if (!$user->hasPermissionTo('Master Data - Suppliers - Can View Supppliers Management')) {
                return response()->json([
                    'error' => true,
                    'code' => 403,
                    'error_message' => "Sorry, you do not have permissions to this action."
                ], 403);
            }

            $supplier = Suppliers::findOrFail($id);

            return response()->json([
                'error' => false,
                'code' => 200,
                'message' => 'Successful Get Data Supplier.',
                'supplier' => $supplier,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'code' => 500,
                'error_message' => 'Sorry Something when wrong, Please try again later.',
                'exception' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, $id)
    {
        try {
            $user = auth()->user();

            if (!$user->hasPermissionTo('Master Data - Suppliers - Can Update Supppliers Management')) {
                return response()->json([
                    'error' => true,
                    'code' => 403,
                    'error_message' => "Sorry, you do not have permissions to this action."
                ], 403);
            }

            $supplier = Suppliers::findOrFail($id);
            $supplier->update($request->validated());

            return response()->json([
                'error' => false,
                'code' => 200,
                'message' => 'Succesful Updated Supplier.',
                'supplier' => $supplier,
            ]);
        } catch (Exception $e) {
            Log::error('Error updating supplier: ' . $e->getMessage());

            return response()->json([
                'error' => true,
                'code' => 500,
               'error_message' => 'Sorry Something when wrong, Please try again later.',
                'exception' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $user = auth()->user();

            if (!$user->hasPermissionTo('Master Data - Suppliers - Can Delete Supppliers Management')) {
                return response()->json([
                    'error' => true,
                    'code' => 403,
                    'error_message' => "Sorry, you do not have permissions to this action."
                ], 403);
            }

            $supplier = Suppliers::findOrFail($id);
            $supplier->delete();

            return response()->json([
                'error' => false,
                'code' => 200,
                'message' => 'Supplier successfully deleted.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'code' => 500,
                'error_message' => 'Sorry Something when wrong, Please try again later.',
                'exception' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

}
