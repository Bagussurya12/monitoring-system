<?php

namespace App\Http\Controllers\Users;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Auth\Role as RoleAccess;
use App\Models\Auth\Permission;
use Closure;
use DB, Exception;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;


class AccessManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (! auth()->user()->hasPermissionTo('Settings - User - Assign Users to Roles')) {
            return response()->json([
                'error' => true,
                'error_message' => 'Sorry, you do not have permissions to this action.',
            ]);
        }

        $users = User::with('roles');
        $searchableColumns = User::getSearchables();
        $orderByColumns = User::getDefaultOrderBy();

        foreach ($searchableColumns as $column => $operator) {
            if (! empty ($request->$column)) {
                if (strtolower($operator) == 'like') {
                    $users = $users->where($column, $operator, '%'.$request->$column.'%');
                } else {
                    $users = $users->where($column, $operator, $request->$column);
                }
            }
        }

        $users = $users->where('id', '!=', auth()->user()->id)
                        ->orderBy($orderByColumns['column_name'], $orderByColumns['order'])
                        ->paginate(25);

        return response()->json([
            'error' => false,
            'users' => $users
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (! auth()->user()->hasPermissionTo('Settings - User - Assign Users to Roles')) {
            return response()->json([
                'error' => true,
                'error_message' => 'Sorry, you do not have permissions to this action.',
            ]);
        }

        // check user already exists or not
        $user = User::where('id', $id)->first();
        if (empty($user)) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, we couldn't find that user!"
            ]);
        }

        // Get all role users
        $roles = $user->roles()->get()->toArray();

        return response()->json([
            'error' => false,
            'user' => $user,
            'roles' => $roles
        ]);
    }

    /**
     * get all role
     */
    public function getAllRoles(Request $request)
    {
        if (! auth()->user()->hasPermissionTo('Settings - User - Assign Users to Roles')) {
            return response()->json([
                'error' => true,
                'error_message' => 'Sorry, you do not have permissions to this action.',
            ]);
        }

        $roles = new RoleAccess;
        $searchableColumns = RoleAccess::getSearchables();
        $orderByColumns = RoleAccess::getDefaultOrderBy();

        foreach ($searchableColumns as $column => $operator) {
            if (! empty ($request->$column)) {
                if (strtolower($operator) == 'like') {
                    $roles = $roles->where($column, $operator, '%'.$request->$column.'%');
                } else {
                    $roles = $roles->where($column, $operator, $request->$column);
                }
            }
        }

        $roles = $roles->select('id', 'name')
                        ->orderBy($orderByColumns['column_name'], $orderByColumns['order'])
                        ->paginate(25);

        return response()->json([
            'error' => false,
            'roles' => $roles
        ]);
    }

    /**
     * get all permission user
     */
    public function getPermissions()
    {
        $user = auth()->user();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        return response()->json([
            'error' => false,
            'permissions' => $permissions
        ]);
    }

    /**
     * get all role user
     */
    public function getRoles()
    {
        $user = auth()->user();
        $roles = $user->roles()->pluck('name')->toArray();

        return response()->json([
            'error' => false,
            'roles' => $roles
        ]);
    }

    /**
     * assign user roles
     */
    public function assignRole(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('Settings - User - Assign Users to Roles')) {
            return response()->json([
                'error' => true,
                'error_message' => 'Sorry, you do not have permissions to this action.',
            ]);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => true,
                'error_message' => $validator->errors()->first(),
            ]);
        }

        try {
            $user = User::findOrFail($request->user_id);
            $roleNames = Role::whereIn('id', $request->roles)->pluck('name')->toArray();

            $user->syncRoles($roleNames);

            return response()->json([
                'error' => false,
                'message' => "User roles updated successfully!",
                'user' => $user
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'error_message' => $e->getMessage()
            ]);
        }
    }
}