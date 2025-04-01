<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserController extends Controller
{
    public function getAjax(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can List User Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        $users = new User;
        $searchableColumns = User::getSearchables();
        $orderByColumns = User::getDefaultOrderBy();

        foreach ($searchableColumns as $column => $operator) {
            if (!empty($request->$column)) {
                if (strtolower($operator) == 'like') {
                    $users = $users->where($column, $operator, '%' . $request->$column . '%');
                } else {
                    $users = $users->where($column, $operator, $request->$column);
                }
            }
        }

        if(!empty($request->keyword)) {
            $users = $users->where('name', 'like', '%'.$request->keyword.'%');
        }

        $users = $users->orderBy($orderByColumns['column_name'], $orderByColumns['order'])->paginate(25);

        return response()->json([
            'error' => false,
            'users' => $users
        ]);
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can List User Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        $users = new User;
        $searchableColumns = User::getSearchables();
        $orderByColumns = User::getDefaultOrderBy();

        foreach ($searchableColumns as $column => $operator) {
            if (!empty($request->$column)) {
                if (strtolower($operator) == 'like') {
                    $users = $users->where($column, $operator, '%' . $request->$column . '%');
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

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can Create User Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }
        $messages = [
            'password.regex' => 'Password must have at least one uppercase letter, one number, and one special character.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.max' => 'Password cannot exceed 100 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];

        $this->validate($request, [
            'name' => 'required',
            'username' => 'required|alpha_dash|max:255|unique:users,username,NULL,id,deleted_at,NULL',
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/[A-Z]/', // At least one uppercase letter
                'regex:/[0-9]/', // At least one number
                'regex:/[@$!%*?&]/', // At least one special character
                'max:100'
            ],
            'password_confirmation' => 'required',
        ],$messages);

        $user = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'password' => Hash::make($request->password),
            'changed_password' => 0
        ]);

        return response()->json([
            'error' => false,
            'user' => $user
        ]);
    }

    public function show($id)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can Show User Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }
        $user = User::find($id);

        if (empty($user)) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, we couldn't find that user"
            ]);
        }

        return response()->json([
            'error' => false,
            'user' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $loggedInUser = auth()->user();
        if (!$loggedInUser->hasPermissionTo('Settings - User - Can Update User Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        $dataToValidate = [
            'name' => 'required',
            'username' => 'required|unique:users,username,' . $id . ',id,deleted_at,NULL',
        ];


        if (!empty($request->password)) {
            $dataToValidate['password'] = [
                'required',
                'confirmed',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&]/',
                'max:100',
            ];
        }

        $messages = [
            'password.regex' => 'Password must have at least one uppercase letter, one number, and one special character.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.max' => 'Password cannot exceed 100 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];

        $this->validate($request, $dataToValidate, $messages);

        $user = User::find($id);
        if (empty($user)) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, we couldn't find that user"
            ]);
        }

        $updateData = [];
        if (!empty($request->password)) {
            $updateData['password'] = Hash::make($request->password);
            $updateData['changed_password'] = 1;
        }


        $user->update(array_merge($request->except([
            'password',
            'password_confirmation',
            'changed_password',
        ]), $updateData));

        return response()->json([
            'error' => false,
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo('Settings - User - Can Delete User Management')) {
            return response()->json([
                'error' => true,
                'error_message' => "Sorry, you do not have permissions to this action."
            ]);
        }

        User::find($id)->delete();

        return response()->json([
            'error' => false,
            'message' => 'Successfully deleted user'
        ]);
    }

    public function resetTwoFa(Request $request, $id)
    {
        if (!auth()->user()->hasPermissionTo('Settings - User - Can Reset 2FA User')) {
            return response()->json([
                'error' => true,
                'error_message' => 'You do not have permission to user management'
            ], 403);
        }

        $user = User::where('id', $id)->first();

        if (empty($user)) {
            return response()->json([
                'error' => true,
                'error_message' => 'This user is no longer exists.'
            ]);
        }

        $user->two_factor_secret = null;
        $user->two_factor_enabled = 0;
        $user->save();

        return response()->json([
            'error' => false,
            'message' => '2FA for this User has been reset sucessfully'
        ]);
    }
}
