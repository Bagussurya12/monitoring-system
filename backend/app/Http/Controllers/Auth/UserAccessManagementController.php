<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Auth\Role as RoleAccess;
use Closure;
use DB, Exception;
use Spatie\Permission\Models\Role;

class UserAccessManagementController extends Controller
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

        $users = new User;
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
        if (! auth()->user()->hasPermissionTo('Settings - User - Assign Users to Roles')) {
            return response()->json([
                'error' => true,
                'error_message' => 'Sorry, you do not have permissions to this action.',
            ]);
        }

        $this->validate($request, [
            'user_id' => 'required',
            'roles' => 'required',
        ]);

        $user = User::find($request->user_id);

        if (empty ($user)) {
            return response()->json([
                'error' => true,
                'error_message' => 'User not found'
            ]);
        }

        foreach ($request->roles as $roleId) {
            $role = Role::find($roleId);
            if (empty ($role)) {
                return response()->json([
                    'error' => true,
                    'error_message' => 'Invalid role selected!',
                ]);
            }
        }

        try {
            // Detach all role from the user & Attach the role to the user
            $user->roles()->detach();

            foreach ($request->roles as $roleId) {
                $role = Role::find($roleId);
                $user->roles()->attach($role);
            }

            return response()->json([
                'error' => false,
                'message' => "User has been updated successfully!",
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
