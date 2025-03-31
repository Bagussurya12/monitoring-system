<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();
        if (empty($user)) {
            return response()->json([
                'error' => true,
                'error_message' => 'Username or Password Wrong!'
            ]);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => true,
                'error_message' => 'Username or Password Wrong!'
            ]);
        }

        $apiToken = $user->createToken('Application')->plainTextToken;
        return response()->json([
            'error' => false,
            'api_token' => $apiToken
        ]);
    }
}
