<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if(config('app.env') === 'production' || config('app.env') === 'internal-testing' || config('app.env') === 'uat-production' || config('app.env') === 'demo') {
            \URL::forceScheme('https');
        }
    }
}
