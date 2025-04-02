<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Auth\Role as RoleAccess;
use App\Models\Auth\Permission;
use Exception;
use Illuminate\Support\Facades\Validator;

class RoleManagementController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can List Role Access Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        $roles = new RoleAccess;
        $searchableColumns = RoleAccess::getSearchables();
        $orderByColumns = RoleAccess::getDefaultOrderBy();

        $roles = $roles->where('name', '!=', 'Super Admin');

        foreach ($searchableColumns as $column => $operator) {
            if (! empty ($request->$column)) {
                if (strtolower($operator) == 'like') {
                    $roles = $roles->where($column, $operator, '%'.$request->$column.'%');
                } else {
                    $roles = $roles->where($column, $operator, $request->$column);
                }
            }
        }

        $roles = $roles->with(['permissions'])
                        ->orderBy($orderByColumns['column_name'], $orderByColumns['order'])
                        ->paginate(25);

        return response()->json([
            'error' => false,
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can Create Role Access Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => true,
                'error_message' => $validator->errors()->first()
            ]);
        }

        try {
            $role = RoleAccess::create([
                'name' => $request->name,
                'guard_name' => 'web'
            ]);

            $role->syncPermissions($request->permissions);

            return response()->json([
                'error' => false,
                'message' => "Role has been created successfully!",
                'role' => $role
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'error_message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can Show Role Access Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        // check role already exists or not
        $role = RoleAccess::with(['permissions'])->find($id);

        if (empty($role)) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, we couldn't find that role!"
            ]);
        }

        return response()->json([
            'error' => false,
            'role' => $role,
        ]);
    }

    /**
     * get all permission user
     */
    public function getPermissions(Request $request)
    {
        if (! auth()->user()->hasPermissionTo('Settings - User - List Permissions for a User')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        $permissions = new Permission;
        $searchableColumns = Permission::getSearchables();
        $orderByColumns = Permission::getDefaultOrderBy();

        foreach ($searchableColumns as $column => $operator) {
            if (! empty ($request->$column)) {
                if (strtolower($operator) == 'like') {
                    $permissions = $permissions->where($column, $operator, '%'.$request->$column.'%');
                } else {
                    $permissions = $permissions->where($column, $operator, $request->$column);
                }
            }
        }

        $permissions = $permissions->select('id', 'name')
                        ->orderBy($orderByColumns['column_name'], $orderByColumns['order'])
                        ->paginate(25);

        return response()->json([
            'error' => false,
            'permissions' => $permissions
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can Update Role Access Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        $this->validate($request, [
            'name' => 'required|unique:roles,name,'.$request->id,
            'permissions' => 'required'
        ]);

        $role = RoleAccess::find($request->id);

        if (empty($role)) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, we couldn't find that role!"
            ]);
        }

        try {
            $role->name = $request->name;
            $role->save();

            $role->syncPermissions($request->permissions);

            return response()->json([
                'error' => false,
                'message' => "Role has been updated successfully!",
                'role' => $role
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'error_message' => $e->getMessage()
            ]);
        }
    }

    public function destroy(string $id)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can Delete Role Access Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        $role = RoleAccess::find($id);

        if (empty($role)) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, we couldn't find that role!"
            ]);
        }

        $role->permissions()->detach();

        $role->delete();

        return response()->json([
            'error' => false,
            'message' => "Role has been deleted successfully!"
        ]);
    }
}
